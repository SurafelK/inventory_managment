const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const userRoute =require('./routes/userRoutes')
const errorHandler = require ("./middleware/errorMiddleware");
const cookieParser = require('cookie-parser')

const app = express();

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors())
app.use(cookieParser())

// Routes Middleware
app.use("/api/user",userRoute);

app.use(cookieParser)
// routes
app.get('/', (req,res) =>
{
    res.send("Home Page")
})

// error middleware
app.use(errorHandler);

 
// Connect to DB and Start Server

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
        .then( () =>
        {
            app.listen(PORT, () =>
            {
                console.log(`Port has Started on ${PORT}`);
            })
        } ).catch((error) => console.log(error))