const { Cars } = require('../models')

module.exports = class {
    static async getCars(req, res) {
        try {
            const result = await Cars.findAll({where: {status: 1}})
            res.status(200).json({
                status: 200,
                data: result
            })
        }
        
        catch (err) {
            res.send(err)
        }
    }

    static async addCar(req, res) {
        try {
            const cekData = await Cars.findOne({ where: {name: req.body.name, status: 1} })
            
            if(cekData) {
                res.status(400).send({
                    status: 400,
                    message: 'Data mobil sudah ada!'
                })
            }

            else {
                const result = await Cars.create({
                    name: req.body.name,
                    price: req.body.price,
                    size: req.body.size,
                    image: req.body.image,
                    createdBy: req.header('username'),
                    lastEditBy: req.header('username'),
                    deletedBy: null,
                    status: 1
                })

                res.status(201).json({
                    status: 201,
                    message: "Data mobil telah disimpan!",
                    data: result
                })
            }
        }
        
        catch (err) {
            res.send(err)
        }
    }

    static async editCar(req, res) {
        const cekData = await Cars.findOne({where: {id: req.params.id, status: 1}})

            if(!cekData) {
                res.status(400).send({
                    status: 400,
                    message: 'Data mobil tidak ditemukan!'
                })
            }

            else {
                try {
                    await Cars.update({
                        name: req.body.name,
                        price: req.body.price,
                        size: req.body.size,
                        image: req.body.image,
                        createdBy: cekData.createdBy,
                        lastEditBy: req.header('username'),
                        deletedBy: cekData.deletedBy,
                        status: 1
                    }, { where: {id: req.params.id} })
            
                    res.status(201).json({
                        status: 201,
                        message: "Data mobil telah diperbarui!",
                        data: req.body,
                        username: req.header('username')
                    })
                }

                catch(err) {
                    res.send(err)
                }
            }
    }

    static async deleteCar(req, res) {
        const cekData = await Cars.findOne({where: {id: req.params.id, status: 1}})

        if(!cekData) {
            res.status(400).send({
                status: 400,
                data: 'Data mobil tidak ditemukan!'
            })
        }

        else {
            try {
                await Cars.update({
                    name: cekData.name,
                    price: cekData.price,
                    size: cekData.size,
                    image: cekData.image,
                    createdBy: cekData.createdBy,
                    lastEditBy: cekData.lastEditBy,
                    deletedBy: req.header('username'),
                    status: 0
                }, { where: {id: req.params.id} })
    
                res.status(201).json({
                    status: 201,
                    message: "Data mobil telah dihapus!"
                })
            }
            
            catch(err) {
                res.send(err)    
            }
        }
    }
}