import axios from "axios"

const api = axios.create({
    baseURL: "https://app.agenciaboz.com.br:4105/api",
})

const sendCode = async (code: string, number: string) => {
    api.post("/whatsapp", { message: code, number })
        .then((response) => {
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
}

export default { sendCode }
