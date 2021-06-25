const express = require("express")
const cors = require("cors")
const consign = require("consign")
const pgp = require('pg-promise')({})

module.exports = () => {
    const app = express()
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cors())
    const cn = {
        'host': 'devweb.chiqahlpkytu.sa-east-1.rds.amazonaws.com',
        'port': 5432,
        'database': 'postgres',
        'user': 'root',
        'password': '123456789'
    }
    app.db = pgp(cn)
    consign({ cwd: "api" })
        .then("routes")
        .into(app)
    return app
}