const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    const token = req.header('auth-token')
    const tokenAdmin = req.header('auth-admin-token')
    const tokenSuper = req.header('auth-super-token')
    var TOKEN

    if(token) { TOKEN = token }
    else if(tokenAdmin) { TOKEN = tokenAdmin }
    else if(tokenSuper) { TOKEN =  tokenSuper}
    else { return res.status(401).send("Access denied!") }

    try {
        const verifikasi = jwt.verify(TOKEN, process.env.TOKEN_RAHASIA)
        req.user = verifikasi
        next()
    }
    
    catch (error) {
        res.status(400).send("Invalid token!")
    }
}

// Hanya Super Admin
function authSuper(req, res, next) {
    const token = req.header('auth-super-token')

    if(!token) return res.status(401).send("Access denied!")

    try {
        const verifikasi = jwt.verify(token, process.env.TOKEN_RAHASIA)
        req.user = verifikasi
        next()
    }
    
    catch (error) {
        res.status(400).send("Invalid token!")
    }
}

// Hanya Super Admin dan Admin
function authAdmin(req, res, next) {
    const token = req.header('auth-admin-token')
    const tokenSuper = req.header('auth-super-token')
    var TOKEN

    if(token) { TOKEN = token }
    else if(tokenSuper) { TOKEN =  tokenSuper}
    else { return res.status(401).send("Access denied!") }

    try {
        const verifikasi = jwt.verify(TOKEN, process.env.TOKEN_RAHASIA)
        req.user = verifikasi
        next()
    }
    
    catch (error) {
        res.status(400).send("Invalid token!")
    }
}

module.exports = {auth, authSuper, authAdmin}