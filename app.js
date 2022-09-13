const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const port = process.argv[3] || 80;
const consts = require('./consts');

// Static use
app.use('/static', express.static(consts.dir + '/static'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: process.env.BODY_PARSER_LIMIT }));
//

// Routers
const route = {
    info: require('./api-routers/info/info'),
    user: require('./api-routers/user/user'),
};
//

const pages = {
    home: { name: "home", route: require('./page-routers/home/home') },
};

// Api Routing
app.use('/api/info', route.info);
app.use('/api/user', route.user);
//

// Page Routing
app.use('/', pages.home.route);

app.get('/:search', (request, response, next) => {
    response.header('content-type', 'text/html; utf-8');
    let search = request.params.search;

    // Search User


    //

    /*response.render("asci-yenileme.ejs", { cookerID: request.params.cookerID, rCode: request.params.rCode, baseUrl: funcs.baseUrl, staticUrl: funcs.staticUrl }, (err, html) => {
        if (err) { response.status(400); return; }
        response.end(html, 'utf-8');
    });*/


});
//

app.use('*', (request, response) => {
    funcs.errorPage404(response);
    return;
});

app.listen(port);

console.log("Started the server!");