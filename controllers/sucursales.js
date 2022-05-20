const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient()

const sendResult = require('../utils/resultsSender')


const getSucursalesByCiudad = async (req, res, next) =>{
  const {cod_postal} = req.params
  try{
    const sucursales = await prisma.sucursales.findMany({
      where: {
        ciudad_cp: Number(cod_postal)
      },
    })

    sendResult(res, sucursales)

  } catch(error){
    next(error)
  }
}


module.exports = {
  getSucursalesByCiudad
}
