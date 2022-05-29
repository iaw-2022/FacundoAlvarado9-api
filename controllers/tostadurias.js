const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')

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
  const searchStringPrismaQuery = getSearchStringPrismaQuery(searchString)

  try{
      const tostadurias = await prisma.tostadurias.findMany({
        where: {
          ...searchStringPrismaQuery,          
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
  const tostaduria = await prisma.tostadurias.findMany({
    where: {
      id: Number(id)
    },
  })

  sendResult(res, tostaduria)
}


module.exports = {
  getAllTostadurias,
  getTostaduriaByID
}
