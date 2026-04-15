import { NextResponse } from "next/server"
import { contactSchema, getLeadValidationDetails } from "@/lib/lead-schemas"
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
        const rate = assertRateLimit(`contact:${ip}`)

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
        const parsed = contactSchema.safeParse({
            fullName: getString(body.fullName),
            company: getString(body.company),
            email: getString(body.email),
            phone: getString(body.phone),
            projectType: getString(body.projectType),
            budget: getString(body.budget),
            industry: getString(body.industry),
            projectDescription: getString(body.projectDescription),
            contactPreferences: getArray(body.contactPreferences),
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

        const { fullName, company, email, phone, projectType, budget, industry, projectDescription, contactPreferences } = parsed.data

        const lines = [
            "Nuevo lead desde formulario de Contacto",
            "",
            `Nombre: ${fullName}`,
            `Empresa: ${company || "No indicada"}`,
            `Email: ${email}`,
            `Telefono: ${phone}`,
            `Tipo de proyecto: ${projectType}`,
            `Presupuesto: ${budget}`,
            `Industria: ${industry || "No indicada"}`,
            `Canales de contacto: ${contactPreferences.join(", ")}`,
            "",
            "Descripcion:",
            projectDescription,
        ]

        const html = `
      <h2>Nuevo lead desde Contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(fullName)}</p>
      <p><strong>Empresa:</strong> ${escapeHtml(company || "No indicada")}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Tipo de proyecto:</strong> ${escapeHtml(projectType)}</p>
      <p><strong>Presupuesto:</strong> ${escapeHtml(budget)}</p>
      <p><strong>Industria:</strong> ${escapeHtml(industry || "No indicada")}</p>
      <p><strong>Canales de contacto:</strong> ${escapeHtml(contactPreferences.join(", "))}</p>
      <h3>Descripcion</h3>
      <p>${escapeHtml(projectDescription).replaceAll("\n", "<br />")}</p>
    `

        const sent = await sendLeadEmail({
            subject: `Nuevo lead de Contacto - ${fullName}`,
            text: lines.join("\n"),
            html,
            replyTo: email,
        })

        if (!sent.ok) {
            return NextResponse.json({ ok: false, message: "No se pudo enviar el mensaje en este momento. Intenta de nuevo en unos minutos." }, { status: 502 })
        }

        return NextResponse.json({ ok: true, message: "Mensaje enviado con exito. Te responderemos en menos de 24 horas habiles." })
    } catch (error) {
        console.error("Error processing contact lead", error)
        return NextResponse.json({ ok: false, message: "Ocurrio un error inesperado." }, { status: 500 })
    }
}