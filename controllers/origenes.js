const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')

const getAllOrigenes = async (req, res, next) => {
  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
      const origenes = await prisma.origenes.findMany({
        skip: startIndex,
        take: pageSize,
      })
      sendResult(res, origenes)
  } catch(error){
      next(error)
  }
}

const getOrigenByID = async (req, res, next) =>{
  const {id} = req.params
  const origen = await prisma.origenes.findMany({
    where: {
      id: Number(id)
    },
  })

  sendResult(res, origen)
}

module.exports = {
  getAllOrigenes,
  getOrigenByID
}