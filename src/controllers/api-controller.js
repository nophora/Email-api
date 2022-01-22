
const express = require('express');
const router = express.Router()
const fs = require('fs')
const path = require('path')
const bcrypt = require("bcrypt")
const multer = require('multer');
const inbox = require('../models/inbox')
const { admin, editor, viewer } = require('./middleware/roles')
const auth = require('./middleware/isauth')


const account = require('../models/accounts');

// Email Packages

const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')



//IMAGE STORAGE
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    
    });

//IMAGE FILTER
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);  
    }
}


//IMAGE UPLOAD 
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 },
    fileFilter: fileFilter,
})


//PHOTO ROUTER WITH MELTER
router.post('/photos', upload.single('file'), async (req, res, next) => {
    cloudinary.v2.uploader.upload(req.file.path, { tags: 'basic_sample' }, function (err, image) {
        if (err) { console.warn(err); }
        res.status(200).json({ path: `${image.url}` });
      });
})



//user register


//A usershould be able to "send an email" to one or more other emails

router.post('/sendemail',auth,(req, res) => {
    const payload = req.body
    console.log('body',req.body)
    let unsentmails = []
    let sentmails =[]
    let active=false
    
    for (let key in payload.to) {
     
        const exists = async () => {
            const find_inbox = await inbox.findOne({ user_email:payload.to[key] }).catch(next, () => {
                res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
            })

            const inbox_check = find_inbox.filter(e => e.user_email === payload.to[key])
       
            if (typeof inbox_check[0] === 'object') {
                active=true,
                        inbox.findOneAndUpdate({ user_email: payload.to[key] }, { inbox: [...inbox_check[0].inbox, ...[req.body]] }, { upsert: true }).then(() => {
                        setmails=[...sentmails,...[req.body]]
                    }).catch(next, () => { 
                        unsetmails=[...unsentmails,...[req.body]]
                        res.status(500).json({error:'Oops something went wrong please try again'})    
                })
                
            }
            else {     
            unsetmails=[...unsentmails,...[req.body]]
            }
        }
        exists()
 }

//loop brack
    
    if (active) {
        const actively = async () => {

            const user_inbox = await inbox.findOne({ user_email:payload.to[key] }).catch(next, () => {
                res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
            })

            const inbox_check = user_inbox.filter(e => e.user_email === payload.from )
       
            if (typeof inbox_check[0] === 'object') {
           
                inbox.findOneAndUpdate({ user_email: payload.from }, { sent: [...inbox_check[0].sent,...sentmails], unsent:[...inbox_check[0].unsent,...unsentmails] }, { upsert: true }).then(() => {
                    inbox.findOne({ user_email:payload.from }).then(obj => {
                        res.status(200).json(obj)  
                    }).catch(next, () => { 
                        res.status(500).json({erros:'Oops something went wrong'}) 
                   
                     })
                  
                }).catch(next, () => {
                    res.status(500).json({ error: 'Oops something went wrong please try again' })
                })
            }
     
        }
        actively()
    } {
        res.status(500).json({ error: 'Oops something went wrong please try again' })           
    }    
})

//A user should be able to delete emails in their inbox

router.post('/delete', (req, res) => {
    const payload = req.body

    const deleter= async () => {

        const delete_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = delete_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

            const inbox_delete = delete_inbox.inbox.filter(a => !new Set(payload.deleting).has(a._id) )
            const inbox_recover=delete_inbox.inbox.filter(e => payload.deleting.includes(e._id))
           
            inbox.findOneAndUpdate({ user_email: payload.user_email }, { inbox:inbox_delete,deleted_emails:[...delete_inbox.deleted_emails,...inbox_recover]}, { upsert: true }).then(() => {
               
                inbox.findOne({ user_email: payload.user_email}).then(obj => {
                    res.status(200).json(obj)  
                }).catch(next, () => { 
                    res.status(500).json({erros:'Oops something went wrong'}) 
               
                 })
           
            }).catch(next, () => {
               
                res.status(500).json({ error: 'Oops something went wrong please try again' })
            })

       

        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })   
        } 
        
    }

    deleter()

})

//recover
router.post('/recover', (req, res) => {
    const payload = req.body

    const recover = async () => {

        const recover_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = recover_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

            const inbox_recover=recover_inbox.deleted_emails.filter(e => payload.deleting.includes(e._id))
           
            inbox.findOneAndUpdate({ user_email: payload.user_email }, { inbox:[...recover_inbox.inbox,...inbox_recover]}, { upsert: true }).then(() => {
               
                inbox.findOne({ user_email: payload.user_email}).then(obj => {
                    res.status(200).json(obj)  
                }).catch(next, () => { 
                    res.status(500).json({erros:'Oops something went wrong'}) 
               
                 })
           
            }).catch(next, () => {
               
                res.status(500).json({ error: 'Oops something went wrong please try again' })
            })

       

        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })   
        } 
        
    }

    recover()

})



