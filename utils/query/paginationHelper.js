const express = require('express')

const PAGE_SIZE_DEFAULT = 5
const START_INDEX_DEFAULT = 0

function getPageSize(req, next){
  return Number(req.query.pageSize) || PAGE_SIZE_DEFAULT
}

function getStartIndex(req, next){
  return Number(req.query.startIndex) || START_INDEX_DEFAULT
}

module.exports = {
  getPageSize,
  getStartIndex
}
