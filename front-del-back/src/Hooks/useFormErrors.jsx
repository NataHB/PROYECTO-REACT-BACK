import {useState} from 'react'

const useFormErrors = () => {
    const [errorState, setErrors] = useState({
        email: '',
        password: '',
        name: ''
    })

    const handleErrors = (errors) => {
        const newErrors = {}

        if(errors.email) {
            newErrors.email = errors.email.errors.map(error => error.message)
        }

        if(errors.password) {
            newErrors.password = errors.password.errors.map(error => error.message)
        }

        if(errors.name) {
            newErrors.name = errors.name.errors.map(error => error.message)
        }

        setErrors(newErrors)
    }

    return {
        errorState,
        handleErrors
    }
}

export default useFormErrors

