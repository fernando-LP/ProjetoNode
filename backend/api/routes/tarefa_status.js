const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/status_tarefas", authMiddleware, (req, res) => {
        app.db.any("select * from tarefa_status")
            .then(data => {
                res.status(200).json({ data })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.get("/status_tarefa/:id", (req, res) => {
        let id = req.params.id
        if (isNaN(id) || id == undefined) {
            res.status(400).json({ err: "Id must be a integer!" })
        }
        app.db.any(`select * from tarefa_status where id = ${id}`)
            .then(data => {
                if (data.length <= 0) {
                    res.status(404).json({ err: "Not found" })
                } else {
                    res.status(200).json(data)
                }
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.post("/status_tarefa", (req, res) => {
        let { descricao } = req.body
        if (descricao == "")
            res.status(400).json({ err: "Invalid description" })
        app.db.none(`insert into tarefa_status(descricao) values('${descricao}')`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.put("/status_tarefa/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        let { descricao } = req.body
        if (descricao == "") {
            res.status(400).json({ msg: "Err: Description field is empty" })
        }
        app.db.any(`update tarefa_status set descricao = '${descricao}' where id = ${id}`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.delete("/status_tarefa/:id", authMiddleware, async (req, res) => {
        let { id } = req.params
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        //deletando o comentario vinculado a tarefa
        await app.db.any(`select id from tarefa where id_status_tarefa = ${id}`)
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
        //Deletando a tarefa vinculada ao status tarefa
        await app.db.any(`delete from tarefa where id_status_tarefa = ${id}`)
            .then(() => {
                app.db.any(`delete from tarefa_status where id = ${id}`)
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