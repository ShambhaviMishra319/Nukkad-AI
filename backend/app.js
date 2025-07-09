const express=require('express')
const app=express()

require('dotenv').config()

app.use(express.json())

const salesRoutes=require('./routes/sales')
app.use('/sales',salesRoutes)

module.exports=app