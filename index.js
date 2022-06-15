const express = require('express')
const app = express()
const PORT = 8080

const { PrismaClient } =  require('@prisma/client')
const prisma = new PrismaClient()

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger/swagger.yaml'); //Locación del documento swagger

const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // Ventana: 10 minutos
	max: 600, // Máximo de 600 requests por cada 10 minutos por ventana de tiempo
	standardHeaders: true,
	legacyHeaders: false,
})

const ciudadesRoute = require('./routes/ciudades')
const variedadesRoute = require('./routes/variedades')
const tostaduriasRoute = require('./routes/tostadurias')
const origenesRoute = require('./routes/origenes')

app.use(limiter)

app.use('/ciudades', ciudadesRoute)
app.use('/variedades', variedadesRoute)
app.use('/tostadurias', tostaduriasRoute)
app.use('/origenes', origenesRoute)


app.listen(
    process.env.PORT || PORT,
    () => {
        console.log('Escuchando en puerto ' + (process.env.PORT || PORT) + ' 🚀')
    })

app.get('/', (req, res)=>{
    res.redirect('/api-docs')
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Ante una request ajena a las rutas reconocidas, se devuelve un 404
app.use((req, res, next) => {
    const error = new Error('No encontrado')
    error.status = 404
    next(error)
})

//Ante otros errores no contemplados, se devuelve un 500
app.use((error, req, res, next) =>{
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

//Necesaria para el manejo de BigInts (tipo de los IDs de los objetos)
BigInt.prototype.toJSON = function() {
     return Number(this)
}
