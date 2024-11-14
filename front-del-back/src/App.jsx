import React from "react"
import { Routes, Route } from "react-router-dom"
import { Login, Register, Sucess, ForgotPassword, RecoveryPassword } from "./Screens/index.js"
import "./App.css"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />  
        <Route path="/sucess" element={<Sucess />} />
        <Route path="/auth/recovery-password/:reset_token" element={<RecoveryPassword /> } />
      </Routes>
    </>
  )
}

export default App