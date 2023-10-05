import express, { Express, Request, Response } from "express"
import signup from "./src/signup"
import roulette from "./src/roulette"

export const router = express.Router()

router.use("/signup", signup)
router.use("/roulette", roulette)
