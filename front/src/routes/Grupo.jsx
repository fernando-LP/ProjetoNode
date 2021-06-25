import React, { useState, useEffect } from "react"
import axios from "axios"
import axiosConfig from "../services/token"
import { Link } from "react-router-dom"
import { Page, UserArea, Button, FooterArea, InputArea, ButtonContainer } from "../styled"
import BackButton from "../components/BackButton"
import TextInput from "../components/TextInput"
import Swal from "sweetalert2"
import EditAsset from "../components/EditAsset"
import IdAsset from "../components/IdAsset"

const Grupo = () => {
    let [grupos, setGrupos] = useState([])
    let [id_projeto, setId_projeto] = useState("")
    let [desc, setDesc] = useState("")
    let [newDesc, setNewDesc] = useState("")
    const handleGetGrupos = () => {
        setGrupos([])
        axios.get("http://localhost:8080/grupos", axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    setGrupos(response.data.data)
                } else {
                    console.log(response.status)
                }
            })
            .catch(err => console.log(err))
    }
    const handlePostGrupo = () => {
        axios.post("http://localhost:8080/grupo", {
            id_projeto,
            descricao: desc
        }, axiosConfig)
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire("Cadastrado com sucesso", "O grupo foi cadastrado com success", "success")
                        .then(() => {
                            handleGetGrupos()
                        })
                }

            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleDeleteGrupo = id => {
        Swal.fire({
            title: "Você tem certeza disso?",
            text: "Tudo que estiver relacionado a esse grupo será deletado também",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deletar",
            confirmButtonColor: "#ff0000",
            cancelButtonText: "Cancelar"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:8080/grupo/${id}`, axiosConfig)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.fire("Removido com sucesso", "O grupo selecionado foi removido", "success")
                                    .then(() => {
                                        handleGetGrupos()
                                    })
                            }
                        })
                }
            })
    }
    const handlePutGrupo = id => {
        axios.put(`http://localhost:8080/grupo/${id}`, {
            descricao: newDesc
        }, axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    Swal.fire("Atualizado com sucesso", "O grupo foi atualizado", "success")
                        .then(() => {
                            handleGetGrupos()
                        })
                } else
                    alert("Erro ao atualizar")
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(handleGetGrupos, [])
    return (
        <Page>
            <h2><Link to="/"><BackButton /></Link>Lista de grupos</h2>
            <a href="#cadastro"><Button bgcolor="#0000ff">Novo grupo</Button></a>
            {grupos.map((grupo, index) => {
                return <UserArea key={index}>
                    <h2>{grupo.descricao.toLowerCase()}</h2>
                    <FooterArea>
                        <Button bgcolor="#ff0000" onClick={() => handleDeleteGrupo(grupo.id)}>Excluir</Button>
                        <a href="#atualizar"><Button bgcolor="#0000ff" onClick={() => {
                            document.getElementById("nova-desc").className = `${grupo.id}`
                            setNewDesc(`${grupo.descricao}`)
                        }}>Atualizar</Button></a>
                    </FooterArea>
                </UserArea>
            })}
            <div id="cadastro">
                <h2>Cadastro de novo grupo</h2>
                <form>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id do projeto" onChange={e => setId_projeto(e.target.value)} /><br />
                    </InputArea>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="desc" type="text" placeholder="Digite a descrição" onChange={e => setDesc(e.target.value)} /><br />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={e => {
                            e.preventDefault()
                            handlePostGrupo()
                        }}>Cadastrar</Button>
                    </ButtonContainer>
                </form>
            </div>
            <div id="atualizar">
                <h2>Atualizar grupo</h2>
                <form>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="nova-desc" type="text" placeholder="Digite a nova descrição" value={newDesc} onChange={e => setNewDesc(e.target.value)} /><br />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={(e) => {
                            e.preventDefault()
                            let id = parseInt(document.getElementById("nova-desc").className)
                            handlePutGrupo(id)
                        }}>Atualizar</Button>
                    </ButtonContainer>
                </form>
            </div>
        </Page >
    )
}

export default Grupo