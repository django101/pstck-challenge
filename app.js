'use strict';

//require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const toastr = require('toastr');
const cors = require('cors');
const jQuery = require('jquery');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');

const app = express();

const port = process.env.PORT || 5000;


const { getHomePage } = require('./routes/index');
const { getSuppliersListPage, addSupplierPage, editSupplierPage, addSupplier, editSupplier, deleteSupplier, restoreSupplier } = require('./routes/supplierslist');
const { getstocklistPage, addstockPage, editstockPage, addstock, editstock } = require('./routes/stocklist');
const { getSuppliersAccountsListPage, addSupplierAccountPage, addSupplierAccount } = require('./routes/suppliersaccounts');

const { getSignInPage, signout, signin } = require('./routes/userauthentication');

const { paystackWebhookEvents } = require('./routes/paystackEvents');


// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});



// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;



// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.use(cors());
app.options('*', cors());
app.use(requestIp.mw());




var sessionChecker = (req, res, next) => {
    if (req.cookies && req.cookies["bakery_user_sid"]) {
        process.env.DISPLAYNAME = req.cookies['bakery_user_sname'];
        next();
    } else {
        process.env.DISPLAYNAME = '';
        res.redirect('/signout');
    }    
};




// routes for the app
app.get('/', sessionChecker, getHomePage);

app.get('/supplierslist', sessionChecker, getSuppliersListPage);
app.get('/supplierinfo/', sessionChecker, addSupplierPage);
app.get('/supplierinfo/:id', sessionChecker, editSupplierPage);
app.post('/supplierinfo', sessionChecker, addSupplier);
app.post('/supplierinfo/:id', sessionChecker, editSupplier);
app.get('/supplierdelete/:id', sessionChecker, deleteSupplier);
app.get('/supplierrestore/:id', sessionChecker, restoreSupplier);

app.get('/stocklist', sessionChecker, getstocklistPage);
app.get('/stockinfo', sessionChecker, addstockPage);
app.get('/stockinfo/:id', sessionChecker, editstockPage);
app.post('/stockinfo', sessionChecker, addstock);
app.post('/stockinfo/:id', sessionChecker, editstock);

app.get('/suppliersaccountslist/:id', sessionChecker, getSuppliersAccountsListPage);
app.get('/suppliersaccountinfo/:id', sessionChecker, addSupplierAccountPage);
app.post('/suppliersaccountinfo/:id', sessionChecker, addSupplierAccount);

app.get('/signin', getSignInPage);
app.get('/signout', signout);
app.post('/signin', signin);


app.post('/eventhandler', paystackWebhookEvents);





var j = schedule.scheduleJob('*/1 * * * *', function(){
    console.log('Application Keep-Alive Ping');
  });



// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});


// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
