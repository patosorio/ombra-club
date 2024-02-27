import React from 'react'
import Login from '../client/src/services/auth/Login'

const LoginPage = () => {
    return (
        <div className="container relative h-[800px] flex-col content-center justify-center grid lg:max-w-none initial:grid-cols-1 lg:px-0">
            <Login />
        </div>
    )
}

export default LoginPage;