import React from 'react'
import { useState } from 'react'

const UseForm = (InitialForm) => {
    const [formState, setFormState] = useState(InitialForm)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormState((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    return {
        formState,
        handleChange,

    }
}

export default UseForm
