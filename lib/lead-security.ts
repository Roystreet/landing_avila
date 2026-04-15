import { randomUUID } from "crypto"

type RateBucket = {
    count: number
    resetAt: number
}

const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 8

const buckets = new Map<string, RateBucket>()

const now = () => Date.now()

export const getClientIp = (request: Request) => {
    const xff = request.headers.get("x-forwarded-for")
    if (xff) {
        return xff.split(",")[0]?.trim() || "unknown"
    }

    return request.headers.get("x-real-ip") || "unknown"
}

export const assertRateLimit = (key: string) => {
    const current = buckets.get(key)
    const timestamp = now()

    if (!current || timestamp > current.resetAt) {
        buckets.set(key, { count: 1, resetAt: timestamp + WINDOW_MS })
        return { ok: true as const }
    }

    if (current.count >= MAX_ATTEMPTS) {
        return { ok: false as const }
    }

    current.count += 1
    buckets.set(key, current)
    return { ok: true as const }
}

type VerifyTurnstileOptions = {
    expectedAction?: string
    expectedHostname?: string
}

export const verifyTurnstileToken = async (token: string, ip?: string, options?: VerifyTurnstileOptions) => {
    const secret = process.env.TURNSTILE_SECRET_KEY

    if (!secret) {
        return { ok: false as const, reason: "captcha_not_configured" }
    }

    const params = new URLSearchParams({
        secret,
        response: token,
        idempotency_key: randomUUID(),
    })

    if (ip && ip !== "unknown") {
        params.set("remoteip", ip)
    }

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
        cache: "no-store",
    })

    if (!response.ok) {
        return { ok: false as const, reason: "captcha_unavailable" }
    }

    const json = (await response.json()) as {
        success?: boolean
        action?: string
        hostname?: string
        "error-codes"?: string[]
    }

    if (!json.success) {
        const timeoutOrDuplicate = json["error-codes"]?.includes("timeout-or-duplicate")
        return {
            ok: false as const,
            reason: timeoutOrDuplicate ? "captcha_timeout" : "captcha_invalid",
        }
    }

    if (options?.expectedAction && json.action !== options.expectedAction) {
        return { ok: false as const, reason: "captcha_action_mismatch" }
    }

    if (options?.expectedHostname && json.hostname !== options.expectedHostname) {
        return { ok: false as const, reason: "captcha_hostname_mismatch" }
    }

    return { ok: true as const }
}