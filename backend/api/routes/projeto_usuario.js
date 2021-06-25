const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/projetos_usuarios", authMiddleware, (req, res) => {
        app.db.any("select * from projeto_usuario")
            .then(data => {
                res.status(200).json({ data })
            })
            .catch(err => {
                res.status(400).json({ err })
            })
    })
    app.get("/projeto_usuario/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (!id || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        app.db.any(`select * from projeto_usuario where id = ${id}`)
            .then(data => {
                if (data.length > 0)
                    res.status(200).json(data)
                else
                    res.status(404).json({ msg: "Err: Data not found" })
            })
    })
    app.post("/projeto_usuario", (req, res) => {
        let { id_projeto, id_usuario } = req.body
        if (id_projeto == undefined || id_usuario == undefined || isNaN(id_usuario) || isNaN(id_projeto)) {
            res.status(400).json({ err: "Invalid project id or user id" })
        }
        app.db.none(`insert into projeto_usuario(id_projeto, id_usuario) values(${id_projeto}, ${id_usuario})`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(400).json({ msg: "Err: " + err })
            })
    })
    app.delete("/projeto_usuario/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (!id || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        } else {
            app.db.any(`delete from projeto_usuario where id = ${id}`)
                .then(() => {
                    res.status(200).json({ msg: "Success" })
                })
                .catch(err => {
                    res.status(500).json({ msg: "Err: " + err })
                })
        }
    })
}