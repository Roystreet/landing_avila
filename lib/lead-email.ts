import { resend } from "@/lib/resend"

type SendLeadEmailInput = {
    subject: string
    text: string
    html: string
    replyTo?: string
}

export const sendLeadEmail = async ({ subject, text, html, replyTo }: SendLeadEmailInput) => {
    const from = process.env.LEADS_FROM_EMAIL
    const to = process.env.LEADS_TO_EMAIL || "soluciones@avilasystem.com"

    if (!resend || !from) {
        return { ok: false as const, reason: "email_not_configured" }
    }

    const { error } = await resend.emails.send({
        from,
        to,
        subject,
        text,
        html,
        replyTo: replyTo || to,
    })

    if (error) {
        console.error("Error sending lead email:", error)
        return { ok: false as const, reason: "email_provider_error" }
    }

    return { ok: true as const }
}

export const escapeHtml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;")