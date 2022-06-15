const express = require('express')
const createError = require('http-errors')
const { PrismaClient } =  require('@prisma/client')

const prisma = new PrismaClient()
const router = express.Router()

const origenesController = require('../controllers/origenes')

const variedadesController = require('../controllers/variedades')

const variedadesRouter = express.Router({mergeParams: true})

router.get('', origenesController.getAllOrigenes)

router.get('/:id', origenesController.getOrigenByID)

router.use('/:id/variedades', variedadesRouter)
variedadesRouter.get('/', variedadesController.getVariedadesByOrigen)

module.exports = router
