const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/comentarios", authMiddleware, (req, res) => {
        app.db.any("select * from comentario")
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.get("/comentario/:id", authMiddleware, (req, res) => {
        let id = req.params.id
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        app.db.any(`select * from comentario where id = ${id}`)
            .then(data => {
                if (data.length > 0)
                    res.status(200).json(data)
                else
                    res.status(404).json({ msg: "Err: Data not found" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.post("/comentario", (req, res) => {
        let { id_usuario, id_tarefa, descricao } = req.body
        let dataHoje = Math.round(new Date().getTime() / 1000)
        if (id_usuario == undefined || id_tarefa == undefined || descricao == "") {
            res.status(400).json({ msg: "Err: Invalid data" })
        }
        if (isNaN(id_usuario) || isNaN(id_tarefa)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        app.db.none(`insert into comentario(id_usuario, id_tarefa, created_at, updated_at, descricao) values(${id_usuario}, ${id_tarefa}, to_timestamp(${dataHoje})::timestamp, to_timestamp(${dataHoje})::timestamp, '${descricao}')`)
            .then(() => {
                res.status(200).json({ msg: "Sucess" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })

    })
    app.put("/comentario/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        //Updated_at
        let updated_at = Math.round(new Date().getTime() / 1000)
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        let { id_usuario, descricao } = req.body
        if (id_usuario == undefined || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid user id" })
        }
        if (descricao == "") {
            res.status(400).json({ msg: "Err: Description field is empty" })
        }
        app.db.any(`update comentario set id_usuario = ${id_usuario}, descricao = '${descricao}', updated_at = to_timestamp(${updated_at})::timestamp where id = ${id}`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.delete("/comentario/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ err: "Invalid id" })
        }
        app.db.any(`delete from comentario where id = ${id}`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
}