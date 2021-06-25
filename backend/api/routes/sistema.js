const authMiddleware = require("../services/authMiddleware")
module.exports = app => {
    app.get("/sistemas", authMiddleware, (req, res) => {
        app.db.any("select * from sistema order by id_sistema")
            .then(data => {
                res.status(200).json({ data })
            })
            .catch(err => {
                res.status(400).json(err)
            })
    })
    app.get("/sistema/:id", authMiddleware, (req, res) => {
        let id = req.params.id
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ err: "Invalid id" })
        }
        app.db.any(`select * from sistema where id_sistema = ${id}`)
            .then(data => {
                if (data.length > 0) {
                    res.status(200).json(data)
                } else {
                    res.status(404).json({ err: "Not found" })
                }
            })
            .catch(err => {
                res.status(400).json({ err: "Bad request" })
            })
    })
    app.post("/sistema", authMiddleware, (req, res) => {
        let { nome } = req.body
        if (nome != undefined && nome != "") {
            app.db.none(`insert into sistema (nome) values('${nome}')`)
                .then(() => {
                    res.status(200).json({ msg: "success" })
                })
                .catch(err => {
                    res.status(500).json({ err: "Internal server error" })
                })
        } else {
            res.status(400).json({ err: "Name not null" })
        }
    })
    app.put("/sistema/:id", authMiddleware, (req, res) => {
        let id = req.params.id
        let { nome } = req.body
        if (isNaN(id) || id == undefined) {
            res.status(400).json({ err: "Invalid id" })
        }
        if (nome == "" || nome == undefined) {
            res.status(400).json({ err: "Invalid name" })
        }
        app.db.any(`update sistema set nome = '${nome}' where id_sistema = ${id}`)
            .then(() => {
                res.status(200).json({ msg: "success" })
            })
            .catch(err => {
                res.status(500).json({ err: "Internal server error" })
            })

    })
    app.delete("/sistema/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ err: "Invalid id" })
        }
        app.db.any(`delete from sistema where id_sistema = ${id}`)
            .then(() => {
                res.status(200).json({ err: "success" })
            })
            .catch(err => {
                res.status(500).json({ err: "Erro: " + err })
            })
    })
}