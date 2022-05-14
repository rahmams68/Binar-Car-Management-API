var express = require('express');
var router = express.Router();

var car = require('../controller/carController')
var user = require('../controller/userController')
var verify = require('../middleware/verifyToken')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/users', verify.authSuper, user.getUsers)
router.get('/users/currentUser', verify.auth, user.getCurrentUser)
router.post('/users/login', user.login)
router.post('/users/registerAdmin', verify.authSuper, user.registerAdmin)
router.post('/users/registerMember', user.registerMember)

router.get('/cars', verify.authAdmin, car.getCars)
router.post('/cars/add', verify.authAdmin, car.addCar)
router.put('/cars/:id', verify.authAdmin, car.editCar)
router.put('/cars/delete/:id', verify.authAdmin, car.deleteCar)

module.exports = router;