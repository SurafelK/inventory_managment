const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const app = express();

const PORT = process.env.PORT || 5000;
 
// Connect to DB and Start Server

mongoose.connect(process.env.MONGO_URI)
        .then( () =>
        {
            app.listen(PORT, () =>
            {
                console.log(`Port has Started on ${PORT}`);
            })
        } ).catch((error) => console.log(error))