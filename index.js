var express = require('express');
var app = express();
var port = 3090;

app.get('/', function(req,res) {
    testNum = req.query.num;
    console.log(testNum);
    if (testNum == 0) {
        console.log(opop);
    }
})

app.listen(port)