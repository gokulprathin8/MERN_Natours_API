const express = require('express');

const getTest = (req, res) => {
    res.status(200).json({message: 'Hello from the server side'});
}

const postTest = (req, res) => {
    res.status(200).send('You can post to this endpoint');
}

const router = express.Router();

router
    .get(getTest)
    .post(postTest)

module.exports = router;
