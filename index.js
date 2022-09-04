const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'User API',
            description: 'User API Information',
            contact: {
                name: 'Madhav'
            },
            servers: ["http://localhost:3000"]
        }
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

dotenv.config();
//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    (err) => {
        if(err) confirm.log(err);
    }
)

//Middleware
app.use(express.json()); //parses any incoming post request json into javascript object 

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log('Server is up and running.'))