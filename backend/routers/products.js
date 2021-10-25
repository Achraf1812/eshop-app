const {Product} = require('../models/product')
const express = require('express')
const { Category } = require('../models/category')
const router = express.Router()
const mongoose = require('mongoose')

//Get all the products and specifc products by their categories
router.get(`/`, async (req,res) =>{
    let filter = {};
    if(req.query.categories)
    {
         filter = {category: req.query.categories.split(',')}
    }

    const productList = await Product.find(filter).populate('category')

    if(!productList){
        res.status(500).json({success: false})
    }
    res.send(productList)
})

//Get specific product
router.get(`/:id`, async (req,res) =>{
    const product = await Product.findById(req.params.id).populate('category')

    if(!product){
        res.status(500).json({success: false})
    }
    res.send(product)
})


//Post product
router.post(`/`, async (req,res) =>{
    const category = await Category.findById(req.body.category)
    if(!category) {
        res.status(400).send('the catrgory that u selected is not exist!')
    }
    
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    
    product = await product.save()

    if(!product) {
    return res.status(500).send('cannot create the product!')
    }

    res.send(product)
})

//Update product
router.put('/:id', async (req, res)=> {
    if(!mongoose.isValidObjectId(req.params.id)){ //check 1 the id if it's right then update 
        return res.status(400).send('Invalid product id!')
    }
    const category = await Category.findById(req.body.category)
    if(!category) {
        res.status(400).send('the catrgory that u selected is not exist!')
    }
    const product = await Category.findByIdAndUpdate(req.params.id, 
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,

      },
      {new : true}//retun the new Update data
    )


    if(!product){
    return res.status(404).send('the product cannot be updated!')
        }  
    res.send(product)
})


//Delete
router.delete('/:id',  (req, res)=> {
   Product.findByIdAndRemove(req.params.id).then(product =>{
      if(product){
          return res.status(200).json({success : true, message : "the product is deleted succesfly !"})
      }else {
          return res.status(404).json({success:false, message : 'product not found!'})
      }
   }).catch(err=>{
       return res.status(400).json({success: false, error : err})
   })

})  


//Count 
router.get(`/get/count`, async (req, res) =>{
    const productCount = await Product.countDocuments((count) => count )
    if(!productCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        productCount: productCount
    });
})


//Count featured products by count 
router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    const product = await Product.find({isFeatured: true}).limit(+count)

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send(product);
})


module.exports = router