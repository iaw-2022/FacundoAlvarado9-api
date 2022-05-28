const express = require('express')
const createError = require('http-errors')
const { PrismaClient } =  require('@prisma/client')

const prisma = new PrismaClient()
const router = express.Router()

const tostaduriasController = require('../controllers/tostadurias')

const sucursalesController = require('../controllers/sucursales')
const variedadesController = require('../controllers/variedades')

const sucursalesRouter = express.Router({mergeParams: true})
const variedadesRouter = express.Router({mergeParams: true})

router.get('', tostaduriasController.getAllTostadurias)

router.get('/:id', tostaduriasController.getTostaduriaByID)

router.use('/:id/sucursales', sucursalesRouter)

sucursalesRouter.get('/', sucursalesController.getSucursalesByTostaduria)

router.use('/:id/variedades', variedadesRouter)
variedadesRouter.get('/', variedadesController.getVariedadesByTostaduria)

module.exports = router
