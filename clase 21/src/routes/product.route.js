import express from "express";
import { createProductController, getProductsController, getProductByIdController, updateProductController, deleteProductController } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const productRouter = express.Router();

productRouter.post('/create', authMiddleware(['admin']), createProductController)
productRouter.get('/buscador/:product_id', authMiddleware(['admin', 'user']), getProductByIdController)
productRouter.get('/', authMiddleware(['admin', 'user']), getProductsController)
productRouter.put('/update/:product_id', authMiddleware(['admin']), updateProductController)
productRouter.delete('/delete/:product_id', authMiddleware(['admin']), deleteProductController)

export default productRouter