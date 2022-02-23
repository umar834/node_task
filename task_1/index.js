const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/api/register',(request,response) => {
    console.log(request.body);
    response.json({message: 'done'});
});

app.use("/", router);

app.listen(3001, () => {
    console.log('Server Listening on port 3001');
});