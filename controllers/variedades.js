const express = require('express')
const createError = require('http-errors')

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const sendResult = require('../utils/response/resultsSender')
const paginationHelper = require('../utils/query/paginationHelper')

const includes = {
  include: {
    tostaduria: true,
    tipo: true,
    origenes: {
      include: {
        origen:true
      }
    }
  }
}

function formatVariedadesResult(variedades){
  removeDuplicatedRelationshipInfo(variedades)
  return mapOrigenes(variedades)
}

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

/**
Elimina la información duplicada del id de la tostaduria y el tipo ligados
Ya se incluyen esas entidades en forma anidada
**/
function removeDuplicatedRelationshipInfo(variedades){
  variedades.forEach((variedad) => {
    delete variedad.tipo_id
    delete variedad.tostaduria_id
  });
}

// Funciones auxiliares para los queries a la DB según query

function getSearchStringPrismaQuery(searchString){
  return searchString ? {
    OR: [
      { nombre: { contains: searchString, mode: 'insensitive' } },
      { descripcion: { contains: searchString, mode: 'insensitive' } },
    ]
  } : {}
}

function filterByOrigenPrismaQuery(origen_id){
  return origen_id ? {
    origenes: {
      some: {
        origen_id: Number(origen_id)
      }
    }
  } : {}
}

function filterByTostaduriaPrismaQuery(tostaduria_id){
  return tostaduria_id ? {
    tostaduria: {
      id: Number(tostaduria_id)
    }
  } : {}
}

function filterByTipoPrismaQuery(tipo_id){
  return tipo_id ? {
    tipo: {
      is: {
        id: Number(tipo_id)
      }
    }
  } : {}
}

const getAllVariedades = async (req, res, next) => {

  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  const {searchString, origen, tostaduria, tipo} = req.query

  const searchStringPrismaQuery = getSearchStringPrismaQuery(searchString)
  const origenPrismaQuery = filterByOrigenPrismaQuery(origen)
  const tostaduriaPrismaQuery = filterByTostaduriaPrismaQuery(tostaduria)
  const tipoPrismaQuery = filterByTipoPrismaQuery(tipo)

  try{
      const variedades = await prisma.variedades.findMany({
        where:{
          ...searchStringPrismaQuery,
          ...origenPrismaQuery,
          ...tostaduriaPrismaQuery,
          ...tipoPrismaQuery,
        },
        ...includes,
        skip: startIndex,
        take: pageSize,
      })

      result = formatVariedadesResult(variedades)
      sendResult(res, result)

  } catch(error){
      next(error)
  }
}

const getVariedadByID = async (req, res, next) =>{
  const {id} = req.params.id
  const variedad = await prisma.variedades.findMany({
    where: {
      id: id
    },
    ...includes
  })

  result = formatVariedadesResult(variedad)
  sendResult(res, result)

}

const getVariedadesByTostaduria = async (req, res, next) =>{
  const tost_id = req.params.id

  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  const {searchString, origen, tipo} = req.query

  const searchStringPrismaQuery = getSearchStringPrismaQuery(searchString)
  const origenPrismaQuery = filterByOrigenPrismaQuery(origen)
  const tipoPrismaQuery = filterByTipoPrismaQuery(tipo)

  try{
    const variedades = await prisma.variedades.findMany({
      where: {
        tostaduria: {
          id: Number(tost_id)
        },
        ...searchStringPrismaQuery,
        ...origenPrismaQuery,
        ...tipoPrismaQuery
      },
      ...includes,
      skip: startIndex,
      take: pageSize,
    })


    result = formatVariedadesResult(variedades)
    sendResult(res, result)

  } catch(error){
    next(error)
  }
}

const getVariedadesByOrigen = async (req, res, next) =>{
  const origen_id = req.params.id

  const pageSize = paginationHelper.getPageSize(req, next)
  const startIndex = paginationHelper.getStartIndex(req, next)

  const {searchString, tostaduria, tipo} = req.query

  const searchStringPrismaQuery = getSearchStringPrismaQuery(searchString)
  const tostaduriaPrismaQuery = filterByTostaduriaPrismaQuery(tostaduria)
  const tipoPrismaQuery = filterByTipoPrismaQuery(tipo)

  try{
    const variedades = await prisma.variedades.findMany({
      where: {
        origenes: {
          some: {
            origen_id: Number(origen_id)
          }
        },
        ...searchStringPrismaQuery,
        ...tostaduriaPrismaQuery,
        ...tipoPrismaQuery
      },
      ...includes,
      skip: startIndex,
      take: pageSize,
    })

    const result = formatVariedadesResult(variedades)
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
