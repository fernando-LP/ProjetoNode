const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/tipos_tarefas", authMiddleware, (req, res) => {
        app.db.any("select * from tarefa_tipo")
            .then(data => {
                res.status(200).json({ data })
            })
            .catch(err => {
                res.status(400).json({ err })
            })
    })
    app.get("/tipo_tarefa/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (!id || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        app.db.any(`select * from tarefa_tipo where id = ${id}`)
            .then((data) => {
                if (data.length > 0)
                    res.status(200).json(data)
                else
                    res.status(404).json({ msg: "Err: data not found" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.post("/tipo_tarefa", (req, res) => {
        let { descricao } = req.body
        if (descricao == "") {
            res.status(400).json({ err: "Invalid description" })
        }
        app.db.none(`insert into tarefa_tipo(descricao) values('${descricao}')`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(500).json({ err: "Internal server error" })
            })
    })
    app.put("/tipo_tarefa/:id", authMiddleware, async (req, res) => {
        let { id } = req.params
        let { descricao } = req.body
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        } else {
            await app.db.any(`update tarefa_tipo set descricao = '${descricao}' where id = ${id}`)
        }
    })
    app.delete("/tipo_tarefa/:id", authMiddleware, async (req, res) => {
        let { id } = req.params
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        //deletando o comentario vinculado a tarefa
        await app.db.any(`select id from tarefa where id_tipo_tarefa = ${id}`)
            .then(data => {
                if (data.length > 0) {
                    let tarefaId = data[0].id
                    if (tarefaId) {
                        app.db.any(`delete from comentario where id_tarefa = ${tarefaId}`)
                            .then(() => {
                                console.log("Entrei aqui")
                            })
                            .catch(err => {
                                res.status(500).json({ msg: "Err: " + err })
                            })
                    }
                }
            })
        //Deletando a tarefa vinculada ao tipo tarefa
        await app.db.any(`delete from tarefa where id_tipo_tarefa = ${id}`)
            .then(() => {
                app.db.any(`delete from tarefa_tipo where id = ${id}`)
                    .then(() => {
                        res.status(200).json({ msg: "Success" })
                    })
                    .catch(err => {
                        res.status(500).json({ msg: "Err :" + err })
                    })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
}