import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const lottery = async () => {
    const hourInMillis = 3600 * 1000
    const prizesPerHour = 20

    // Define event start and end dates.
    const eventStartDate = new Date(2023, 9, 11) // October 12, 2023
    const eventEndDate = new Date(2023, 9, 15) // October 15, 2023
    const eventStartTime = 11 // 11
    const eventEndTime = 23

    const currentTime = new Date()

    // Check if we're currently within the event's date range.
    if (currentTime >= eventStartDate && currentTime <= eventEndDate) {
        console.log("inside event date") // working

        // Ensure the current time is between 11 AM and 11 PM.
        const currentHour = currentTime.getHours()
        if (currentHour >= eventStartTime && currentHour < eventEndTime) {
            console.log("inside event hour")

            const currentHourStart = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentHour)
            const previousHourStart = new Date(currentHourStart.getTime() - hourInMillis)

            let unclaimedPrizes = 0

            // Check if the previous hour falls within the event's time frame
            if (
                previousHourStart >=
                new Date(previousHourStart.getFullYear(), previousHourStart.getMonth(), previousHourStart.getDate(), eventStartTime)
            ) {
                const eventStartHour = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate(), eventStartTime)
                const totalPrizesWonSoFar = await prisma.user.count({
                    where: {
                        AND: [
                            { timestamp: { gte: Math.floor(eventStartHour.getTime()) } },
                            { timestamp: { lt: Math.floor(currentHourStart.getTime()) } },
                        ],
                    },
                })

                const totalPossiblePrizes = (currentHour - eventStartTime + 1) * prizesPerHour
                console.log({ totalPrizesWonSoFar, totalPossiblePrizes })
                unclaimedPrizes = totalPossiblePrizes - totalPrizesWonSoFar
            }

            // Calculate available prizes for this hour.
            const availablePrizes = prizesPerHour + unclaimedPrizes
            if (availablePrizes > 0) {
                const availablePrizeTypes = (
                    await prisma.prize.findMany({
                        where: {
                            quantity: {
                                gt: 0,
                            },
                        },
                    })
                ).map((item) => item.id)

                const prizes = [...availablePrizeTypes, 0, 0]

                // Determine if user wins.
                const randomNumber = prizes[Math.floor(Math.random() * prizes.length)]

                console.log({ unclaimedPrizes, availablePrizes, randomNumber, prizes })

                return randomNumber
            } else {
                console.log("there is no prize left")
            }

            // Rest of the logic to handle the win or no-win scenario.
        } else {
            console.log("outside event time") // working
        }
    } else {
        console.log("outside event date") // working
    }

    return
}
