const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')


/**
  Los queries de Prisma para relaciones many-to-many (en este caso variedad-origenes)
  incluyen información de la relación en sí (ids relacionados, etc), que "ensuciarían"
  la respuesta JSON. Con esta función se mapea a una representación más elegante.
**/
function mapOrigenes(variedades) {
   const result = variedades.map((variedad) => {
    return { ...variedad, origenes: variedad.origenes.map((origen) => origen.origen)}
  })
  return result
}

const getAllVariedades = async (req, res, next) => {
  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
      const variedades = await prisma.variedades.findMany({
        include: {
          tipo: true,
          origenes: {
            include: {
              origen:true
            }
          }
        },
        skip: startIndex,
        take: pageSize,
      })

      result = mapOrigenes(variedades)
      sendResult(res, result)

  } catch(error){
      next(error)
  }
}

const getVariedadByID = async (req, res, next) =>{
  const {id} = req.params.id
  const variedad = await prisma.variedades.findMany({
    where: {
      id: Number(id)
    },
    include: {
      tipo: true,
      origenes: {
        include: {
          origen:true
        }
      }
    }
  })

  result = mapOrigenes(variedad)
  sendResult(res, result)

}

const getVariedadesByTostaduria = async (req, res, next) =>{
  const tost_id = req.params.id

  const nombre = req.query.nombre || ""
  
  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
    const variedades = await prisma.variedades.findMany({
      where: {
        tostaduria: {
          id: Number(tost_id)
        },
        nombre: {
          startsWith: String(nombre),
          mode: 'insensitive'
        },
      },
      include: {
        tipo: true,
        origenes: {
          include: {
            origen:true
          }
        }
      },
      skip: startIndex,
      take: pageSize,
    })


    result = mapOrigenes(variedades)
    sendResult(res, result)

  } catch(error){
    next(error)
  }
}

const getVariedadesByOrigen = async (req, res, next) =>{
  const origen_id = req.params.id

  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  try{
    const variedades = await prisma.variedades.findMany({
      where: { origenes: { some: { id: Number(origen_id) } } },
      include: {
        tipo: true,
        origenes: {
          include: {
            origen:true
          }
        }
      },
      skip: startIndex,
      take: pageSize,
    })

    const result = mapOrigenes(variedades)
    sendResult(res, result)

  } catch(error){
    next(error)
  }
}


module.exports = {
  getAllVariedades,
  getVariedadByID,
  getVariedadesByTostaduria,
  getVariedadesByOrigen
}
