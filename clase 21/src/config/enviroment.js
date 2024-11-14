import dotenv from "dotenv"
dotenv.config()

console.log(process.env.EMAIL_PASSWORD)

const ENVIROMENT = {
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'password',
    EMAIL_USER: process.env.EMAIL_USER || 'email',
    SECRET_KEY: process.env.SECRET_KEY || 'secret',
    URL_FRONTEND: process.env.URL_FRONTEND,
}

export default ENVIROMENT
