const express = require('express')
const exphbs  = require('express-handlebars')
const app = express()
const port = 3000
const path = require('path')
const multer = require('multer')
const upload = multer()
const cookieParser = require('cookie-parser')
const cors = require('cors')

const corsOptions = {
  origin: '*',
  credentials: true
}

require('dotenv').config()

app.use(upload.none())
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors(corsOptions))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, 'views'))

const email = process.env.email
const password = process.env.password

app.get('/', function (req, res) {
  res.render('login')
})

app.post('/login', function (req, res) {
  const body = req.body
  if (body.password === password && body.email === email) {
    res.cookie('email', email)
    res.redirect('/form')
  }
})

app.get('/form', function (req, res) {
  if (!req.cookies.email) {
    res.sendStatus(403)
    return
  }
  res.render('form', { who: req.cookies.email })
})

app.post('/send', function (req, res) {
  if (!req.cookies.email) {
    res.sendStatus(403)
    return
  }

  const body = req.body
  res.render('response', { user: req.cookies.email, to: body.recepient, amount: body.amount })
})

app.listen(port, () => console.log(`listening at http://localhost:${port}`))