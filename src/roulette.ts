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
            const prizeNumber = await lottery()

            response.json({ prize: prizeNumber })

            if (prizeNumber) {
                // subtract prize
                await prisma.prize.update({ where: { id: prizeNumber }, data: { quantity: { decrement: 1 } } })
            }

            await prisma.user.update({
                where: { id: data.id },
                data: {
                    prize: prizeNumber || 0,
                    timestamp: new Date().getTime(),
                },
            })
        } else {
            response.json({ error: "Usuário já roletou" })
        }
    } else {
        response.json({ error: "Usuário inválido" })
    }
})

export default router
