const express = require('express')
const createError = require('http-errors')
const { PrismaClient } =  require('@prisma/client')

const prisma = new PrismaClient()
const router = express.Router()

const variedadesController = require('../controllers/variedades')

router.get('', variedadesController.getAllVariedades)

router.get('/:id', variedadesController.getVariedadByID)


module.exports = router
