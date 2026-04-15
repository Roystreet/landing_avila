import { NextResponse } from "next/server"
import { getLeadValidationDetails, quoteSchema } from "@/lib/lead-schemas"
import { assertRateLimit, getClientIp } from "@/lib/lead-security"
import { escapeHtml, sendLeadEmail } from "@/lib/lead-email"

const getString = (value: unknown) => (typeof value === "string" ? value : "")

const getArray = (value: unknown) => {
    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === "string")
    }

    if (typeof value === "string" && value.trim().length > 0) {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
    }

    return []
}

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request)
        const rate = assertRateLimit(`quote:${ip}`)

        if (!rate.ok) {
            return NextResponse.json({ ok: false, message: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." }, { status: 429 })
        }

        let rawBody: unknown

        try {
            rawBody = await request.json()
        } catch {
            return NextResponse.json({ ok: false, message: "No se pudo procesar la solicitud. Recarga la pagina e intenta de nuevo." }, { status: 400 })
        }

        if (!rawBody || typeof rawBody !== "object" || Array.isArray(rawBody)) {
            return NextResponse.json({ ok: false, message: "El formato del formulario es invalido." }, { status: 400 })
        }

        const body = rawBody as Record<string, unknown>
        const parsed = quoteSchema.safeParse({
            services: getArray(body.services),
            projectName: getString(body.projectName),
            projectDescription: getString(body.projectDescription),
            timeline: getString(body.timeline),
            budget: getString(body.budget),
            fullName: getString(body.fullName),
            company: getString(body.company),
            email: getString(body.email),
            phone: getString(body.phone),
            hp: getString(body.hp),
        })

        if (!parsed.success) {
            const { fieldErrors, missingFields } = getLeadValidationDetails(parsed.error)

            return NextResponse.json(
                {
                    ok: false,
                    message: missingFields.length > 0 ? "Completa los campos obligatorios del formulario." : "Revisa la informacion ingresada en el formulario.",
                    missingFields,
                    fieldErrors,
                },
                { status: 400 }
            )
        }

        const { services, projectName, projectDescription, timeline, budget, fullName, company, email, phone } = parsed.data

        const lines = [
            "Nuevo lead desde formulario de Cotizacion",
            "",
            `Nombre: ${fullName}`,
            `Empresa: ${company || "No indicada"}`,
            `Email: ${email}`,
            `Telefono: ${phone}`,
            `Servicios solicitados: ${services.join(", ")}`,
            `Proyecto: ${projectName}`,
            `Plazo: ${timeline}`,
            `Presupuesto: ${budget}`,
            "",
            "Descripcion:",
            projectDescription,
        ]

        const html = `
      <h2>Nuevo lead desde Cotizacion</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(company || "No indicada")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Servicios solicitados:</strong> ${escapeHtml(services.join(", "))}</p>
      <p><strong>Proyecto:</strong> ${escapeHtml(projectName)}</p>
      <p><strong>Plazo:</strong> ${escapeHtml(timeline)}</p>
      <p><strong>Presupuesto:</strong> ${escapeHtml(budget)}</p>
      <h3>Descripcion</h3>
      <p>${escapeHtml(projectDescription).replaceAll("\n", "<br />")}</p>
    `

        const sent = await sendLeadEmail({
            subject: `Nuevo lead de Cotizacion - ${fullName}`,
            text: lines.join("\n"),
            html,
            replyTo: email,
        })
        console.log("Quote lead email sent:", sent)

        return NextResponse.json({ ok: true, message: "Cotizacion enviada con exito. Te responderemos en menos de 24 horas habiles." })
    } catch (error) {
        console.error("Error processing quote lead", error)
        return NextResponse.json({ ok: false, message: "Ocurrio un error inesperado." }, { status: 500 })
    }
}