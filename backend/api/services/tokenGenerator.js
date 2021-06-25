const jwt = require("jsonwebtoken")

const JWTSECRET = "dhsjdjehdjshjdsjbcjhfjdhfj"

module.exports = (email) => {
    let token = jwt.sign({ email }, JWTSECRET, { expiresIn: '20h' })
    return token
}