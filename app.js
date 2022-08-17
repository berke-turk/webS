const express = require('express');
const app = express();
const db = require('./my_modules/db');
const funcs = require('./functions/functions');
const bodyParser = require('body-parser');
const fs = require('fs');
var path = require('path'),
    __parentDir = path.dirname(process.mainModule.filename);
funcs.port = process.argv[3] || 80;


// Static use
app.use('/static', express.static(__dirname + '/static'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
//

// Routers
const route = {
    info: require('./routes/info/info'),
};
//

const pages = {
    home: { name: "home", route: require(__parentDir + '/page-routers/home/home') },
};

// Api Routing
app.use('/api/info', route.info);
//

// Page Routing
app.use('/home', pages.home.route);

app.get('/:search', (request, response) => {
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

app.listen(funcs.port);

console.log("Started the server!");