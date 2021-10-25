const {User} = require('../models/user')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

//Get all users
router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash')

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList)
})
//GetbyID
router.get(`/:id`, async (req, res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash')
    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found '})
    }
    res.status(200).send(user)

})  

//Post
router.post('/', async (req, res)=> {
    let user = new User ({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin : req.body.isAdmin,
        apartement : req.body.apartement,
        street: req.body.street,
        zip : req.body.zip,
        city : req.body.city,
        country : req.body.country
    })
    user = await user.save()
    if(!user){
    return res.status(404).send('the user cannot be created!')
    }  
    res.send(user)
})

//LogIn 
router.post('/login', async (req, res) => {
    const secret = process.env.secret
  const user = await User.findOne({email : req.body.email})
  if(!user){
      return res.status(400).send('the user not found!')
  }

  if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
      {
            userId: user.id,
            isAdmin : user.isAdmin
      },
      secret,
      {expiresIn : '1d'}
      )
     return res.status(200).send({user: user.email, token: token})
  }else { 
    return res.status(404).send('the password you enter is wrong!')
  }
})

//Register
router.post('/register', async (req, res) => {
    let user = new User ({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin : req.body.isAdmin,
        apartement : req.body.apartement,
        street: req.body.street,
        zip : req.body.zip,
        city : req.body.city,
        country : req.body.country
    })
    user = await user.save()
    if(!user){
    return res.status(404).send('the user cannot be created!')
    }  
    res.send(user)
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

 

//Post
router.post('/', async (req, res)=> {
    let user = new User ({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin : req.body.isAdmin,
        apartement : req.body.apartement,
        street: req.body.street,
        zip : req.body.zip,
        city : req.body.city,
        country : req.body.country
    })
    user = await user.save()
    if(!user){
    return res.status(404).send('the user cannot be created!')
    }  
    res.send(user)
})

//LogIn 
router.post('/login', async (req, res) => {
    const secret = process.env.secret
  const user = await User.findOne({email : req.body.email})
  if(!user){
      return res.status(400).send('the user not found!')
  }

  if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
      {
            userId: user.id,
            isAdmin : user.isAdmin
      },
      secret,
      {expiresIn : '1d'}
      )
     return res.status(200).send({user: user.email, token: token})
  }else { 
    return res.status(404).send('the password you enter is wrong!')
  }
})

//Register
router.post('/register', async (req, res)=> {
    let user = new User ({
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin : req.body.isAdmin,
        apartement : req.body.apartement,
        street: req.body.street,
        zip : req.body.zip,
        city : req.body.city,
        country : req.body.country
    })
    user = await user.save()
    if(!user){
    return res.status(404).send('the user cannot be created!')
    }  
    res.send(user)
})

//Count 
router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments()
    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})
module.exports = router