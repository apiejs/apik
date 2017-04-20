var apie = require('./index').app;

// return an express app
var app = apie('./routes');

// start server
app.listen(3000)