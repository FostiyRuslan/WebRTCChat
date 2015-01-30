var Router = function(app){
    app.get('/', function (req, res) {
        res.render('index.html');
    });
};

module.exports = Router;