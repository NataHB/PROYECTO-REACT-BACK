import React from 'react';
import Form from '../../Components/Form';
import useFormErrors from '../../Hooks/useFormErrors';
import { useNavigate, Link } from 'react-router-dom';
import { getAuthenticatedHeaders } from '../../../utils/fetching';

const ProductCreator = () => {
  const navigate = useNavigate();
  const initial_form_state = {
    image_base64: '',
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  };

  const { errorState, handleErrors } = useFormErrors({});

  const handleCreateProduct = async (formState) => {
    try {
      const response = await fetch('http://localhost:3000/products/create', {
        method: 'POST',
        headers: getAuthenticatedHeaders(),
        body: JSON.stringify(formState),
      });

      const data = await response.json();
      console.log(data);

      if (data.data.errors) {
        // Manejar errores si los hay
        return handleErrors(data.data.errors);
      }else{
            // Redirigir a la pantalla de productos home
            navigate('/');
      }



    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

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
          id: 'image_base64',
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
      <h1>Crear Producto</h1>
      <Form
        initial_form_state={initial_form_state}
        action={handleCreateProduct}
        form_fields={form_fields}
        errorState={errorState}
        buttonText="Crear Producto"
      />
      <Link to="/">Volver</Link>
      </div>
  );
};

export default ProductCreator;
