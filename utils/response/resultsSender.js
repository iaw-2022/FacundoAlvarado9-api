const express = require('express')

function sendResult(res, obj){
  console.log(obj)
  res.status(200).json({
    count: obj.length,
    results: obj
  })
}

module.exports = sendResult
