const app = require("./config/express")()

app.listen(8080, () => { console.log("Conectado") })