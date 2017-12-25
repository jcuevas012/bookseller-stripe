const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey)
const express = require('express');
const bodyParser = require('body-parser')
const exphbs  = require('express-handlebars')
const chalk = require('chalk')
const path = require('path')


var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.resolve(path.join(__dirname, '/public'))))


app.get('/', function (req, res) {
    res.render('index', {stripePublishableKey: keys.publishableKey})
})

// app.get('/success', function (req, res) {
//     res.render('success')
// })
app.post('/charge', function (req, res) {
    const amount = 25000
    stripe.customers.create({
        email: req.body.stripEmail,
        source: req.body.stripeToken
    })
    .then((customer) => {
        
        stripe.charges.create({
            amount,
            description: 'Web Development Practical Nodejs Ebook',
            currency: 'usd',
            customer: customer.id
        })
        .then((charge) => {
            res.render('success')
        })
    })
})

app.listen(3000, (req, res) => {
    console.log(chalk.green('[book seller] alredy started.'))
});