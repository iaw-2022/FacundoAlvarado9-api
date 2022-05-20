const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient()

const sendResult = require('../utils/resultsSender')


const getAllCiudades = async (req, res, next) => {
  try{
      const ciudades = await prisma.ciudades.findMany({})
      sendResult(res, ciudades)
  } catch(error){
      next(error)
  }
}

const getCiudadByCP = async (req, res, next) =>{
  const {cod_postal} = req.params
  const ciudad = await prisma.ciudades.findMany({
    where: {
      cod_postal: Number(cod_postal)
    },
  })

  sendResult(res, ciudad)
}


module.exports = {
  getAllCiudades,
  getCiudadByCP
}
