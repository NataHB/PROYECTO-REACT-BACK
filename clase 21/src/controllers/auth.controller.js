import ResponseBuilder from "../builders/response.builder.js";
import ENVIROMENT from "../config/enviroment.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import transportarEmail from "../helpers/emailTransporter.helper.js";
import jwt from "jsonwebtoken";


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const verifyString = (field_name, field_value) => {
    if(!(typeof(field_value) === 'string')){
        return {
            error: 'STRING_VALIDATION',
            message: field_name + ' debe ser un texto',
        }
    }
}
const verifyMinLength = (field_name, field_value, minLength) => {
    if(!(field_value.length >= minLength)){
        return {
            error: 'MIN_LENGTH_VALIDATION',
            message: field_name + ' debe tener como minimo ' + minLength + ' caracteres',
        }
    }
}

const verifyNumber = (field_name, field_value) => {
    if(!(typeof field_value === 'number')){
        return {
            error: 'NUMBER_VALIDATION',
            message: field_name + ' debe ser un numero',
        }
    }
}

const verifyEmail = (field_name, field_value) => {
    if(!(emailRegex.test(field_value))){
        return {
            error: 'EMAIL_VALIDATION',
            message: field_name + ' no cumple el formato email'
        }
    }
}

export const registerController = async (req, res) =>{
    try{const {name, password, email} = req.body

    //TODO
    //Validar name, password, email
    const registerConfig = {
        name: {
            value: name,
            errors: [],
            validation: [
                verifyString,
                (field_name, field_value) => verifyMinLength(field_name, field_value, 5)
            ]
        },
        password: {
            value: password,
            errors: [],
            validation: [
                verifyString,
                (field_name, field_value) => verifyMinLength(field_name, field_value, 10)
            ]
        },
        email: {
            value: email,
            errors: [],
            validation: [
                verifyEmail,
                (field_name, field_value) => verifyMinLength(field_name, field_value, 10)
            ]
        }
    }

    let hayErrores = false
    for (let field_name in registerConfig){
        for(let validation of registerConfig[field_name].validation){
            let result = validation(field_name, registerConfig[field_name].value)
            if(result){
                hayErrores = true
                registerConfig[field_name].errors.push(result)
            }
        }
    }

    if(hayErrores){
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setCode('VALIDATION_ERROR')
        .setData(
            {errors: registerConfig}
        )
        .build()
        return res.json(response)
    }

    const hashedPassword = await bcrypt.hash( registerConfig.password.value, 10)
    
    const validationToken = jwt.sign (
        {
        email: registerConfig.email.value,
    },
    ENVIROMENT.SECRET_KEY,
    {
        expiresIn: '1d'
    }
)

    const verificationToken = `http://localhost:3000/auth/verify-email/${validationToken}`
    

    const result = await transportarEmail.sendMail({
        subject: 'Validacion de correo',
        to: registerConfig.email.value,
        html: `
            <h1>Valida tu correo</h1>
            <p>Por favor, confirma tu correo</p>
            <a href=${verificationToken}>Validar</a>
        `
    })

    console.log(result)

    const userCreated = new User({
        name: registerConfig.name.value,
        password: hashedPassword,
        email: registerConfig.email.value
    })
    await userCreated.save()

    const response = new ResponseBuilder()
    .setCode('SUCCES')
    .setOk(true)
    .setStatus(200)
    .setData(
        {registerResult: userCreated}
    )
    .build()
    return res.json(response)
}catch(error){
    if(error.code === 11000){
        const response = new ResponseBuilder()
        .setOk(false)
        .setCode(400)
        .setMessage('Email already registered')
        .setData({
            detail: 'El email ya esta registrado'
        })
        .build()
        res.json(response)
    }

}
}

