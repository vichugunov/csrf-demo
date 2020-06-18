const express = require('express')
const exphbs  = require('express-handlebars')
const app = express()
const port = 4000
const path = require('path')

app.use(express.static('public'))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, 'views'))

app.get('/', function (req, res) {
  res.render('form')
})

app.listen(port, () => console.log(`listening at http://localhost:${port}`))