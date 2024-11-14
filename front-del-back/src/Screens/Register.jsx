import React from 'react'
import { useState } from 'react'
import UseForm from '../Hooks/UseForm'
import UseFormErrors from '../Hooks/useFormErrors'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()
    
    const { formState, handleChange } = UseForm({
        name: '',
        email: '',
        password: ''
    })

    const { errorState, handleErrors } = UseFormErrors({})

    const handleSubmit = async (e) => {
        e.preventDefault()

        const responseHTTP = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formState)
        })

        const data = await responseHTTP.json()
        console.log(data)
        
        if(data.data.errors){
            return handleErrors(data.data.errors)
        }else{
            return navigate('/')
        }
    }
    

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Ingresa tu nombre</label>
                    <input name="name" 
                    type="text" 
                    id="name" 
                    placeholder="Ingresa tu nombre" 
                    onChange={handleChange}
                    value={formState.name}
                    />
                </div>

                {errorState.name && 
                <ul>
                    {errorState.name.map (error => <li style={{color: '#471248'}}key={error}>{error}</li>)}
                </ul>
                }

                <div>
                    <label>Ingresa tu email</label>
                    <input name="email" 
                    type="text" 
                    id="email" 
                    placeholder="Ingresa tu email" 
                    onChange={handleChange}
                    value={formState.email}
                    />
                </div>

                {errorState.email && 
                <ul>
                    {errorState.email.map (error => <li style={{color: '#471248'}}key={error}>{error}</li>)}
                </ul>
                }

                <div>
                    <label>Ingresa tu password</label>
                    <input name="password" 
                    type="password" 
                    id="password" 
                    autocomplete="current-password"
                    placeholder="Ingresa tu password" 
                    onChange={handleChange} 
                    value={formState.password}
                    />
                </div>

                {errorState.password && 
                <ul>
                    {errorState.password.map (error => <li style={{color: '#471248'}}key={error}>{error}</li>)}
                </ul>
                }

                <button type="submit">Registrar</button>
                <Link to="/">Login</Link>
            </form>
        </div>
    )
}

export default Register