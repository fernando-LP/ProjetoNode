import React, { useEffect, useState } from "react"
import axios from "axios"
import axiosConfig from "../services/token"
import { UserArea, Button, ButtonContainer, InputArea, FooterArea } from "../styled"
import { Page } from "../styled"
import { Link } from "react-router-dom"
import EditAsset from "../components/EditAsset"
import TextInput from "../components/TextInput"
import Swal from "sweetalert2"
import BackButton from "../components/BackButton"

const StatusTarefa = () => {
    let [statusTarefas, setStatusTarefas] = useState([])
    let [descStatusTarefa, setDescStatusTarefa] = useState("")
    let [newDescStatusTarefa, setNewDescStatusTarefa] = useState("")
    const handleGetStatusTarefa = () => {
        setStatusTarefas([])
        axios.get("http://localhost:8080/status_tarefas", axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    setStatusTarefas(response.data.data)
                } else {
                    console.log(`Err: ${response.statusText}`)
                }
            })
            .catch(err => {
                alert(err)
            })
    }
    const handleDeleteStatusTarefa = (id) => {
        Swal.fire({
            title: "Você tem certeza disso?",
            text: "Tudo que estiver relacionado a esse status de tarefa será deletado também",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deletar",
            confirmButtonColor: "#ff0000",
            cancelButtonText: "Cancelar"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:8080/status_tarefa/${id}`, axiosConfig)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.fire("Removido com sucesso", "O status de tarefa selecionado foi removid", "success")
                                    .then(() => handleGetStatusTarefa())
                            }
                        })
                }
            })
    }
    const handlePutStatusTarefa = (id) => {
        axios.put(`http://localhost:8080/status_tarefa/${id}`, {
            descricao: newDescStatusTarefa
        }, axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    Swal.fire("Atualizado com sucesso", "O status de tarefa foi atualizado com sucesso", "success")
                        .then(() => handleGetStatusTarefa())
                } else {
                    alert("Erro ao atualizar")
                }
            })
            .catch(err => console.log(err))
    }
    const handlePostStatusTarefa = () => {
        axios.post("http://localhost:8080/status_tarefa", {
            descricao: descStatusTarefa
        }, axiosConfig)
            .then(response => {
                if (response.status === 200) {
                    Swal.fire("Cadastrado com sucesso", "O status de tarefa foi cadastrado com sucesso", "success")
                        .then(() => handleGetStatusTarefa())
                } else {
                    alert("Erro ao inserir")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(handleGetStatusTarefa, [])
    return (
        <Page>
            <h2><Link to="/"><BackButton /></Link>Lista de status de tarefas</h2>
            <a href="#cadastro"><Button bgcolor="#0000ff" style={{ width: 130 }}>Novo status tarefa</Button></a>
            {statusTarefas.map((st, index) => {
                return <UserArea key={index}>
                    <h2>Descrição: {st.descricao.toLowerCase()}</h2>
                    <FooterArea>
                        <Button bgcolor="#ff0000" onClick={() => handleDeleteStatusTarefa(st.id)}>Excluir</Button>
                        <a href="#atualizar"><Button bgcolor="#0000ff" onClick={() => {
                            document.getElementById("desc").className = `${st.id}`
                            setNewDescStatusTarefa(`${st.descricao}`)
                        }}>Atualizar</Button></a>
                    </FooterArea>
                </UserArea>
            })}
            <div id="cadastro">
                <h2>Cadastro de novo status de tarefa</h2>
                <form>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="nova-desc" type="text" placeholder="Digite a descrição" onChange={e => setDescStatusTarefa(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={e => {
                            e.preventDefault()
                            handlePostStatusTarefa()
                        }}>Cadastrar</Button>
                    </ButtonContainer>
                </form>
            </div>
            <div id="atualizar">
                <h2>Atualizar status tarefa</h2>
                <form>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="desc" type="text" placeholder="Digite a descrição" value={newDescStatusTarefa} onChange={e => setNewDescStatusTarefa(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={(e) => {
                            e.preventDefault()
                            let id = parseInt(document.getElementById("desc").className)
                            handlePutStatusTarefa(id)
                        }}>Atualizar</Button>
                    </ButtonContainer>
                </form>
            </div>
        </Page >
    )
}

export default StatusTarefa