const express = require('express')
const app = express()
const PORT = 8080

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient()

app.listen(
    PORT,
    () => {
        console.log('Escuchando en puerto 8080')
    })

app.get('/', (req, res)=>{
    res.send("Primera prueba para la api.")
})

app.use((req, res, next) => {
    const error = new Error('No encontrado')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) =>{
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

BigInt.prototype.toJSON = function() {
    return this.toString()
  }
