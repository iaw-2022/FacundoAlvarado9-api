const express = require('express')

const router = express.Router()

const tiposController = require('../controllers/tipos')

router.get('', tiposController.getAllTipos)

module.exports = router
