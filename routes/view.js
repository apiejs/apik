module.exports = {
    "path": "/view",
    "body": function (req, res) {
        res.render('index', { title: 'Express' });
    }
}
