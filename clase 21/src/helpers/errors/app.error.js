class AppError extends Error {
        constructor(message, status_code) {
            super(message)
            this.status_code = status_code
            this.status = (status_code).startsWith("4") ? "FAIL" : "ERROR" // si el status empieza con 4 es un error
            this.is_operational = true
            Error.captureStackTrace(this, this.constructor); // captura la pila de errores
        }
    }
    
    export default AppError