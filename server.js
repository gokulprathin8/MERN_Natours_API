const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');
const port = process.env.PORT ||  3000;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((conn) => {
    // console.log(conn.connections);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
