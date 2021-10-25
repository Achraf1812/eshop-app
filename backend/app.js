const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
<<<<<<< HEAD
require('dotenv/config')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/errorHandler')


app.use(cors())
app.options('*', cors())


//middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(authJwt)
app.use(errorHandler)
=======
require('dotenv/config');
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-Handler')



app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
>>>>>>> 0cc44acf1c92c631aa7ce79195cabc3d35bcd27c

//routers
const categoriesRoutes = require('./routers/categories')
const productsRoutes = require('./routers/products')
const usersRoutes = require('./routers/users')
const ordersRoutes = require('./routers/orders')

<<<<<<< HEAD

=======
>>>>>>> 0cc44acf1c92c631aa7ce79195cabc3d35bcd27c
const api = process.env.API_URL 

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


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