//define express server, handlebars create function
const express = require('express')
const session = require('express-session')
const { create } = require('express-handlebars')
const routes = require('./routes')
const usePassport = require('./config/passport')
const methodOverride = require('method-override')

const flash = require('connect-flash')

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
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public')) //告訴express靜態檔案是放在名為 public 的資料夾中

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.use('/', routes)

//Listening to port
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}.`)
})