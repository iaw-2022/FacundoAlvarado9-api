const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')

const getAllVariedades = async (req, res, next) => {
  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
      const variedades = await prisma.variedades.findMany({
        skip: startIndex,
        take: pageSize,
      })
      sendResult(res, variedades)
  } catch(error){
      next(error)
  }
}

const getVariedadByID = async (req, res, next) =>{
  const {id} = req.params
  const variedad = await prisma.variedades.findMany({
    where: {
      id: Number(id)
    },
  })

  sendResult(res, variedad)
}


module.exports = {
  getAllVariedades,
  getVariedadByID
}