export const verifyEmailController = async (req, res) => {
    try {
        const { validationToken } = req.params;  // Asegura que el nombre del parámetro coincide
        console.log('Token recibido:', validationToken);

        const payload = jwt.verify(validationToken, ENVIROMENT.SECRET_KEY ); // Asegura que el nombre de la variable de entorno es correcto
        const email_to_verify = payload.email;

        // Busca el usuario por el email extraído del token
        const user = await User.findOne({ email: email_to_verify });
        
        // Verifica que el usuario exista
        if (!user) {
            console.log("Usuario no encontrado");
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404) //not found: no encontrado
            .setCode('NOT_FOUND')
            .setData({
                detail: 'User not found'
            })
            .build() // Usuario no encontrado
            return res.json(response);
        }

        // Verifica que el correo no haya sido verificado previamente
        if (user.emailVerified) {
            console.log("Correo ya verificado");
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400) //bad request: solicitud incorrecta
            .setCode('ALREADY_VERIFIED')
            .setData({
                detail: 'Email already verified'
            })
            .build(); // Correo ya verificado
            return res.json(response);
        }

        // Marca el correo como verificado
        user.emailVerified = true;
        await user.save();

        res.sendStatus(200); // Responde con éxito si todo va bien
        // res.redirect('http://localhost:5173/auth/login')
        
    } catch (error) {
        console.log("Error en verificación de email:", error);
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500) //internal server error: error del servidor
        .setCode('VERIFICATION_ERROR')
        .setData({
            detail: 'Error in email verification'
        })
        .build(); // Error en la verificación
        return res.json(response);
    }
}

export const loginController = async (req, res) => {
    try{
        const { email, password } = req.body

        //validar email y password
        const loginConfig = {
            email: {
                value: email,
                errors: [],
                validation: [
                    verifyEmail,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 10)
                ]
            },
            password: {
                value: password,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value) => verifyMinLength(field_name, field_value, 10)
                ]
            }
        }

        let hayErrores = false
        for (let field_name in loginConfig){
            for(let validation of loginConfig[field_name].validation){
                let result = validation(field_name, loginConfig[field_name].value)
                if(result){
                    hayErrores = true
                    loginConfig[field_name].errors.push(result)
                }
            }
        }

        if(hayErrores){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400) //bad request: solicitud incorrecta
            .setCode('VALIDATION_ERROR')
            .setData({
                errors: loginConfig
            })
            .build()
            return res.json(response)   
        }

        const user = await User.findOne({ email: email })

        const isPasswordCorrect = await bcrypt.compare(loginConfig.password.value, user.password)

        if(!user){// no encontrado
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(404) //not found: no encontrado
            .setCode('AUTH_ERROR')
            .setData({
                detail: 'El email o la contraseña son incorrectos'
            })
            .build()
            return res.json(response)
        }

        if(!isPasswordCorrect){//contraseña incorrecta
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(401) //unauthorized: no autorizado
            .setCode('AUTH_ERROR')
            .setData({
                detail: 'El email o la contraseña son incorrectos'
            })
            .build()
            return res.json(response)
        }

        if(!user.emailVerified){//no ha sido verificado
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403) //forbidden: permiso prohibido
            .setCode('AUTH_ERROR')
            .setData({
                detail: 'El email no ha sido verificado'
            })
            .build()
            return res.json(response)
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            ENVIROMENT.SECRET_KEY,
            {
                expiresIn: '1d'
            }
        )

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('LOGIN_SUCCES')
        .setMessage('Login exitoso')
        .setData(
            {accessToken: accessToken,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        )
        .build()
        return res.json(response)
    }
    catch(error){
        console.log(error)
    }
}

export const forgotPasswordController = async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({email: email})

    const reset_token = jwt.sign(
        {email: user.email},
        ENVIROMENT.SECRET_KEY,
        { expiresIn: '1d'}
    )

    const resetUrl = `${ENVIROMENT.URL_FRONTEND}/auth/recovery-password/${reset_token}`

    const result = await transportarEmail.sendMail({
        subject: 'Recuperar password',
        to: user.email,
        html:`<a href=${resetUrl}> Recuperar </a>`
})

console.log(result)

res.json({
    status: 200,
    ok: true,
    message: 'Email enviado'
})
}

export const recoveryPasswordController = async (req, res) => {
    try{
        const { reset_token } = req.params
        const payload = jwt.verify(reset_token, ENVIROMENT.SECRET_KEY)

        const user = await User.findOne({email: payload.email})
        if(!user){
            return res.status(404).json({message: 'Usuario no encontrado'})
        }

        const { password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword
        await user.save()

        res.status(200).json({message: 'Contraseña restablecida exitosamente'}), {redirectUrl: `${ENVIROMENT.FRONTEND_URL}/login`}
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Error interno del servidor'})
    }

}
