const RESEND_ENDPOINT = "https://api.resend.com/emails"

type SendLeadEmailInput = {
    subject: string
    text: string
    html: string
    replyTo?: string
}

export const sendLeadEmail = async ({ subject, text, html, replyTo }: SendLeadEmailInput) => {
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.LEADS_FROM_EMAIL
    const to = process.env.LEADS_TO_EMAIL || "soluciones@avilasystem.com"

    if (!apiKey || !from) {
        return { ok: false as const, reason: "email_not_configured" }
    }

    const response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from,
            to,
            subject,
            text,
            html,
            reply_to: replyTo || to,
        }),
        cache: "no-store",
    })

    if (!response.ok) {
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