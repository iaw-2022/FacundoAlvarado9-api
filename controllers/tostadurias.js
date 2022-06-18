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
      const dbQuery = {
        where: {
          ...getSearchStringPrismaQuery(searchString)
        }
      }

      const totalCount = await prisma.tostadurias.count(dbQuery)
      const tostadurias = await prisma.tostadurias.findMany({
        ...dbQuery,
        skip: startIndex,
        take: pageSize,
      })
      sendResult(res, tostadurias, totalCount)
  } catch(error){
      next(error)
  }
}

const getTostaduriaByID = async (req, res, next) =>{
  const {id} = req.params  

  try{
    const dbQuery = {
      where: {
        id: validateIDParam(id)
      }
    }

    const totalCount = await prisma.tostadurias.count(dbQuery)
    const tostaduria = await prisma.tostadurias.findMany(dbQuery)

    sendResult(res, tostaduria, totalCount)
  } catch(error){
    next(error)
  }

}


module.exports = {
  getAllTostadurias,
  getTostaduriaByID
}
