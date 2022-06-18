const express = require('express')

function validateIDParam(param){
  let num_param = Number(param)

  if( (param == undefined) || ((!isNaN(num_param)) && (num_param >= 0)) ){
    return num_param
  } else{
    const error = new Error('Algún parámetro es inválido')
    error.status = 400
    throw error
  }
}

module.exports = validateIDParam
