import React, { useEffect, useState } from "react"
import axios from "axios"
import axiosConfig from "../services/token"
import { UserArea, Button, FooterArea, InputArea, ButtonContainer } from "../styled"
import { Page } from "../styled"
import { Link } from "react-router-dom"
import TextInput from "../components/TextInput"
import EditAsset from "../components/EditAsset"
import BackButton from "../components/BackButton"
import Swal from "sweetalert2"

const TipoTarefa = () => {
    let [tiposTarefas, setTiposTarefas] = useState([])
    let [descTipoTarefa, setDescTipoTarefa] = useState("")
    let [newDescTipoTarefa, setNewDescTipoTarefa] = useState("")
    const handleGetTiposTarefas = () => {
        setTiposTarefas([])
        axios.get("http://localhost:8080/tipos_tarefas", axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    setTiposTarefas(response.data.data)
                } else {
                    console.log(`Err: ${response.statusText}`)
                }
            })
            .catch(err => {
                alert(err)
            })
    }
    const handleDeleteTipoTarefa = (id) => {
        Swal.fire({
            title: "Você tem certeza disso?",
            text: "Tudo que estiver relacionado a esse tipo de tarefa será deletado também",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deletar",
            confirmButtonColor: "#ff0000",
            cancelButtonText: "Cancelar"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:8080/tipo_tarefa/${id}`, axiosConfig)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.fire("Removido com sucesso", "O tipo de tarefa selecionado foi removid", "success")
                                    .then(() => handleGetTiposTarefas())
                            }
                        })
                }
            })
    }
    const handlePutTipoTarefa = (id) => {
        axios.put(`http://localhost:8080/tipo_tarefa/${id}`, {
            descricao: newDescTipoTarefa
        }, axiosConfig)
            .catch(err => console.log(err))
        Swal.fire("Atualizado com sucesso", "O tipo de tarefa foi atualizado", "success")
            .then(() => handleGetTiposTarefas())
    }
    const handlePostTipoTarefa = () => {
        axios.post("http://localhost:8080/tipo_tarefa", {
            descricao: descTipoTarefa
        }, axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    Swal.fire("Cadastrado com sucesso", "O tipo de tarefa foi cadastrado com sucesso", "success")
                        .then(() => handleGetTiposTarefas())
                } else {
                    alert("Erro ao inserir")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(handleGetTiposTarefas, [])
    return (
        <Page>
            <h2><Link to="/"><BackButton /></Link>Lista de tipos de tarefas</h2>
            <a href="#cadastro"><Button bgcolor="#0000ff" style={{ width: 120 }}>Novo tipo tarefa</Button></a>
            {tiposTarefas.map((tt, index) => {
                return <UserArea key={index}>
                    <h2>Descrição: {tt.descricao.toLowerCase()}</h2>
                    <FooterArea>
                        <Button bgcolor="#ff0000" onClick={() => handleDeleteTipoTarefa(tt.id)}>Excluir</Button>
                        <a href="#atualizar"><Button bgcolor="#0000ff" onClick={() => {
                            document.getElementById("desc").className = `${tt.id}`
                            setNewDescTipoTarefa(`${tt.descricao}`)
                        }}>Atualizar</Button></a>
                    </FooterArea>
                </UserArea>
            })}
            <div id="cadastro">
                <h2>Cadastro de novo tipo de tarefa</h2>
                <form>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="nova-desc" type="text" placeholder="Digite a descrição" onChange={e => setDescTipoTarefa(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={e => {
                            e.preventDefault()
                            handlePostTipoTarefa()
                        }}>Cadastrar</Button>
                    </ButtonContainer>
                </form>
            </div>
            <div id="atualizar">
                <h2>Atualizar sistema</h2>
                <form>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="desc" type="text" placeholder="Digite a descrição" value={newDescTipoTarefa} onChange={e => setNewDescTipoTarefa(e.target.value)} /><br />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={(e) => {
                            e.preventDefault()
                            let id = parseInt(document.getElementById("desc").className)
                            handlePutTipoTarefa(id)
                        }}>Atualizar</Button>
                    </ButtonContainer>
                </form>
            </div>
        </Page >
    )
}

export default TipoTarefa