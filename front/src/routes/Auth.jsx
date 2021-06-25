import React, { useState } from "react"
import axios from "axios"
import { Redirect } from "react-router-dom"
import { AuthArea, Input, Button, InputArea } from "../styled"
import EmailAsset from "../assets/email.svg"
import Cadeado from "../assets/cadeado.svg"
import Swal from "sweetalert2"


const Auth = () => {
    let [email, setEmail] = useState("")
    let [pass, setPass] = useState("")
    let [redirect, setRedirect] = useState(false)
    const handleToken = async () => {
        await axios.post("http://localhost:8080/auth", {
            email,
            pass
        }).then(response => {
            if (response.status === 200)
                Swal.fire({
                    title: 'Autenticado com sucesso',
                    text: 'Agora você já pode usar os recursos do nosso sistema!',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(result => {
                    if (result.isConfirmed) {
                        setRedirect(true)
                    }
                })
            localStorage.setItem("token", response.data)
        })
            .catch(err => {
                alert(err)
            })
    }
    {
        if (redirect) {
            return (
                <Redirect to="/" />
            )
        } else {
            return (
                <AuthArea>
                    <h2>Obtenha seu token</h2>
                    <InputArea>
                        <img src={EmailAsset} width={30} height={20} alt="email" />
                        <Input type="email" placeholder="Digite seu email" onChange={e => setEmail(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <img src={Cadeado} width={30} height={20} alt="pass" />
                        <Input type="password" placeholder="Digite sua senha" onChange={e => setPass(e.target.value)} />
                    </InputArea>
                    <Button onClick={handleToken} bgcolor="#0000ff">Entrar</Button>
                </AuthArea>
            )
        }
    }
}

export default Auth;