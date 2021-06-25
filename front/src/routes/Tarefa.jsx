import React, { useEffect, useState } from "react"
import { Page, UserArea, Button, ButtonContainer, InputArea, FooterArea } from "../styled"
import axiosConfig from "../services/token"
import axios from "axios"
import TextInput from "../components/TextInput"
import TituloAsset from "../components/TituloAsset"
import EditAsset from "../components/EditAsset"
import IdAsset from "../components/IdAsset"
import CronometroAsset from "../components/CronometroAsset"
import BackButton from "../components/BackButton"
import CadeadosAsset from "../components/CadeadosAsset"
import ComplexidadeAsset from "../components/ComplexidadeAsset"
import ImpactoAsset from "../components/ImpactoAsset"
import Swal from "sweetalert2"

import { Link } from "react-router-dom"

const Tarefa = () => {
    let [tarefas, setTarefas] = useState([])
    let [newTitulo, setNewTitulo] = useState("")
    let [newDesc, setNewDesc] = useState("")
    let [newComplexidade, setNewComplexidade] = useState("")
    let [newImpacto, setNewImpacto] = useState("")
    let [titulo, setTitulo] = useState("")
    let [descricao, setDescricao] = useState("")
    let [id_projeto, setId_projeto] = useState("")
    let [id_criador, setId_criador] = useState("")
    let [id_dev, setId_dev] = useState("")
    let [tempo_estimado, setTempo_estimado] = useState("")
    let [id_tipo_tarefa, setId_tipo_tarefa] = useState("")
    let [id_status_tarefa, setId_status_tarefa] = useState("")
    let [tempo_realizado, setTempo_realizado] = useState("")
    let [authorized, SetAuthorized] = useState("")
    let [id_prioridade, setId_prioridade] = useState("")
    let [complexidade, setComplexidade] = useState("")
    let [impacto, setImpacto] = useState("")
    let [id_grupo, setId_grupo] = useState("")
    let [newTempo_estimado, setNewTempo_estimado] = useState("")
    const handleGetTarefas = () => {
        setTarefas([])
        axios.get("http://localhost:8080/tarefas", axiosConfig)
            .then(response => {
                if (response.status === 200)
                    setTarefas(response.data.data)
            })
            .catch(err => console.log(err))
    }
    const handlePostTarefa = () => {
        axios.post("http://localhost:8080/tarefa", {
            titulo,
            descricao,
            id_projeto,
            id_criador,
            id_dev,
            tempo_estimado,
            id_tipo_tarefa,
            id_status_tarefa,
            tempo_realizado,
            authorized,
            id_prioridade,
            complexidade,
            impacto,
            id_grupo
        }, axiosConfig)
            .then(response => {
                if (response.status === 200)
                    Swal.fire("Cadastrado com sucesso", "A tarefa foi cadastrada com sucesso", "success")
                        .then(() => handleGetTarefas())
                else
                    alert("Erro ao inserir")
            })
    }
    const handleDeleteTarefa = id => {
        Swal.fire({
            title: "Você tem certeza disso?",
            text: "Tudo que estiver relacionado a essa tarefa será deletado também",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Deletar",
            confirmButtonColor: "#ff0000",
            cancelButtonText: "Cancelar"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    await axios.delete(`http://localhost:8080/tarefa/${id}`, axiosConfig)
                        .then((response) => {
                            if (response.status === 200) {
                                Swal.fire("Removido com sucesso", "A tarefa selecionada foi removida", "success")
                                    .then(() => {
                                        handleGetTarefas()
                                    })
                            }
                        })
                }
            })
    }
    const handlePutTarefa = async (id) => {
        await axios.put(`http://localhost:8080/tarefa/${id}`, {
            titulo: newTitulo,
            descricao: newDesc,
            tempo_estimado: newTempo_estimado,
            complexidade: newComplexidade,
            impacto: newImpacto
        }, axiosConfig)
            .then(response => {
                if (response.status === 200)
                    Swal.fire("Atualizado com sucesso", "A tarefa foi atualizada com sucesso", "success")
                        .then(() => handleGetTarefas())
            })
            .catch(err => console.log("Erro: " + err))
    }
    useEffect(handleGetTarefas, [])
    return (
        <Page>
            <h2><Link to="/"><BackButton /></Link>Lista de tarefas</h2>
            <a href="#cadastro"><Button bgcolor="#0000ff">Nova tarefa</Button></a>
            {tarefas.map((tarefa, index) => {
                return <UserArea key={index}>
                    <h2>Título: {tarefa.titulo.toLowerCase()}</h2>
                    <div>
                        <p>Descrição: {tarefa.descricao}</p>
                        <p>Id criador: {tarefa.id_criador}</p>
                        <p>Id projeto: {tarefa.id_projeto}</p>
                        <p>Tempo estimado: {tarefa.tempo_estimado}</p>
                        <p>Data início: {tarefa.data_inicio}</p>
                        <p>Data fim: {tarefa.data_fim}</p>
                        <p>Complexidade: {tarefa.complexidade}</p>
                        <p>Impacto: {tarefa.impacto}</p>
                        <p>Id grupo: {tarefa.id_grupo}</p>
                    </div>
                    <FooterArea>
                        <Button bgcolor="#ff0000" onClick={() => handleDeleteTarefa(tarefa.id)}>Excluir</Button>
                        <a href="#atualizar"><Button bgcolor="#0000ff" onClick={() => {
                            document.getElementById("novo-titulo").className = `${tarefa.id}`
                            setNewTitulo(`${tarefa.titulo}`)
                            setNewDesc(`${tarefa.descricao}`)
                            setNewComplexidade(`${tarefa.complexidade}`)
                            setNewImpacto(`${tarefa.impacto}`)
                            setNewTempo_estimado(`${tarefa.tempo_estimado}`)
                        }}>Atualizar</Button></a>
                    </FooterArea>
                </UserArea>
            })}
            <div id="cadastro">
                <h2>Cadastro de nova tarefa</h2>
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
                        <TextInput type="number" placeholder="Digite o id do criador" onChange={e => setId_criador(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id do projeto" onChange={e => setId_projeto(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id do dev" onChange={e => setId_dev(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <CronometroAsset />
                        <TextInput type="number" placeholder="Digite o tempo estimado" onChange={e => setTempo_estimado(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id do tipo da tarefa" onChange={e => setId_tipo_tarefa(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id do status da tarefa" onChange={e => setId_status_tarefa(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <CronometroAsset />
                        <TextInput type="number" placeholder="Digite o tempo realizado" onChange={e => setTempo_realizado(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id da prioridade" onChange={e => setId_prioridade(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <ComplexidadeAsset />
                        <TextInput type="number" placeholder="Digite a complexidade" onChange={e => setComplexidade(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <ImpactoAsset />
                        <TextInput type="number" placeholder="Digite o impacto" onChange={e => setImpacto(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <IdAsset />
                        <TextInput type="number" placeholder="Digite o id do grupo" onChange={e => setId_grupo(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <CadeadosAsset />
                        <TextInput type="text" placeholder="Tarefa autorizada -> true | Tarefa n autorizada -> false" onChange={e => SetAuthorized(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={e => {
                            e.preventDefault();
                            handlePostTarefa()
                        }}>Cadastrar</Button>
                    </ButtonContainer>
                </form>
            </div>
            <div id="atualizar">
                <h2>Atualizar tarefa</h2>
                <form>
                    <InputArea>
                        <TituloAsset />
                        <TextInput id="novo-titulo" value={newTitulo} type="text" placeholder="Digite o titulo" onChange={e => setNewTitulo(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <EditAsset />
                        <TextInput id="nova-descricao" value={newDesc} type="text" placeholder="Digite a descricao" onChange={e => setNewDesc(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <ComplexidadeAsset />
                        <TextInput id="nova-complexidade" value={newComplexidade} type="text" placeholder="Digite a complexidade" onChange={e => setNewComplexidade(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <ImpactoAsset />
                        <TextInput id="novo-impacto" value={newImpacto} type="text" placeholder="Digite o impacto" onChange={e => setNewImpacto(e.target.value)} />
                    </InputArea>
                    <InputArea>
                        <CronometroAsset />
                        <TextInput id="novo-estimado" value={newTempo_estimado} type="number" placeholder="Digite o tempo estimado" onChange={e => setNewTempo_estimado(e.target.value)} />
                    </InputArea>
                    <ButtonContainer>
                        <Button bgcolor="#0000ff" onClick={(e) => {
                            e.preventDefault()
                            let id = parseInt(document.getElementById("novo-titulo").className)
                            handlePutTarefa(id)
                        }} >Atualizar</Button>
                    </ButtonContainer>
                </form>
            </div>
        </Page >
    )
}

export default Tarefa