const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const authJwt = require('./helpers/jwt')
require('dotenv/config')

//routers
const categoriesRoutes = require('./routers/categories')
const productsRoutes = require('./routers/products')
const usersRoutes = require('./routers/users')
const ordersRoutes = require('./routers/orders')


//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.options('*', cors())
app.use(authJwt)

const api = process.env.API_URL 

app.use(`${api}/categories`, categoriesRoutes)
app.use(`${api}/products`, productsRoutes)
app.use(`${api}/users`, usersRoutes)
app.use(`${api}/orders`, ordersRoutes)

//mongoose connection
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err)
})

//connection to server
app.listen(3000, ()=> {
    console.log('server is running http://localhost:3000')
})