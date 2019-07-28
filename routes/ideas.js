const express = require ('express');
const router = express.Router();
const mongoose = require('mongoose')//object relational mapper that allows us to interract with the database
const {ensureAuthenticated} = require('../helpers/auth') //the curly braces are used for destructuring, it helps to require any kind of functions specifically 

//load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas'); //loading the model into a variable

//idea index route
router.get('/', ensureAuthenticated, (req, res) =>{
    Idea.find({user: req.user.id})//getting the entire model into this empty object
    .sort({date:'desc'})
    .then(ideas => { //priniting everything in the collection "ideas"
        res.render('ideas/index', {
            ideas:ideas //ask prashanth
        })
    })
})

//add ideas route
router.get('/add', ensureAuthenticated, (req,res)=>{
    res.render("ideas/add")
});

//edit idea
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{ //:id is a parameter or a placeholder which takes in the specific idea as the route
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
       if (idea.user != req.user.id){          
           req.flash('error_msg', 'not authorised')
           res.redirect('/ideas');
       } else {
           res.redirect('ideas/edit', {
               idea:idea
           })

       }
    })    
})

//process form
router.post('/', ensureAuthenticated ,(req,res)=>{ //will be taking the sent data from the /ideas route 'body'

/* req.body properties come from a form post where the form data (which is submitted in the body contents)
 has been parsed into properties of the body tag. You use the routerropriate property that matches the source 
 of the data you are interested in. */

    // console.log(req.body) //accesses the inputted data in the form from both title and details in the add.handlebars.
    //res.send("okay")

    let errors = [];
    if (!req.body.title){
        errors.push({text:"please add a title"}) //since we are looping through errors and it is an object that has text, we can access
        //it by just using {{text}} in add.handlebars
    }
    if (!req.body.details){
        errors.push({text1:"please add some details"})
    }
    if (errors.length>0){ //this re renders the form (resets it) if both title and details are not passed
        res.render ('ideas/add', {
            errors: errors, //errors being an array which is passed can be looped through in add.handlebars
            title: req.body.title,
            details: req.body.details
        })
    } else { //adding the idea
        const newUser = {
            title: req.body.title,
            details : req.body.details,
            user: req.user.id
        }
        new Idea(newUser) //Idea is creating a model that provides an interface to mongodb collections
        .save()
        .then(idea => { //returning a callback "idea"
        req.flash('success_msg', "video idea has been succesfuly addedd")
            res.redirect('/ideas')
        })
    }

})

//edit form submit
router.put('/:id', ensureAuthenticated, (req, res)=>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        //update new value
        idea.title = req.body.title,
        idea.details = req.body.details,

        idea.save()
        .then(idea =>{
            req.flash('success_msg', "video idea has been succesfuly edited")
            res.redirect('/ideas')
        })
        
    }) 
})

//delete idea
router.delete('/:id', ensureAuthenticated, (req, res)=>{
    Idea.remove({_id: req.params.id})
    .then(()=>{
        req.flash('success_msg', "video idea has been succesfuly removed")
        res.redirect('/ideas')
    })   
})

module.exports = router;