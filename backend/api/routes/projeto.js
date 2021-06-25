const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/projetos", authMiddleware, (req, res) => {
        app.db.any("select * from projeto")
            .then(data => {
                if (data.length > 0)
                    res.status(200).json(data)
                else
                    res.status(404).json({ msg: "Err: Data not found" })
            })
            .catch(err => {
                res.status(400).json({ err })
            })
    })
    app.get("/projeto/:id", authMiddleware, (req, res) => {
        let id = req.params.id
        app.db.any(`select * from projeto where id = ${id}`)
            .then(data => {
                if (data.length > 0)
                    res.status(200).json(data)
                else
                    res.status(404).json({ err: "Not found" })
            })
            .catch(err => {
                res.status(400).json({ err })
            })
    })
    app.post("/projeto", (req, res) => {
        let { titulo, descricao, id_criador, id_sistema } = req.body
        if (titulo == "" || descricao == "" || id_criador == undefined || id_sistema == undefined)
            res.status(400).json({ err: "Invalid data" })
        if (isNaN(id_sistema) || isNaN(id_criador))
            res.status(400).json({ err: "Invalid system or creator" })
        let dataHoje = Math.round(new Date(2021, 10, 11, 20, 30, 45, 1).getTime() / 1000)
        let dataInicio = Math.round(new Date().getTime() / 1000)
        let dataFim = Math.round(new Date().getTime() / 1000)
        //Inserindo 
        app.db.none(`insert into projeto (titulo, descricao, data_inicio, data_fim, id_criador, created_at, updated_at, id_sistema) values('${titulo}', '${descricao}', TO_TIMESTAMP(${dataInicio})::timestamp, TO_TIMESTAMP(${dataFim})::timestamp, ${id_criador}, TO_TIMESTAMP(${dataHoje})::timestamp, TO_TIMESTAMP(${dataHoje})::timestamp, ${id_sistema})`)
            .then(() => {
                res.status(200).json({ msg: "success" })
            })
            .catch(err => {
                res.status(500).json("Erro: " + err)
            })

    })
    app.put("/projeto/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (!id || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        let { titulo, descricao } = req.body
        let updated_at = Math.round(new Date().getTime() / 1000)
        if (!titulo || !descricao)
            res.status(400).json({ msg: "Err: Invalid title or description" })
        app.db.any(`update projeto set titulo = '${titulo}', descricao = '${descricao}', updated_at = to_timestamp(${updated_at})::timestamp where id = ${id}`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.delete("/projeto/:id", authMiddleware, async (req, res) => {
        let { id } = req.params
        let tarefaId = []
        if (!id || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        //Deletando o projeto usuario
        await app.db.any(`delete from projeto_usuario where id_projeto = ${id}`)
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
        //Pegando o id da tarefa vinculada ao projeto
        await app.db.any(`select id from tarefa where id_projeto = ${id}`)
            .then(data => {
                if (data.length > 0) {
                    tarefaId = data
                }
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
        //Deletando os comentarios vinculados a tarefa
        tarefaId.forEach(t => {
            app.db.any(`delete from comentario where id_tarefa = ${t.id}`)
                .catch(err => {
                    res.status(500).json({ msg: "Err: " + err })
                })
        })
        //Deletando as tarefas
        await app.db.any(`delete from tarefa where id_projeto = ${id}`)
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
        //Deletando os grupos
        await app.db.any(`delete from grupo where id_projeto = ${id}`)
            .then(() => {
                //Deletando o projeto
                app.db.any(`delete from projeto where id = ${id}`)
                    .then(() => {
                        res.status(200).json({ msg: "Success" })
                    })
                    .catch(err => {
                        res.status(500).json({ msg: "Err: " + err })
                    })

            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })

    })

}