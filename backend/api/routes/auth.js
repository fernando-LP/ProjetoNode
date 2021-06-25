const tokenGenerator = require("../services/tokenGenerator")

module.exports = app => {
    app.post("/auth", (req, res) => {
        let { email, pass } = req.body
        if (email != undefined) {
            if (email == "root@root") {
                if (pass == "root") {
                    let token = tokenGenerator(email)
                    res.status(200).json(token)
                } else {
                    res.status(401).json({ err: "Unauthtorized" })
                }
            } else {
                res.status(400).json({ err: "Invalid email or password" })
            }
        } else {
            res.status(400).json({ err: "Invalid email or password" })
        }

    })
}