const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient()

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')

const getAllCiudades = async (req, res, next) => {
  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
      const ciudades = await prisma.ciudades.findMany({
        skip: startIndex,
        take: pageSize,
      })
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
