const express = require('express');
//const morgan = require('morgan');
const router = require('./src/controllers/api-controller');
const auth = require('./src/controllers/auth');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')

const cookieParser = require('cookie-parser')



const PORT = process.env.PORT || 8080;
const app = express();



mongoose.connect(MONGODB_URL|| 'mongodb://localhost/platformmovies', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   // useFindAndModify: false,
}

    , (error) => {
        if (error) {

            console.log('error!!!',error)
        }
        else
        console.log('new dater running!!!')
    }

);

mongoose.connection.on('connected', () => {
    console.log('folder mongo connected!!!')
});


// need cookieParser middleware before we can do anything with cookies
app.use(cookieParser());

// set a cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');
  } else {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  next(); // <-- important!
});



app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))



//app.use(morgan('tiny'));
app.use(cors());
app.use('/email', router,auth);

app.use(express.static(__dirname + "/client/build"))

if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
   
}





app.listen(PORT, console.log(`cloudfound server runig on PORT${PORT} `));
