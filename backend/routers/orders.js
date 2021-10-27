const {Order} = require('../models/order')
const express = require('express')
const { OrderItem } = require('../models/order-item');
const router = express.Router()

//Get
router.get(`/`, async (req, res) =>{
    //get all producted ordered by date of creation and with their user name
    const orderList = await Order.find()
    .populate('user','name')
    .sort({'dateOrdered': -1})
    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList)
})

//Get a specific order
router.get(`/:id`, async (req, res) =>{
    //get a specific order with informations of its user and  the products and categories
    const order = await Order.findById(req.params.id)
    .populate('user','name')
    .populate({
        path:'orderItems', populate:{
            path : 'product' , populate:'category'}
        })
    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order)
})

//Post
router.post('/', async (req,res)=>{
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved =  await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

    res.send(order);
})

//Update
router.put('/:id', async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id, 
        {
            status : req.body.status   

        },
        {new : true}//retun the new Update data
    )


    if(!order){
    return res.status(404).send('the order cannot be updated!')
        }  
    res.send(order)
})

//Delete the order and the order items as well 
router.delete('/:id', (req, res)=> {
    Order.findByIdAndRemove(req.params.id).then(async order =>{
       if(order){
           await order.orderItems.map(async orderItem => {
               await OrderItem.findByIdAndRemove(orderItem)
           })
           return res.status(200).json({success : true, message : "the order is deleted succesfly !"})
       }else {
           return res.status(404).json({success:false, message : 'order not found!'})
       }
    }).catch(err=>{
        return res.status(400).json({success: false, error : err})
    })
 
 })  

//Total Sales
 router.get('/get/totalsales', async (req, res)=> {
     const totalSales= await Order.aggregate([
         { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
     ])

     if(!totalSales) {
         return res.status(400).send("the order sales cannot be generated")
     }
     return res.send({totalsales : totalSales.pop().totalsales})
 })

//Count 
router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments()
    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
})
module.exports =router