//logica de conexión a la base de datos

import mongoDB from "mongoose";

const MONGO_URL = "mongodb://localhost:27017/UTN_PRIMERA_VEZ";

mongoDB.connect(MONGO_URL, {})
    .then(
        () => {
        console.log("DB is connected")
    }
    )
    .catch(
        (error) => {
        console.error("DB is not connected", error)
    }
    )
    .finally(
        () => {
            console.log("DB is finally connected")
        }
    )


export default mongoDB