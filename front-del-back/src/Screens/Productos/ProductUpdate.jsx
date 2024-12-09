import React, { useEffect, useState } from 'react'
import Form from '../../Components/Form'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useFormErrors from '../../Hooks/useFormErrors'
import { getAuthenticatedHeaders } from '../../../utils/fetching'
import UseProductDetail from '../../Hooks/UseProductsDetail'
import Navbar from '../../Components/Navbar'

const ProductUpdate = () => {
    const { product_id } = useParams()
    const navigate = useNavigate()

    const { product_detail_state, product_detail_loading_state } = UseProductDetail(product_id)

    const [formState, setFormState] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        seller_id: '',
        image_base64: '',
    })

    const { errorState, handleErrors } = useFormErrors({});

    useEffect(() => {
        if (product_detail_state) {
            setFormState({
                title: product_detail_state.title,
                description: product_detail_state.description,
                price: product_detail_state.price,
                stock: product_detail_state.stock,
                category: product_detail_state.category,
                image_base64: product_detail_state.image_base64,
            });
        }
    }, [product_detail_state]);

    const handleUpdateProduct = async (formState) => {
        try {
            const response = await fetch(`http://localhost:3000/products/update/${product_id}`, {
                method: 'PUT',
                headers: getAuthenticatedHeaders(),
                body: JSON.stringify(formState),
            });

            const data = await response.json();
            console.log(data);

            if (!data.ok) {
                // Manejar errores si los hay
                return handleErrors(data.message);
            } else {
                // Redirigir a la pantalla de productos home
                navigate('/');
            }
        } catch (error) {
            console.log('Error al crear el producto:', error);
        }
    }

    const form_fields = [
        {
            label: {
            text: 'Ingresa la imagen',
            props: { htmlFor: 'image_base64' },
            },
            field: {
            type: 'input',
            props: {
                placeholder: 'Ingresa tu imagen',
                id: 'image',
                name: 'image_base64',
                type: 'file',
            },
            },
            errors: 'image_base64',
        },
        {
            label: {
            text: 'Ingresa el título',
            props: { htmlFor: 'title' },
            },
            field: {
            type: 'input',
            props: {
                placeholder: 'Ingresa tu título',
                id: 'title',
                name: 'title',
                type: 'text',
            },
            },
            errors: 'title',
        },
        {
            label: {
            text: 'Ingresa la descripción',
            props: { htmlFor: 'description' },
            },
            field: {
            type: 'input',
            props: {
                placeholder: 'Ingresa tu descripción',
                id: 'description',
                name: 'description',
                type: 'text',
            },
            },
            errors: 'description',
        },
        {
            label: {
            text: 'Ingresa el precio',
            props: { htmlFor: 'price' },
            },
            field: {
            type: 'input',
            props: {
                placeholder: 'Ingresa tu precio',
                id: 'price',
                name: 'price',
                type: 'number',
            },
            },
            errors: 'price',
        },
        {
            label: {
            text: 'Ingresa el stock',
            props: { htmlFor: 'stock' },
            },
            field: {
            type: 'input',
            props: {
                placeholder: 'Ingresa tu stock',
                id: 'stock',
                name: 'stock',
                type: 'number',
            },
            },
            errors: 'stock',
        },
        {
            label: {
            text: 'Ingresa la categoría',
            props: { htmlFor: 'category' },
            },
            field: {
            type: 'input',
            props: {
                placeholder: 'Ingresa tu categoría',
                id: 'category',
                name: 'category',
                type: 'text',
            },
            },
            errors: 'category',
        }
        ];

    return (
    <div>
        <h1>Actualizar producto</h1>
        <Form 
            initial_form_state={formState}
            action={handleUpdateProduct}
            form_fields={form_fields}
            errorState={errorState}
            buttonText='Actualizar producto'
        />
        <Link to='/'>Volver</Link>
    </div>
    )
}

export default ProductUpdate