import React, { useEffect, useState } from "react"
import axios from "axios"
import axiosConfig from "../services/token"
import { Page, UserArea, Button, FooterArea, ButtonContainer, InputArea } from "../styled"
import BackButton from "../components/BackButton"
import { Link } from "react-router-dom"
import TextInput from "../components/TextInput"
import Swal from "sweetalert2"
import NomeAsset from "../components/NomeAsset"

const Sistema = (props) => {
    let [sistemas, setSistemas] = useState([])
    let [nomeSistema, setNomeSistema] = useState("")
    let [newNomeSistema, setNewNomeSistema] = useState("")
    const handleGetSistemas = () => {
        setSistemas([])
        axios.get("http://localhost:8080/sistemas", axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    setSistemas(response.data.data)
                } else {
                    console.log(`Err: ${response.statusText}`)
                }
            })
            .catch(err => {
                alert(err)
            })
    }
    const handleDeleteSistema = (id) => {
        Swal.fire({
            title: "Você tem certeza disso?",
            text: "Tudo que estiver relacionado a esse sistema será deletado também",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deletar",
            confirmButtonColor: "#ff0000",
            cancelButtonText: "Cancelar"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:8080/sistema/${id}`, axiosConfig)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.fire("Removido com sucesso", "O sistema selecionado foi removido", "success")
                                    .then(() => {
                                        handleGetSistemas()
                                    })
                            }
                        })
                }
            })
    }
    const handlePutSistema = (id) => {
        axios.put(`http://localhost:8080/sistema/${id}`, {
            nome: newNomeSistema
        }, axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    Swal.fire("Atualizado com sucesso", "O sistema foi atualizado com sucesso", "success")
                        .then(() => handleGetSistemas())
                }
            })
    }
    const handlePostSistema = () => {
        axios.post("http://localhost:8080/sistema", {
            nome: nomeSistema
        }, axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    Swal.fire("Cadastrado com sucesso", "O sistema foi cadastrado com sucesso", "success")
                        .then(() => handleGetSistemas())
                } else {
                    alert("Erro ao inserir")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(handleGetSistemas, [])
    return (
        <Page>
            <h2><Link to="/"><BackButton /></Link>Lista de sistemas</h2>
            <a href="#cadastro"><Button bgcolor="#0000ff">Novo sistema</Button></a>
            {sistemas.map((sis, index) => {
                return <UserArea key={index}>
                    <h2>Nome: {sis.nome.toLowerCase()}</h2>
                    <FooterArea>
                        <Button bgcolor="#ff0000" onClick={() => handleDeleteSistema(sis.id_sistema)}>Excluir</Button>
                        <a href="#atualizar"><Button bgcolor="#0000ff" onClick={() => {
                            document.getElementById("nome").className = `${sis.id_sistema}`
                            setNewNomeSistema(`${sis.nome}`)
                        }}>Atualizar</Button></a>
                    </FooterArea>
                </UserArea>
            })}
            <div id="cadastro">
                <h2>Cadastro de novo sistema</h2>
                <form>
                    <InputArea>
                        <NomeAsset />
                        <TextInput id="novo-nome" type="text" placeholder="Digite o nome" onChange={e => setNomeSistema(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={e => {
                            e.preventDefault()
                            handlePostSistema()
                        }}>Cadastrar</Button>
                    </ButtonContainer>
                </form>
            </div>
            <div id="atualizar">
                <h2>Atualizar sistema</h2>
                <form>
                    <InputArea>
                        <NomeAsset />
                        <TextInput id="nome" type="text" placeholder="Digite o nome" value={newNomeSistema} onChange={e => setNewNomeSistema(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={e => {
                            e.preventDefault()
                            let id = parseInt(document.getElementById("nome").className)
                            handlePutSistema(id)
                        }}>Atualizar</Button>
                    </ButtonContainer>
                </form>
            </div>
        </Page >
    )
}

export default Sistema