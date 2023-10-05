import express, { Express, Request, Response } from "express"
import { PrismaClient } from "@prisma/client"
import { lottery } from "./lottery"
const router = express.Router()
const prisma = new PrismaClient()

router.post("/", async (request: Request, response: Response) => {
    const data = request.body

    const user = await prisma.user.findUnique({ where: { id: data.id } })
    if (user) {
        if (user.prize === null) {
            // sorteio
            const prizeNumber = await lottery()

            response.json(prizeNumber)

            // subtract prize
        } else {
            response.json({ error: "Usuário já roletou" })
        }
    } else {
        response.json({ error: "Usuário inválido" })
    }
})

export default router
