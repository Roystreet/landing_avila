import { z } from "zod"

const text = (label: string, min = 1, max = 300) =>
    z
        .string()
        .trim()
        .min(min, `${label} es obligatorio`)
        .max(max, `${label} excede el maximo permitido`)

const optionalText = (max = 300) =>
    z
        .string()
        .trim()
        .max(max, `El campo excede el maximo permitido`)
        .optional()
        .or(z.literal(""))

const email = z.string().trim().email("Email invalido").max(254, "Email invalido")

const phone = z
    .string()
    .trim()
    .min(7, "Telefono invalido")
    .max(32, "Telefono invalido")

const captcha = z.string().trim().min(10, "Captcha invalido")

const honeypot = z.string().trim().max(0, "Spam detectado")

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
    captchaToken: captcha,
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
    captchaToken: captcha,
    hp: honeypot,
})

export type ContactInput = z.infer<typeof contactSchema>
export type QuoteInput = z.infer<typeof quoteSchema>