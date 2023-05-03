const express = require('express');
const expressLayouuts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const connectDB = require('./server/db/connect');
const cuisineRoutes = require('./server/routes/cuisineRoutes');
require('dotenv').config();

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(methodOverride('_method'));

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.use(fileUpload());

//test
app.get('/',(req, res) =>{
    res.send('Cuisine Blog API');
})

//Setting Templet
app.use(expressLayouuts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// routes
app.use('/api/v1/blog', cuisineRoutes);

//Connecting to the database 
const port = process.env.PORT || 5080;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`) 
        })
    } catch(err){
        console.log(err);
    }
}
start();
