import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Button = styled.button`
    margin-left:10px;
    height:30px;
    background-color:#0000ff;
    cursor:pointer;
    border: 1px solid #0000ff;
    color:#FFF;
`

const Home = () => {
    return (
        <div style={{ margin: "0px 20px" }}>
            <h2>Sistema de gerenciamento</h2>
            <span>Para usar nosso sistema, você precisa estar autenticado</span>
            <Button type="button" >
                <Link to="/auth"><span style={{ color: '#fff' }}>Autenticar</span></Link>
            </Button>
            <ul>
                <li><Link to="/usuarios">Usuario</Link></li>
                <li><Link to="/comentarios">Comentario</Link></li>
                <li><Link to="/grupos">Grupo</Link></li>
                <li><Link to="/prioridades">Prioridade</Link></li>
                <li><Link to="/projetos">Projeto</Link></li>
                <li><Link to="/sistemas">Sistema</Link></li>
                <li><Link to="/tarefas">Tarefa</Link></li>
                <li><Link to="/tipostarefas">Tipos de tarefas</Link></li>
                <li><Link to="/statustarefas">Status das tarefas</Link></li>
            </ul>
        </div>
    )
}

export default Home