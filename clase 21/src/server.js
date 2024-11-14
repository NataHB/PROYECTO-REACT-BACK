import express from "express";
import statusRouter from "./routes/status.routes.js";
import authRouter from "./routes/auth.router.js";
import cors from "cors";
import mongoDB from "./config/db.config.js";
import productRouter from "./routes/product.route.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.middleware.js";

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use('/status', statusRouter);
app.use('/auth', authRouter)
app.use('/products', productRouter)

app.use(errorHandlerMiddleware)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));