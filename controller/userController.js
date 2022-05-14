const { Users } = require('../models')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = class {
    static async getUsers(req, res) {
        try {
            const result = await Users.findAll()
            
            res.status(200).json({
                status: 200,
                data: result
            })
        }

        catch(err) {
            res.send(err)
        }
    }

    static async getCurrentUser(req, res) {
        try {
            const result = await Users.findOne({ where: { username: req.header('username') } })

            res.status(200).json({
                status: 200,
                message: 'OK',
                data: result
            })
        }
        
        catch (err) {
            res.send(err)
        }
    }

    static async login(req, res) {
        try {
            const getData = await Users.findOne({ where: {email: req.body.email} })
            
            if(getData) {
                const passCompare = bcrypt.compareSync(req.body.pass, getData.pass)

                if(passCompare) {
                    const token = jwt.sign({_username: getData.username}, process.env.TOKEN_RAHASIA)
                    var role = getData.role
                    res.header('username', getData.username)

                    switch (role) {
                        case 1:
                            res.header('auth-super-token', token).send('Login super admin berhasil!')
                            break;

                        case 2:
                            res.header('auth-admin-token', token).send('Login admin berhasil!')
                            break;

                        case 3:
                            res.header('auth-member-token', token).send('Login member berhasil!')
                    
                        default:
                            break;
                    }
                }

                else { res.status(400).send('Login gagal!') }
            }

            else { res.status(400).send('Login gagal!') }
        }
        
        catch (err) {
            res.send(err)
        }
    }

    static async registerAdmin(req, res) {
        try {
            const salt = bcrypt.genSaltSync(10)
            const hashedPass = await bcrypt.hashSync(req.body.pass, salt)
            const cekData = await Users.findOne({ where: {email: req.body.email} })

            if(cekData) {
                res.status(400).send({
                    status: 400,
                    message: 'Email sudah terdaftar!'
                })
            }

            else {
                await Users.create({
                    email: req.body.email,
                    username: req.body.username,
                    role: 2,
                    pass: hashedPass
                })

                res.status(201).json({
                    status: 201,
                    message: 'Admin baru telah ditambahkan!',
                    result: {
                        email: req.body.email,
                        username: req.body.username,
                        role: 'Admin',
                        pass: hashedPass
                    }
                })
            }
        }
        
        catch (err) {
            res.send(err)
        }
    }

    static async registerMember(req, res) {
        try {
            const salt = bcrypt.genSaltSync(10)
            const hashedPass = await bcrypt.hashSync(req.body.pass, salt)
            const cekData = await Users.findOne({ where: {email: req.body.email} })

            if(cekData) {
                res.status(400).send({
                    status: 400,
                    message: 'Email sudah terdaftar!'
                })
            }

            else {
                await Users.create({
                    email: req.body.email,
                    username: req.body.username,
                    role: 3,
                    pass: hashedPass
                })

                res.status(201).json({
                    status: 201,
                    message: 'Selamat, anda telah terdaftar sebagai member!',
                    result: {
                        email: req.body.email,
                        username: req.body.username,
                        role: 'Member',
                        pass: hashedPass
                    }
                })
            }
        }
        
        catch (err) {
            res.send(err)
        }
    }
}