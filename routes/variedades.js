const express = require('express')
const createError = require('http-errors')
const { PrismaClient } =  require('@prisma/client')

const prisma = new PrismaClient()
const router = express.Router()
const sucursalesRouter = express.Router({mergeParams: true})

const ciudadesController = require('../controllers/variedades')

router.get('', ciudadesController.getAllVariedades)

router.get('/:id', ciudadesController.getVariedadByID)


module.exports = router
