const jwt = require("jsonwebtoken")
const JWTSECRET = "dhsjdjehdjshjdsjbcjhfjdhfj"

module.exports = function authentication(req, res, next) {
    let authToken = req.headers['authorization']
    let bearer = authToken.split(" ")
    let token = bearer[1]
    if (bearer[0] == "Bearer") {
        jwt.verify(token, JWTSECRET, (err) => {
            if (err) {
                res.status(401).json({ err: err.message })
            } else {
                next()
            }
        })
    } else {
        res.status(401).json({ msg: "Unauthorized" })
    }
}