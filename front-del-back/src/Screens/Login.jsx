import React from 'react'
import UseFormErrors from '../Hooks/useFormErrors'
import UseForm  from '../Hooks/UseForm'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()

    // hook para el formulario
    const { formState, handleChange } = UseForm({
        email: '',
        password: ''
    })

    // hook para el error
    const { errorState, handleErrors } = UseFormErrors({})

    const handleSubmit = async (e) => {
        e.preventDefault()
    
        const responseHTTP = await fetch('http://localhost:3000/auth/login', {
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
        }else {
            sessionStorage.setItem('token', data.data.accessToken)
            return navigate('/sucess')
        }
        // else if (data.code === 'LOGIN_SUCCES'){
        //    return navigate('/sucess')
        //}


    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
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
                    placeholder="Ingresa tu password" 
                    onChange={handleChange} 
                    value={formState.password}
                    />
                </div>

                {errorState.password && 
                <ul>
                    {errorState.password.map (error => <li style={{color: '#471248'}} key={error}>{error}</li>)}
                </ul>
                }

                <button type="submit">Iniciar sesion</button>
                <Link to="/forgot-password">Olvide mi password</Link>
                <Link to="/register">Registrarme</Link>
            </form>
        </div>
    )
}

export default Login