const consts = require('../consts');

class Notifications {
    pushNotify(app, id, content, head) {
        db.query(`SELECT device_token FROM ${app} WHERE id = ${id}`, (err, result) => {
            if (err || result[0] == null) return;
            if (result[0].device_token == "") return;

            let notificationData = consts.OneSignalPushNotificationData;
            let device_token = result[0].device_token;
            notificationData.include_player_ids.push(device_token);
            notificationData.contents = { "en": content };
            notificationData.headings = { "en": head };

            this.createNotification(notificationData, consts.OneSignalOptions, (d) => {});
        });
    }


    createNotification(data, options, callback) {
        const req = https.request(options, function(res) {
            res.on('data', function(d) {
                try {
                    console.log(JSON.parse(d));
                    callback(JSON.parse(d));
                } catch (error) {
                    console.log("err");
                }
            });
        });

        req.on('error', function(e) {
            fs.appendFile(__parentDir + '/static/logs/notificationLog.txt', Date.now() + " : " + e.message + "\n", { encoding: 'utf-8' }, (err) => {});
        });

        req.write(JSON.stringify(data));
        req.end();
    }
}

module.exports = new Notifications();