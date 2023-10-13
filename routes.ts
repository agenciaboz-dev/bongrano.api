import express, { Express, Request, Response } from "express"
import signup from "./src/signup"
import roulette from "./src/roulette"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const router = express.Router()

router.get("/", async (request: Request, response: Response) => {
    const canecas = await prisma.user.count({ where: { prize: 1 } })
    const produtos = await prisma.user.count({ where: { prize: 3 } })
    const nada = await prisma.user.count({ where: { prize: 0 } })

    const premiados = canecas + produtos
    const total = canecas + produtos + nada

    const currentTime = new Date()

    const currentHour = currentTime.getHours()
    const eventStartTime = 11
    const prizesPerHour = 20
    const totalPrizesWonSoFar = await prisma.user.count({
        where: {
            NOT: [{ prize: null }, { prize: 0 }],
        },
    })
    const totalPossiblePrizes = (currentHour - eventStartTime + 1) * prizesPerHour
    const unclaimedPrizes = totalPossiblePrizes - totalPrizesWonSoFar
    const availablePrizes = prizesPerHour + unclaimedPrizes

    response.json({ total, premiados, nada, canecas, produtos, disponiveis_nessa_hora: availablePrizes })
})

router.use("/signup", signup)
router.use("/roulette", roulette)
