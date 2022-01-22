const express = require('express');
const auth = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const account = require('../models/accounts');

//ACCOUNT_REGISTER
auth.post('/register',async (req, res, next) => {
    const data = req.body;

    console.log('data', req.body)
   // console.log('data',req)
    // generate salt to hash password

 const salt = await bcrypt.genSalt(10);

 const password = await bcrypt.hash(req.body.user_password, salt);

   const dates=`${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`
    
    const user = {
        image:req.body.image,
        user_name: req.body.user_name,
        user_lastname:req.body.user_lastname,
        user_email: req.body.user_email,
        user_password:password,
        date:dates.slice(0,dates.length-3),
       
    }

 

    const newAccount = new account(user);
   
    const register = async () => {

        const email_find = await account.findOne({ user_email: data.user_email }).catch(() => {
            res.status(500).json({ erros: 'Oops something went wrong in saving your account please try again' })
        })
        console.log('email',email_find )
    
        if (email_find === null) {

            newAccount.save((error) => {
                if (error) {
                    res.status(500).json({ erros: 'Oops something went wrong in saving your account please try again' })
                }
                else {
                    account.findOne({ user_name: data.user_name, user_email: data.user_email }).then(account => {
              

                      

                        const token = jwt.sign({
                            user_email : account.user_email,
                       },"jwtPrivateKey",{expiresIn:"24h"})

                        const data_filter = {
                            _id: account._id,
                            image: account.image,
                            user_name: account.user_name,
                            user_lastname: account.user_lastname,
                            user_email: account.user_email,
                            date: account.date,
                            token:token,
                            __v: account.__v
                    
                    
                        }

                       res.status(200).json(data_filter)
                    }).catch(error => {
                        if (error) {
                            res.status(500).json({ error: 'Oops something went wrong in registration' })
                        }
                    })

            
                }
           
            });
     
        
        }
        else {
            res.status(500).json({ error: 'Oops email already in use' })
        }
    }
    register()

})

//ACCOUNT_LOGIN ROUTER
auth.post('/login',async (req, res) => {
    const payload = req.body
    console.log('log', req.body)
     account.findOne({user_email:payload.user_email}).then(login => {
      
         const scooper = async () => {
    
             const validPassword = await bcrypt.compare(payload.user_password, login.user_password)
       
             const token = jwt.sign({
                user_email: account.user_email,
            }, "jwtPrivateKey", { expiresIn: "24h" })

         
             const data_filter = {
                 _id: login._id,
                 image: login.image,
                 user_name: login.user_name,
                 user_lastname: login.user_lastname,
                 user_email: login.user_email,
                 date: login.date,
                 token: token,
                 __v: login.__v
             }

         
               
             if (login.user_email === payload.user_email && validPassword) {
    
            
            console.log('log22',data_filter)
                

              
        
                 res.status(200).json(data_filter)
             } else {
                 if (!validPassword) {
                     res.status(500).json({ error: 'invalid Password' })
                 } else {
                     res.status(500).json({ error: 'Oops account not found' })
                 }
             }
         }
         scooper()
        
    }).catch(error => {
        if (error) {
            res.status(500).json({error:'Oops something went wrong on Login'})
        }
    })


})






module.exports = auth
