const express = require('express')
const createError = require('http-errors')
const { PrismaClient } =  require('@prisma/client')

const prisma = new PrismaClient()
const router = express.Router()
const sucursalesRouter = express.Router({mergeParams: true})

const ciudadesController = require('../controllers/ciudades')
const sucursalesController = require('../controllers/sucursales')

router.get('', ciudadesController.getAllCiudades)

router.get('/:cod_postal', ciudadesController.getCiudadByCP)
router.use('/:cod_postal/sucursales', sucursalesRouter)

sucursalesRouter.get('/', sucursalesController.getSucursalesByCiudad)

module.exports = router
