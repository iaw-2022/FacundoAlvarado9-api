const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')
const validateIDParam = require('../utils/validateIDParam')

function getSearchStringPrismaQuery(searchString){
  return searchString ? {
    OR: [
      { nombre: { contains: searchString, mode: 'insensitive' } },
    ]
  } : {}
}

const getAllTostadurias = async (req, res, next) => {
  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  const searchString = req.query.searchString

  try{
      const tostadurias = await prisma.tostadurias.findMany({
        where: {
          ...getSearchStringPrismaQuery(searchString),
        },
        skip: startIndex,
        take: pageSize,
      })
      sendResult(res, tostadurias)
  } catch(error){
      next(error)
  }
}

const getTostaduriaByID = async (req, res, next) =>{
  const {id} = req.params

  try{
    const tostaduria = await prisma.tostadurias.findMany({
      where: {
        id: validateIDParam(id)
      },
    })

    sendResult(res, tostaduria)
  } catch(error){
    next(error)
  }

}


module.exports = {
  getAllTostadurias,
  getTostaduriaByID
}
