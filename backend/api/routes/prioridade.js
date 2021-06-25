const authMiddleware = require("../services/authMiddleware")

module.exports = app => {
    app.get("/prioridades", authMiddleware, (req, res) => {
        app.db.any("select * from prioridade order by id")
            .then(data => {
                if (data.length <= 0)
                    res.status(404).json({ err: "Data not found" })
                res.status(200).json(data)
            })
            .catch(err => {
                res.status(500).json({ err: "Internal server error" })
            })
    })
    //prioridade/?
    app.get("/prioridade/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        if (id == undefined || isNaN(id)) {
            res.status(400).json({ err: "Invalid id" })
        } else {
            app.db.any(`select * from prioridade where id = ${id}`)
                .then(data => {
                    if (data.length <= 0)
                        res.status(404).json({ err: "Not found" })
                    res.status(200).json(data)
                })
                .catch(err => {
                    res.status(500).json({ err: "Internal server error" })
                })
        }
    })
    app.post("/prioridade", authMiddleware, (req, res) => {
        let { descricao } = req.body
        if (descricao == "")
            res.status(400).json({ err: "Invalid description" })
        app.db.none(`insert into prioridade(descricao) values('${descricao}')`)
            .then(() => {
                res.status(200).json({ msg: "Success" })
            })
    })
    app.put("/prioridade/:id", authMiddleware, (req, res) => {
        let { id } = req.params
        let { descricao } = req.body
        if (descricao) {
            app.db.any(`update prioridade set descricao = '${descricao}' where id = ${id}`)
                .then(() => {
                    res.status(200)
                })
                .catch(err => {
                    res.status(500)
                })
        }
    })
    // deletar comentario -> deletar tarefa -> Deletar prioridade
    app.delete("/prioridade/:id", authMiddleware, async (req, res) => {
        let tarefaId = []
        let { id } = req.params
        await app.db.any(`select id from tarefa where id_prioridade = ${id}`)
            .then(data => {
                if (data.length > 0)
                    tarefaId = data
            })
            .catch(err => {
                res.status(500).json({ msg: "Err: " + err })
            })
        //Deletando os comentarios vinculados a tarefa de
        tarefaId.forEach(id => {
            app.db.any(`delete from comentario where id_tarefa = ${id.id}`)
                .then(() => { })
                .catch(err => {
                    res.status(500).json({ msg: "Err: " + err })
                })
        })
        //deletando a tarefa
        await app.db.any(`delete from tarefa where id_prioridade = ${id}`)
            .then(() => {
                //deletando a prioridade
                app.db.any(`delete from prioridade where id=${id}`)
                    .then(() => {
                        res.status(200).json({ msg: "Success" })
                    })
                    .catch(err => res.status(500).json({ msg: "Err: " + err }))
            })
    })
}