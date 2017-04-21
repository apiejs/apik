module.exports = {
    "path": "/view",
    "body": function (ctx) {
        return ctx.render('index', { title: 'Express' });
    }
}
