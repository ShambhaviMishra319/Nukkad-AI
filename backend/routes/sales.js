const express=require('express')
const router=express.Router()

const salesController=require('../controllers/salesController')
router.post('/log',salesController.logSale)

module.exports=router