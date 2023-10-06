import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import hash from "./scripts/hash"
import zap from "./zap"

const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
    const data: Form = request.body
    data.phone = data.phone.replace(/\D/g, "")

    try {
        const user = await prisma.user.create({ data: { name: data.name, address: data.address, phone: data.phone } })
        const code = hash.encrypt(user.id).toUpperCase()
        console.log(code)

        zap.sendCode(code, user.phone)

        response.json({ code, user })
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.meta?.target == "User_phone_key") {
            response.json({ error: "Número de telefone já cadastrado" })
        } else {
            console.log(error)
            response.json({ error: null })
        }
    }
})

export default router
