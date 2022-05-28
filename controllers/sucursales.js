const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')


const getSucursalesByCiudad = async (req, res, next) =>{
  const {cod_postal} = req.params

  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
    const sucursales = await prisma.sucursales.findMany({
      where: {
        ciudad_cp: Number(cod_postal)
      },
      include: {
        tostaduria: true,
      },
      skip: startIndex,
      take: pageSize,
    })

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
      where: { tostaduria: { id: Number(tost_id) } },
      include: {
        ciudad: true,
      },
      skip: startIndex,
      take: pageSize,
    })

    sendResult(res, sucursales)

  } catch(error){
    next(error)
  }
}


module.exports = {
  getSucursalesByCiudad,
  getSucursalesByTostaduria
}
