

let testAccount = await nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
  //  service: 'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  
     
})



const template=  transporter.use('compile', hbs({
    viewEngine: {
        extname: ".hbs",
        partialsDir: path.resolve(__dirname, "views"),
        defaultLayout: false
      },
      viewPath: path.resolve(__dirname, "views"),
      extname: ".hbs"
}))


const mailOptons =()=> {
    let mail = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Cloudfoud Rest-Api',
        text: 'You QR CODE Adress was successfully made, now you can enjoy unlimited pull-request',
        template: 'index'
    }

    return mail
}


router.post('/accountpost', (req, res, next) => {
    const data = req.body;

  

    transporter.sendMail(mailOptons, (err, data,mail_sent) => {
        if (err) {
             res.status(500).json({
              erros:'Ooops something went wrong on Mail'
              })
        } else {
            res.status(200).json(mail_sent) 
           }
    })



})
