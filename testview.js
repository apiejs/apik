var apie = require('./index').app;

// return an express app
var app = apie('./routes');

app.set('view engine', 'pug');

// start server
app.listen(3000)