const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/usuarios", authMiddleware, (req, res) => {
        app.db.any("select * from usuario order by id_usuario")
            .then(data => {
                res.status(200).json({ data })
            })
            .catch(err => {
                res.status(400).json({ err })
            })

    })
    app.get("/usuario/:id", (req, res) => {
        let id = req.params.id
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ err: "Invalid id" })
        } else {
            app.db.any(`select * from usuario where id_usuario = ${id}`)
                .then(data => {
                    res.status(200).json(data)
                })
                .catch(err => {
                    res.status(500).json({ err: "Internal server error" })
                })
        }

    })
    app.post("/usuario", (req, res) => {
        let { nome } = req.body
        if (nome == undefined || nome == "") {
            res.status(400).json({ err: "Invalid name" })
        } else {
            app.db.none(`insert into usuario (nome) values('${nome}')`)
                .then(() => {
                    res.status(200).json({ msg: "success" })
                })
                .catch(err => {
                    res.status(500).json({ err: "Internal server error" })
                })
        }
    })
    app.put("/usuario/:id", (req, res) => {
        let { id } = req.params
        let { nome } = req.body
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ err: "Invalid id" })
        }
        if (nome == "") {
            res.status(400).json({ err: "Invalid name" })
        }
        app.db.any(`update usuario set nome = '${nome}' where id_usuario = ${id}`)
            .then(() => {
                res.status(200).json({ msg: "success" })
            })
            .catch(err => {
                res.status(500).json({ err: "Internal server error" })
            })
    })
    app.delete("/usuario/:id", async (req, res) => {
        let { id } = req.params
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ mdg: "Err: Invalid id" })
        } else {
            //Deletando o projeto usuario vinculado ao usuario
            await app.db.any(`delete from projeto_usuario where id_usuario = ${id}`)
                .then(() => {
                    app.db.any(`delete from usuario where id_usuario = ${id}`)
                        .then(() => {
                            res.status(200).json({ msg: "success" })
                        })
                        .catch(err => {
                            res.status(500).json({ err: "Internal server error" })
                        })
                })
                .catch(err => {
                    res.status(500).json({ msg: "Err: " + err })
                })
        }
    })
}