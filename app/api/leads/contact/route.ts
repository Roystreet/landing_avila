import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/lead-schemas"
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
        const rate = assertRateLimit(`contact:${ip}`)

        if (!rate.ok) {
            return NextResponse.json({ ok: false, message: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." }, { status: 429 })
        }

        const body = (await request.json()) as Record<string, unknown>

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
            captchaToken: getString(body.captchaToken),
            hp: getString(body.hp),
        })

        if (!parsed.success) {
            return NextResponse.json({ ok: false, message: "Revisa los campos del formulario." }, { status: 400 })
        }

        const captcha = await verifyTurnstileToken(parsed.data.captchaToken, ip, {
            expectedAction: "contact",
            expectedHostname: process.env.TURNSTILE_EXPECTED_HOSTNAME,
        })
        if (!captcha.ok) {
            const captchaMessage =
                captcha.reason === "captcha_timeout"
                    ? "El captcha expiro. Completalo nuevamente e intenta de nuevo."
                    : "No se pudo validar el captcha."
            return NextResponse.json({ ok: false, message: captchaMessage }, { status: 400 })
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
            return NextResponse.json({ ok: false, message: "No se pudo enviar el correo. Intenta de nuevo." }, { status: 500 })
        }

        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ ok: false, message: "Ocurrio un error inesperado." }, { status: 500 })
    }
}