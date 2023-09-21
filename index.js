const express = require('express');
require('dotenv').config();
const connectToDatabase = require('./db/connection')
const cors = require('cors');
const app = express();
const port = process.env.PORT ||4040; 
//Database connection function
connectToDatabase();
//Middlewares----------
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}));


//Routes Middleware----------
app.use('/user',require('./routes/UserRoute'));
app.use('/post',require('./routes/postRoute'));
app.use('/admin',require('./routes/AdminRoute'));


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})