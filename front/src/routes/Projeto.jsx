import React, { useState, useEffect } from "react"
import { UserArea, Button, InputArea, ButtonContainer, FooterArea } from "../styled"
import { Page } from "../styled"
import { Link } from "react-router-dom"
import axios from "axios"
import axiosConfig from "../services/token"
import IdAsset from "../components/IdAsset"
import EditAsset from "../components/EditAsset"
import TextInput from "../components/TextInput"
import BackButton from "../components/BackButton"
import TituloAsset from "../components/TituloAsset"
import Swal from "sweetalert2"

const Projeto = () => {
    let [projetos, setProjetos] = useState([])
    let [titulo, setTitulo] = useState("")
    let [descricao, setDescricao] = useState("")
    let [idCriador, setIdCriador] = useState(null)
    let [idSistema, setIdSistema] = useState(null)
    let [newTitulo, setNewTitulo] = useState("")
    let [newDesc, setNewDesc] = useState("")
    const handleGetProjetos = () => {
        axios.get("http://localhost:8080/projetos", axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    setProjetos(response.data)

                } else {
                    alert("Ocorreu um erro no sistema")
                }
            })
            .catch(err => {
                alert("Erro")
            })
    }
    const handleDeleteProjeto = id => {
        Swal.fire({
            title: "Você tem certeza disso?",
            text: "Tudo que estiver relacionado a esse projeto será deletado também",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deletar",
            confirmButtonColor: "#ff0000",
            cancelButtonText: "Cancelar"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:8080/projeto/${id}`, axiosConfig)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.fire("Removido com sucesso", "O projeto selecionado foi removido", "success")
                                    .then(() => {
                                        handleGetProjetos()
                                    })
                            }
                        })
                }
            })
    }
    const handlePostProjeto = () => {
        axios.post("http://localhost:8080/projeto", {
            titulo,
            descricao,
            id_criador: idCriador,
            id_sistema: idSistema
        }, axiosConfig)
            .then(response => {
                if (response.status === 200)
                    Swal.fire("Cadastrado com sucesso", "O projeto foi cadastrado com sucesso", "success")
                        .then(() => handleGetProjetos())
                else {
                    alert("Erro ao inserir")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handlePutProjeto = id => {
        axios.put(`http://localhost:8080/projeto/${id}`, {
            titulo: newTitulo,
            descricao: newDesc
        }, axiosConfig)
            .then(response => {
                if (response.status === 200)
                    Swal.fire("Atualizar com sucesso", "O projeto foi atualizado", "success")
                        .then(() => handleGetProjetos())
                else
                    alert("Erro o atualizar")
            })
            .catch(err => {
                alert("Erro")
            })
    }
    useEffect(handleGetProjetos, [])
    return (
        <Page>
            <h2><Link to="/"><BackButton /></Link>Lista de projetos</h2>
            <a href="#cadastro"><Button bgcolor="#0000ff">Novo projeto</Button></a>
            {projetos.map((projeto, index) => {
                return <UserArea key={index}>
                    <h2>Título: {projeto.titulo.toLowerCase()}</h2>
                    <div>
                        <p>Descrição: {projeto.descricao}</p>
                        <p>Id criador: {projeto.id_criador}</p>
                        <p>Id sistema: {projeto.id_sistema}</p>
                    </div>
                    <FooterArea>
                        <Button bgcolor="#ff0000" onClick={() => handleDeleteProjeto(projeto.id)}>Excluir</Button>
                        <a href="#atualizar"><Button bgcolor="#0000ff" onClick={() => {
                            document.getElementById("novo-titulo").className = `${projeto.id}`
                            setNewTitulo(`${projeto.titulo}`)
                            setNewDesc(`${projeto.descricao}`)
                        }}>Atualizar</Button></a>
                    </FooterArea>
                </UserArea>
            })}
            <div id="cadastro">
                <h2>Cadastro de novo projeto</h2>
                <form>
                    <InputArea>
                        <TituloAsset />
                        <TextInput id="titulo" type="text" placeholder="Digite o titulo" onChange={e => setTitulo(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="descricao" type="text" placeholder="Digite a descricao" onChange={e => setDescricao(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id do criador" onChange={e => setIdCriador(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id do sistema" onChange={e => setIdSistema(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={(e) => {
                            e.preventDefault()
                            handlePostProjeto()
                        }}>Cadastrar</Button>
                    </ButtonContainer>
                </form>
            </div>
            <div id="atualizar">
                <h2>Atualizar projeto</h2>
                <form>
                    <InputArea>
                        <TituloAsset />
                        <TextInput id="novo-titulo" value={newTitulo} type="text" placeholder="Digite o titulo" onChange={e => setNewTitulo(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="nova-descricao" value={newDesc} type="text" placeholder="Digite a descricao" onChange={e => setNewDesc(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={(e) => {
                            e.preventDefault()
                            let id = parseInt(document.getElementById("novo-titulo").className)
                            handlePutProjeto(id)
                        }}>Atualizar</Button>
                    </ButtonContainer>
                </form>
            </div>
        </Page >
    )
}

export default Projeto