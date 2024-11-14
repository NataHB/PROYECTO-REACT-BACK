import ProductRepository from "../repositories/product.repository.js";
import ResponseBuilder from "../builders/response.builder.js";
import AppError from "../helpers/errors/app.error.js";

export const createProductController = async (req, res) => {
    try{
        const {title, description, price, stock, category, seller_id} = req.body

        const product_data = {title, description, price, stock, category, seller_id}

        const product = await ProductRepository.createProduct(product_data)

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(201)
        .setCode('OK')
        .setMessage('Product created')
        .setData(product)
        .build()
        return res.json(response)
    }catch(error){
        next(error)
    }
}

export const getProductsController = async (req, res) => {
    try{
        const products = await ProductRepository.getProducts()
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Products found')
        .setData(products)
        .build()
        return res.json(response)
    }catch(error){
        next(error)
    }
}

export const getProductByIdController = async (req, res, next) => {
    try{
        const {product_id} = req.params
        const product = await ProductRepository.getProductById(product_id)

        if(!product){
            return next(new AppError('Product not found', 404))
        }
        
        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Product found')
        .setData(product)
        .build()
        return res.json(response)
    }catch(error){
        next(error)
    }
}

export const updateProductController = async (req, res) => {
    try{
        const {product_id} = req.params
        const {title, description, price, stock, category, seller_id} = req.body

        const product_data = {title, description, price, stock, category, seller_id}

        const product = await ProductRepository.updateProduct(product_id, product_data)

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Product updated')
        .setData(product)
        .build()
        return res.json(response)
    }catch(error){
        next(error) 
    }
}

export const deleteProductController = async (req, res) => {
    try{
        const {product_id} = req.params
        const product = await ProductRepository.deleteProduct(product_id)

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('OK')
        .setMessage('Product deleted')
        .setData(product)
        .build()
        return res.json(response)
    }catch(error){  
        next(error)
    }
}