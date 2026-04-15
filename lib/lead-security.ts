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
