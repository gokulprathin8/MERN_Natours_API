const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');
const port = process.env.PORT ||  3000;

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((conn) => {
    console.log('DB Connection Successful!');
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
