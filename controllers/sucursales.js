const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')
const validateIDParam = require('../utils/validateIDParam')


const getSucursalesByCiudad = async (req, res, next) =>{
  const {cod_postal} = req.params

  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
    const sucursales = await prisma.sucursales.findMany({
      where: {
        ciudad_cp: validateIDParam(cod_postal)
      },
      include: {
        tostaduria: true, //Se incluye la tostaduria en forma anidada
      },
      skip: startIndex,
      take: pageSize,
    })

    //Se elimina el id de la tostaduria de la respuesta (redundante)
    sucursales.forEach((sucursal) => {
      delete sucursal.tostaduria_id
      delete sucursal.ciudad_cp
    });
    sendResult(res, sucursales)

  } catch(error){
    next(error)
  }
}

const getSucursalesByTostaduria = async (req, res, next) =>{
  const tost_id = req.params.id

  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
    const sucursales = await prisma.sucursales.findMany({
      where: { tostaduria: { id: validateIDParam(tost_id) } },
      include: {
        ciudad: true, //Se incluye la ciudad en forma anidada
      },
      skip: startIndex,
      take: pageSize,
    })

    //Se elimina el cod_postal de la ciudad de la respuesta (redundante)
    sucursales.forEach((sucursal) => {
      delete sucursal.tostaduria_id
      delete sucursal.ciudad_cp
    });
    sendResult(res, sucursales)

  } catch(error){
    next(error)
  }
}


module.exports = {
  getSucursalesByCiudad,
  getSucursalesByTostaduria
}
