if(process.env.NODE_ENV !== 'production'){ //check if in production environment
    require('dotenv').config() //load all dependencies from .env file and import then into thid file
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path'); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to MongoDB"))

const routes = require('./routes/index');
routes(app); // 

app.listen(process.env.PORT || 3000);