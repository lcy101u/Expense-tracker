//define express server, handlebars create function
const express = require('express')
const { create } = require('express-handlebars')

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT
const app = express()

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

//Listening to port
app.listen(PORT, () => {
  console.log(`Listening to ${PORT}.`)
})