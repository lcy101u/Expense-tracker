//define express server, handlebars create function
const express = require('express')
const { create } = require('express-handlebars')
const routes = require('./routes')
const usePassport = require('./config/passport')
const session = require('express-session')

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT
const app = express()
require('./config/mongoose')

//define an object which stores handlebars' settings
const handlebarsSettings = {
  defaultLayout: 'main',
  extname: 'hbs'
}
//create a handlebars instance
const handlebars = create(handlebarsSettings)

//set view engine to handlebars engine
app.engine('hbs', handlebars.engine)
app.set('view engine', 'hbs')

//set view path 
app.set('views', './views');

//use body parser for POST message
app.use(express.urlencoded({extended: true}))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use('/', routes)

//Listening to port
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}.`)
})