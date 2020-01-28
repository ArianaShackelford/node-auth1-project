const bc = require('bcryptjs');
const router = require('express').Router();

const Users = require('./model.js');

//sign up
router.post('/register', (req,res) => {
    let user = req.body;
    const hash = bc.hashSync(req.body.password, 6);
    console.log(user)
    user.password = hash; 

    Users.add(user)
        .then(newUser => {
            res.status(201).json(newUser);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        });
});
//login
router.post('/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bc.compareSync(password, user.password)){
                req.session.user = user;
                res.status(200).json({ message: `Hello ${user.username}`});
            }else{
                res.status(401).json({message: "missing header"})
            }
         })
         .catch(err => {
             console.log(err)
             res.status(500).json(err);
         })
});


//log out
router.get('/auth/logout', (req,res) => {
    console.log(req)
    if(req.session) {
        console.log(req.session)
        req.session.destroy(err => {
            if(err){
                console.log(err)
                res.json({message: "Sorry you're stuck here."})
            }else{
                res.status(200).json({message: "Looks like you made it out this time."})
            }
        })
    }else{
        res.status(500).json({message: 'We ran into an error'})
    }
})


//get list of users
router.get('/', authorized, (req,res) => {
   Users.find()
   .then(users => res.json(users))
   .catch(error => res.json(error))
});


//authorization middleware
function authorized(req,res,next){
    if(req.session && req.session.user){
        console.log(req.session)
        next()
    }else{
        res.status(404).json({message: "YOU SHALL NOT PASS! 🧙🏼‍"})
    }
}

module.exports = router;