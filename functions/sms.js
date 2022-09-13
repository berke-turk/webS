const https = require('https');

class SMS {
    send(body, callback) {
        const options = {
            hostname: 'sms.verimor.com.tr',
            path: '/v2/send.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            if (res.statusCode != 200)
                fs.appendFile(__parentDir + '/static/logs/smsLog.txt', Date.now() + " : " + "status error: " + res.statusCode + "\n", { encoding: 'utf-8' }, (err) => {});

            res.on('data', d => {
                callback(d);
            })
        });

        req.on('error', error => {
            console.error(error)
            fs.appendFile(__parentDir + '/static/logs/smsLog.txt', Date.now() + " : " + error.message + "\n", { encoding: 'utf-8' }, (err) => {});
        });

        req.write(JSON.stringify(body));
        req.end();
    }
}

module.exports = new SMS();