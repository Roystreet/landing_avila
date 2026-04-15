import { z } from "zod"

const text = (label: string, min = 1, max = 300) =>
    z
        .string()
        .trim()
        .superRefine((value, ctx) => {
            if (value.length === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${label} es obligatorio`,
                })
                return
            }

            if (value.length < min) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${label} debe tener al menos ${min} caracteres. Ingresa mas detalles.`,
                })
            }

            if (value.length > max) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${label} excede el maximo permitido`,
                })
            }
        })

const optionalText = (max = 300) =>
    z
        .string()
        .trim()
        .max(max, `El campo excede el maximo permitido`)
        .or(z.literal(""))

const email = z.string().trim().email("Email invalido").max(254, "Email invalido")

const phone = z
    .string()
    .trim()
    .superRefine((value, ctx) => {
        if (value.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Telefono es obligatorio",
            })
            return
        }

        if (value.length < 7 || value.length > 32) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Telefono invalido",
            })
        }
    })

const honeypot = z.string().trim().max(0, "Spam detectado")

export const getLeadValidationDetails = (error: z.ZodError) => {
    const fieldErrors = Object.fromEntries(
        Object.entries(error.flatten().fieldErrors).filter(([, messages]) => Boolean(messages?.length))
    )

    const missingFields = Object.entries(fieldErrors)
        .filter(([, messages]) => messages?.some((message) => message.includes("es obligatorio") || message.includes("Selecciona al menos")))
        .map(([field]) => field)

    return { fieldErrors, missingFields }
}

export const contactSchema = z.object({
    fullName: text("Nombre", 2, 120),
    company: optionalText(120),
    email,
    phone,
    projectType: text("Tipo de proyecto", 2, 100),
    budget: text("Presupuesto", 2, 100),
    industry: optionalText(120),
    projectDescription: text("Descripcion", 10, 3000),
    contactPreferences: z.array(z.string().trim().min(1)).min(1, "Selecciona al menos un canal de contacto").max(4),
    hp: honeypot,
})

export const quoteSchema = z.object({
    services: z.array(z.string().trim().min(1)).min(1, "Selecciona al menos un servicio").max(6),
    projectName: text("Nombre del proyecto", 2, 140),
    projectDescription: text("Descripcion", 10, 3000),
    timeline: text("Plazo", 2, 100),
    budget: text("Presupuesto", 2, 100),
    fullName: text("Nombre", 2, 120),
    company: optionalText(120),
    email,
    phone,
    hp: honeypot,
})

export type ContactInput = z.infer<typeof contactSchema>
export type QuoteInput = z.infer<typeof quoteSchema>