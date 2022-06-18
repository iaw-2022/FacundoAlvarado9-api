const express = require('express')

function sendResult(res, obj, totalCount){
  res.status(200).json({
    count: obj.length,
    totalCount: totalCount,
    results: obj
  })
}

module.exports = sendResult
