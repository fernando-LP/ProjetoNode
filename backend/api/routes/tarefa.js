const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/tarefas", authMiddleware, (req, res) => {
        app.db.any("select * from tarefa")
            .then(data => {
                res.status(200).json({ data })
            })
            .catch(err => {
                res.status(400).json({ err })
            })
    })
    app.get("/tarefa/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (isNaN(id) || id == undefined) {
            res.status(400).json({ err: "Invalid id" })
        } else {
            app.db.any(`select * from tarefa where id = ${id}`)
                .then(data => {
                    if (data.length <= 0)
                        res.status(404).json({ err: "Not found" })
                    else
                        res.status(200).json(data)
                })
                .catch(err => {
                    res.status(500).json({ err: "Internal server error" })
                })
        }
    })
    app.post("/tarefa", authMiddleware, (req, res) => {
        let { titulo, descricao, id_projeto, id_criador, id_dev, tempo_estimado, id_tipo_tarefa, id_status_tarefa, tempo_realizado, authorized, id_prioridade, complexidade, impacto, id_grupo } = req.body
        let dataInicio = Math.round(new Date(2019, 10, 12, 10, 40, 24, 10).getTime() / 1000)
        let dataFim = Math.round(new Date(2025, 4, 20, 10, 40, 24, 10).getTime() / 1000)
        let dataInicioDev = Math.round(new Date(2019, 11, 12, 10, 40, 24, 10) / 1000)
        let dataFimDev = Math.round(new Date(2024, 10, 12, 10, 40, 24, 10) / 1000)
        let dataHoje = Math.round(new Date() / 1000)
        app.db.none(`insert into tarefa(titulo, descricao, id_projeto, id_criador, id_dev, tempo_estimado, data_inicio, data_fim, id_tipo_tarefa, id_status_tarefa, data_inicio_dev, data_fim_dev, created_at, updated_at, tempo_realizado, authorized, id_prioridade, complexidade, impacto, id_grupo) values('${titulo}', '${descricao}', ${id_projeto}, ${id_criador}, ${id_dev}, ${tempo_estimado}, to_timestamp(${dataInicio})::timestamp, to_timestamp(${dataFim})::timestamp, ${id_tipo_tarefa}, ${id_status_tarefa}, to_timestamp(${dataInicioDev})::timestamp, to_timestamp(${dataFimDev})::timestamp, to_timestamp(${dataHoje})::timestamp, to_timestamp(${dataHoje})::timestamp, ${tempo_realizado}, ${authorized}, ${id_prioridade}, ${complexidade}, ${impacto}, ${id_grupo})`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(400).json({ err: "Erro: " + err })
            })
    })
    app.put("/tarefa/:id", (req, res) => {
        let { id } = req.params
        let { titulo, descricao, tempo_estimado, complexidade, impacto } = req.body
        let updated_at = Math.round(new Date().getTime() / 1000)
        app.db.any(`update tarefa set titulo='${titulo}', descricao='${descricao}', tempo_estimado=${tempo_estimado}, complexidade=${complexidade}, impacto=${impacto} where id=${id}`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.delete("/tarefa/:id", authMiddleware, async (req, res) => {
        let { id } = req.params
        if (!id || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        //Deletando o comentario para poder deletar a tarefa
        await app.db.any(`delete from comentario where id_tarefa = ${id}`)
            .then(() => {
                app.db.any(`delete from tarefa where id = ${id}`)
                    .then(() => {
                        res.status(200).json({ msg: "Success" })
                    })
                    .catch(err => {
                        res.status(500).json({ msg: "Err: " + err })
                    })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err " + err })
            })

    })
}