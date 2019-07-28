const express = require ('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express();

//loading idea routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//passport config-passport require
require('./config/passport')(passport);

//connecting to db
const db = require('./dbconnect')

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main' //creating a main view, a view that wraps around all of your other views
}))
app.set('view engine', 'handlebars');


//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//method override middleware
app.use(methodOverride('_method'))//Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

//express session 
app.use(session({
    secret: 'secret', //can be anything you want
    resave: true,
    saveUninitialized: true,
  }))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

//global variables
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error') 
    res.locals.user = req.user || null ;
    next(); //calling the next piece of middleware
})

//about idea form
app.get('/about', (req,res)=>{
    res.render("about")
});

app.get('/', (req,res)=>{
    const title = "Home page";
    res.render('index', {
        title : title
    }); //sends error as handlebars by default uses the views directory, looks up the index file in the views directory
});


//use routes
app.use('/ideas', ideas) //anything with the id of /ideas will pertain to the ideas file in the router
app.use('/users', users)

const port = process.env.PORT || 8888;

app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
})

//we need to instantiate the model after connecting it, we can attach various attribute to the instatiated model like name, email etc
//the attribute are stored as documents in the db.
//get request - used to find the data in the database
//post request is used for senssitive data as it accepts a parameter of username and password
//user.remove(monogoose method) 2 params - criteria, (err) or you send a response.json(succ)