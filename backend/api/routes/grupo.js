const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/grupos", authMiddleware, (req, res) => {
        app.db.any("select * from grupo")
            .then(data => {
                res.status(200).json({ data })
            })
            .catch(err => {
                res.status(400).json({ err })
            })
    })
    app.get("/grupo/:id", authMiddleware, (req, res) => {
        let id = req.params.id
        app.db.any(`select * from grupo where id = ${id}`)
            .then(data => {
                res.status(400).json({ data })
            })
            .catch(err => {
                res.status(404).json({ err: "Not found" })
            })
    })
    app.post("/grupo", (req, res) => {
        let { id_projeto, descricao } = req.body
        if (descricao == "" || id_projeto == undefined) {
            res.status(400).json({ err: "Invalid id or description" })
        }
        if (isNaN(id_projeto)) {
            res.status(400).json({ err: "Id must be a integer" })
        }
        app.db.none(`insert into grupo(id_projeto, descricao) values(${id_projeto}, '${descricao}')`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(400).json({ err: "Erro: " + err })
            })
    })
    app.put("/grupo/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (!id || isNaN(id)) {
            res.status(400).json({ msg: "Err: Invalid id" })
        }
        let { descricao } = req.body
        if (!descricao)
            res.status(400).json({ msg: "Err: Invalid description" })
        app.db.any(`update grupo set descricao = '${descricao}' where id = ${id}`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
    })
    app.delete("/grupo/:id", authMiddleware, async (req, res) => {
        let { id } = req.params
        let idTarefa = undefined
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ msg: "Invalid id" })
        } else {
            //Para deletar um grupo, preciso deletar a tarefa vinculada a ele. Para deletar a tarefa, preciso deletar o comentario vinculado a ela
            //Pegando o id da tarefa vinculada ao grupo
            await app.db.any(`select id from tarefa where id_grupo = ${id}`)
                .then(data => {
                    if (data.length > 0) {
                        idTarefa = data
                    }
                })
                .catch(err => {
                    res.status(500).json({ msg: "Err: " + err })
                })
            idTarefa.forEach(t => {
                app.db.any(`delete from comentario where id_tarefa = ${t.id}`)
                    .then(() => {
                        console.log("Deletou")
                    })
                    .catch(err => {
                        res.status(500).json({ msg: "Err: " + err })
                    })
            })
            //Deletando a tarefa
            await app.db.any(`delete from tarefa where id_grupo = ${id}`)
                .then(() => {
                    //Deletando o grupo
                    app.db.any(`delete from grupo where id = ${id}`)
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
        }
    })
}