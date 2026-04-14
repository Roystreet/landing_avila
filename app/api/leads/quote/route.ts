import { NextResponse } from "next/server"
import { quoteSchema } from "@/lib/lead-schemas"
import { assertRateLimit, getClientIp, verifyTurnstileToken } from "@/lib/lead-security"
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

        const body = (await request.json()) as Record<string, unknown>

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
            captchaToken: getString(body.captchaToken),
            hp: getString(body.hp),
        })

        if (!parsed.success) {
            return NextResponse.json({ ok: false, message: "Revisa los campos del formulario." }, { status: 400 })
        }

        const captcha = await verifyTurnstileToken(parsed.data.captchaToken, ip)
        if (!captcha.ok) {
            return NextResponse.json({ ok: false, message: "No se pudo validar el captcha." }, { status: 400 })
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

        if (!sent.ok) {
            return NextResponse.json({ ok: false, message: "No se pudo enviar el correo. Intenta de nuevo." }, { status: 500 })
        }

        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false, message: "Ocurrio un error inesperado." }, { status: 500 })
    }
}