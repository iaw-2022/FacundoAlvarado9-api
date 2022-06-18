const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient()

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')

const getAllTipos = async (req, res, next) => {
  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)  

  try{
      const totalCount = await prisma.tipos.count()
      const ciudades = await prisma.tipos.findMany({
        skip: startIndex,
        take: pageSize,
      })
      sendResult(res, ciudades, totalCount)
  } catch(error){
      next(error)
  }
}


module.exports = {
  getAllTipos
}
