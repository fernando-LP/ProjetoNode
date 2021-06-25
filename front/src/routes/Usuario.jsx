import React, { useEffect, useState } from "react"
import axios from "axios"
import axiosConfig from "../services/token"
import { UserArea, Button, Page, InputArea, FooterArea, ButtonContainer } from "../styled"
import TextInput from "../components/TextInput"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import NomeAsset from "../assets/nome.svg"
import BackButton from "../components/BackButton"

const Usuario = (props) => {
    let [users, setUsers] = useState([])
    let [userName, setUserName] = useState("")
    let [newUserName, setNewUserName] = useState("")
    const handleGetUsers = async () => {
        setUsers([])
        await axios.get("http://localhost:8080/usuarios", axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    setUsers(response.data.data)
                } else {
                    console.log(`Err: ${response.statusText}`)
                }
            })
            .catch(err => {
                alert(err)
            })
    }
    const handleDeleteUser = (id) => {
        Swal.fire({
            title: "Você tem certeza disso?",
            text: "Tudo que estiver relacionado a esse usuário será deletado também",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deletar",
            confirmButtonColor: "#ff0000",
            cancelButtonText: "Cancelar"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:8080/usuario/${id}`, axiosConfig)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.fire("Removido com sucesso", "O usuário selecionado foi removido", "success")
                                    .then(() => {
                                        handleGetUsers()
                                    })
                            }
                        })
                }
            })

    }
    const handlePutUser = (id) => {
        axios.put(`http://localhost:8080/usuario/${id}`, {
            nome: newUserName
        }, axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    Swal.fire("Atualizado com sucesso", "O usuário foi atulizado com sucesso", "success")
                        .then(() => {
                            handleGetUsers()
                        })
                }
            })
    }
    const handlePostUser = () => {
        axios.post("http://localhost:8080/usuario", {
            nome: userName
        }, axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    Swal.fire("Inserido com sucesso", "O usuário foi inserido com sucesso", "success")
                        .then(() => {
                            handleGetUsers()
                        })
                } else {
                    alert("Erro ao inserir")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(handleGetUsers, [])

    return (
        <Page>
            <div style={{ flexDirection: "row", justifyContent: "center" }}>
                <h2><Link to="/"><BackButton /></Link>Lista de usuários</h2>
            </div>
            <a href="#cadastro"><Button bgcolor="#0000ff">Novo usuário</Button></a>
            {users.map((user, index) => {
                return <UserArea key={index}>
                    <h2>Nome: {user.nome.toLowerCase()}</h2>
                    <FooterArea>
                        <Button bgcolor="#ff0000" onClick={() => handleDeleteUser(user.id_usuario)}>Excluir</Button>
                        <a href="#atualizar"><Button bgcolor="#0000ff" onClick={() => {
                            document.getElementById("nome").className = `${user.id_usuario}`
                            setNewUserName(`${user.nome}`)
                        }}>Atualizar</Button></a>
                    </FooterArea>
                </UserArea>
            })}
            <div id="cadastro">
                <h2>Cadastro de novo usuario</h2>
                <form>
                    <InputArea>
                        <img src={NomeAsset} width={30} height={20} />
                        <TextInput id="novo-nome" type="text" placeholder="Digite o nome" onChange={e => setUserName(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button onClick={e => {
                            e.preventDefault()
                            handlePostUser()
                        }
                        } bgcolor="#0000ff">Cadastrar</Button>
                    </ButtonContainer>
                </form>
            </div>
            <div id="atualizar">
                <h2>Atualizar usuário</h2>
                <form>
                    <InputArea>
                        <img src={NomeAsset} width={30} height={20} />
                        <TextInput value={newUserName} id="nome" type="text" placeholder="Digite o nome" onChange={e => setNewUserName(e.target.value)} />
                    </InputArea>
                    <ButtonContainer >
                        <Button bgcolor="#0000ff" onClick={e => {
                            e.preventDefault()
                            let id = parseInt(document.getElementById("nome").className)
                            handlePutUser(id)
                        }}>Atualizar</Button>
                    </ButtonContainer>

                </form>
            </div>
        </Page >
    )
}



export default Usuario