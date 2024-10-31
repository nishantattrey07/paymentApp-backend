const express = require('express');
const apiV1 = require('./routes/index')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => { 
    res.send("Hello world");
})

app.listen(3000, (req, res) => { 
    console.log(`app in running on http://localhost:3000/`);
    
})

app.use('/api/v1', apiV1);

