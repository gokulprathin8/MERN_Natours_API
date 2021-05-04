const express = require('express');

const app = express();
const port = 3000;

app.get('/test', (req, res) => {
   res.status(200).json({message: 'Hello from the server side'});
});

app.post('/test', (req, res)=> {
    res.send('You can post to this endpoint');
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
