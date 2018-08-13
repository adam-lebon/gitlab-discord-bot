const { Subject }  = require('rxjs');
const express = require('express');
const bodyParser = require('body-parser');

class Webserver {
    constructor(port) {
        this.server = express();
        this.server.use(bodyParser.json({ limit: '100mb' }));

        /**
         * Will emit all incoming POST requests
         */
        this.requests = new Subject();
        
        this.port = port;
        
        this.server.post('/', (req, res) => {
            this.requests.next(req);
            res.send('OK');
        });
    }

    listen() {
        this.server.listen(this.port);
    }
}

module.exports = {
    Webserver
};
