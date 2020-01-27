const bc = require('bcryptjs');
const router = require('express').Router();

const Users = require('./model.js');


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

router.post('/login', (req, res) => {
    let {username, password} = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if(user && bc.compareSync(password, user.password)){
                res.status(200).json({ message: `Hello ${user.username}`});
            }else{
                res.status(401).json({message: "missing header"})
            }
         })
         .catch(err => {
             res.status(500).json(err);
         })
});

router.get('/', (req,res) => {
    if(req.headers.authorization){
        bc.hash(req.headers.authorization, 6, (err, hash) => {
        if(err) {
            res.status(500).jsont({message: "something is not working"})
        }else{
            res.status(200).json({ hash})
        }
    });
    }else{
        res.status(400).json({message: 'YOU SHALL NOT PASS! 🧙🏼‍'})
}
})

module.exports = router;