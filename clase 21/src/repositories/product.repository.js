import Product from "../models/products.model.js";

class ProductRepository{

    static async createProduct (product_data) {
        const new_product = new Product(product_data)
        await new_product.save()
        return new_product
    }

    static async updateProduct (product_id, product_data) {
        const updated_product = await Product.findByIdAndUpdate(product_id, product_data, {new: true})
        return updated_product
    }


    static async getProducts () {
        const products = await Product.find({active: true})
        return products
    }

    static async getProductById (product_id) {
        const product = await Product.findById(product_id)
        return product
    }



    static async deleteProduct (product_id) {
        const deleted_product = await Product.findByIdAndUpdate(product_id,{active: false}, {new: true})
        return deleted_product
    }
}

export default ProductRepository