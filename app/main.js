const express = require('express')
const exphbs  = require('express-handlebars')
const app = express()
const port = 3000
const path = require('path')
const multer = require('multer')
const upload = multer()
const cookieParser = require('cookie-parser')
const cors = require('cors')
const csrf = require('csurf')
const session = require('express-session')
const https = require('https')
const fs = require('fs')

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}

require('dotenv').config()

app.use(upload.none())
app.use(express.static('public'))
app.use(cookieParser())
app.use(session({ secret: 'bier', cookie: { maxAge: 60000 }}))
app.use(cors(corsOptions))
app.use(csrf({ sameSite: 'strict' }))

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.render('csrfError')
})


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, 'views'))

const email = process.env.email
const password = process.env.password

app.get('/', function (req, res) {
  res.render('login', {  csrfToken: req.csrfToken() })
})

app.post('/login', function (req, res) {
  const body = req.body
  if (body.password === password && body.email === email) {
    res.cookie('email', email, { 'domain': 'localhost', sameSite: 'strict', httpOnly: true })
    res.redirect('/form')
  }
})

app.get('/form', function (req, res) {
  if (!req.cookies.email) {
    res.sendStatus(403)
    return
  }
  res.render('form', { who: req.cookies.email, csrfToken: req.csrfToken() })
})

app.post('/send', function (req, res) {
  if (!req.cookies.email) {
    res.sendStatus(403)
    return
  }

  const body = req.body
  res.render('response', { user: req.cookies.email, to: body.recepient, amount: body.amount })
})

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(port, () => console.log(`listening at https://localhost:${port}`))