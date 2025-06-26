import React from 'react'
import './Header.css'
import { Button } from '@mui/material'

type HeaderProps = {
  onGetAllUsers: () => void;
}
export function Header({ onGetAllUsers }: HeaderProps) {
    return (
        <>

            <header className="App-header">
                <img src="/logo.png" className="logo" alt="Vite logo" />
                <Button variant="outlined" style={{color:"#3a834d", borderColor:"#3a834d"}} onClick={onGetAllUsers}>Get All Users</Button>
            </header>
        </>
    )
}
export default Header