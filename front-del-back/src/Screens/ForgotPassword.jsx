import React from 'react'
import { Link } from 'react-router-dom'
import Form from '../Components/Form'

const ForgotPassword = () => {

    const handleSubmit = async (form_state) => {
        const responseHTTP = await fetch('http://localhost:3000/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: form_state.email})
        })
        
    const data = await responseHTTP.json()
    console.log(data)

    if (data.code === 'LOGIN_SUCCES'){
        return navigate('/sucess')
    }

    }

    const form_fields = [
        {
            label_text: 'Ingresa tu email:',
            field_component: 'INPUT',
            field_container_props: {
                className: 'row_field'
            },
            field_data_props: {
                name: 'email',
                id: 'email',
                placeholder:'Ingresa tu email',
                type: 'email'
            }
        }
    ]

    const initial_state_form = {
        email: ''
    }


    return (
    <div>
            <h1>Restablecer contraseña</h1>
            <Form action={handleSubmit} form_fields={form_fields} inital_state_form={initial_state_form} >
                <button type="submit">Restablecer</button>
                <Link to="/">Recorde mi password</Link>
            </Form>
        </div>
    )
}
export default ForgotPassword