//label create
router.post('/label', (req, res) => {
    const payload = req.body

    const label = async () => {

        const label_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = label_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

            const inbox_label = label_inbox.inbox.filter(e => e.subject.toLowerCase().includes(payload.label.toLowerCase())).forEach(element => {
                return element.label = { text:payload.label, color:payload.color}
            });
        
            const not_label = label_inbox.inbox.filter(e => !e.subject.toLowerCase().includes(payload.label.toLowerCase())).

            inbox.findOneAndUpdate({ user_email: payload.user_email }, { inbox:[...not_label,...inbox_label],labels:[...label_inbox.labels,...[payload.label]]}, { upsert: true }).then(() => {
               
                inbox.findOne({ user_email: payload.user_email}).then(obj => {
                    res.status(200).json(obj)  
                }).catch(next, () => { 
                    res.status(500).json({erros:'Oops something went wrong'}) 
               
                 })
           
            }).catch(next, () => {
               
                res.status(500).json({ error: 'Oops something went wrong please try again' })
            })

       

        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })   
        } 
        
    }

    label()

})



//label create specific
router.post('/label', (req, res) => {
    const payload = req.body

    const label = async () => {

        const label_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = label_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

            const inbox_label = label_inbox.inbox.filter(e => e.subject.toLowerCase().includes(payload.label.toLowerCase())).forEach(element => {
                return element.label = { text:payload.label, color:payload.color}
            });
        
            const not_label = label_inbox.inbox.filter(e => !e.subject.toLowerCase().includes(payload.label.toLowerCase())).

            inbox.findOneAndUpdate({ user_email: payload.user_email }, { inbox:[...not_label,...inbox_label]}, { upsert: true }).then(() => {
               
                inbox.findOne({ user_email: payload.user_email}).then(obj => {
                    res.status(200).json(obj)  
                }).catch(next, () => { 
                    res.status(500).json({erros:'Oops something went wrong'}) 
               
                 })
           
            }).catch(next, () => {
               
                res.status(500).json({ error: 'Oops something went wrong please try again' })
            })

       

        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })   
        } 
        
    }

    label()

})



//label delete
router.post('/deletelabel', (req, res) => {
    const payload = req.body

    const label = async () => {

        const label_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = label_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

            const inbox_label = label_inbox.inbox.filter(e => e.label.text === payload.label ).forEach(element => {
                return element.label = { text:'none', color:'none'}
            });
        
           const not_selected = label_inbox.inbox.filter(e => e.label.text !== payload.label )


           const remove_label = label_inbox.label.filter(e => e !== payload.label )

            
           inbox.findOneAndUpdate({ user_email: payload.user_email }, { inbox:[...not_selected,...inbox_label],labels:remove_label}, { upsert: true }).then(() => {
               
                inbox.findOne({ user_email: payload.user_email}).then(obj => {
                    res.status(200).json(obj)  
                }).catch(next, () => { 
                    res.status(500).json({erros:'Oops something went wrong'}) 
               
                 })
           
            }).catch(next, () => {
               
                res.status(500).json({ error: 'Oops something went wrong please try again' })
            })

       

        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })   
        } 
        
    }

    label()

})


//api-request-inbox
router.post('/inboxs', (req, res) => {
    const payload = req.body

    const label = async () => {

        const label_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = label_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

             res.status(200).json(label_inbox.inbox)  
          
        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })    
        }
    }

    label()

})


//api-request-sent
router.post('/sent', (req, res) => {
    const payload = req.body

    const label = async () => {

        const label_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = label_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

             res.status(200).json(label_inbox.sent)  
          
        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })    
        }
    }

    label()

})

//api-request-unsent
router.post('/unsent', (req, res) => {
    const payload = req.body

    const label = async () => {

        const label_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = label_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

             res.status(200).json(label_inbox.unsent)  
          
        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })    
        }
    }

    label()

})

//api-request-specific-label
router.post('/specificlabel', (req, res) => {
    const payload = req.body

    const label = async () => {

        const label_inbox = await inbox.findOne({ user_email:payload.user_email }).catch(next, () => {
            res.status(500).json({ error: `Oops something went wrong in sending email to ${payload.to[key]}` })
        })

        const inbox_check = label_inbox.filter(e => e.user_email === payload.user_email )
   
        if (typeof inbox_check[0] === 'object') {

            const inbox_label = label_inbox.inbox.filter(e => e.label.text === payload.label)
            res.status(200).json(inbox_label)  
          
        } else {
            res.status(500).json({ error: 'Oops something went wrong please try again' })    
        }
    }

    label()

})








const arry = [
    { t: 1, v: 'ysiphovjk' },
    { t: 2, v: 'ehello' },
    { t: 3, v: 'kgfSiphomj' },
    { t: 4, v: 'kelory' },
    { t: 5, v: 'simpher' },
    { t: 6, v: 'lolker' },
    { t: 7, v: 'xovi' },]
const newa=[6,5,1]



 //arry.forEach(e=>{return e.v="nhapho"})


 console.log('kolo',arry.filter(e => !e.v.toLowerCase().includes('sipho'.toLowerCase())))

//remove from array
console.log('split',arry.filter(a => !new Set(newa).has(a.t)));
//filter from array
console.log('ttt', arry.filter(e => newa.includes(e.t) ))


module.exports = router;
