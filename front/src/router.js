import React from "react"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import Auth from "./routes/Auth"

import Comentario from "./routes/Comentario"
import Grupo from "./routes/Grupo"
import Home from "./routes/Home.jsx"
import Prioridade from "./routes/Prioridade.jsx"
import Projeto from "./routes/Projeto.jsx"
import ProjetoUsuario from "./routes/ProjetoUsuario.jsx"
import Sistema from "./routes/Sistema.jsx"
import Tarefa from "./routes/Tarefa.jsx"
import TarefaStatus from "./routes/TarefaStatus.jsx"
import TarefaTipo from "./routes/TarefaTipo.jsx"
import Usuario from "./routes/Usuario.jsx"

export default () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/auth" component={Auth} />
                <Route path="/usuarios" component={Usuario} />
                <Route path="/comentarios" component={Comentario} />
                <Route path="/grupos" component={Grupo} />
                <Route path="/prioridades" component={Prioridade} />
                <Route path="/projetos" component={Projeto} />
                <Route path="/projetosusuarios" component={ProjetoUsuario} />
                <Route path="/sistemas" component={Sistema} />
                <Route path="/tarefas" component={Tarefa} />
                <Route path="/tipostarefas" component={TarefaTipo} />
                <Route path="/statustarefas" component={TarefaStatus} />
            </Switch>
        </BrowserRouter>
    )
}