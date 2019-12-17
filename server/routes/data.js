const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    if(!req.isAuthenticated()) { return res.status(401).send();}
    req.user.data = req.body;
    req.user.save((err) => {
        if(err) return res.status(500).send(err.msg);
        return res.status(201).send();
    })
});

module.exports = router;
