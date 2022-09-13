var db = require('../my_modules/db');
var path = require('path'),
    __parentDir = path.dirname(process.mainModule.filename);
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const https = require('https');
const moment = require('moment');
require('dotenv').config();
const nodemailer = require('nodemailer');
const cookie = require('cookie');
const userModel = require("../models/user");

class Functions {
    port = 80;
    payload = {
        username: '',
        password: '',
        source_addr: '' /* Your registered phone number or title */ ,
        custom_id: ''
    };

    OneSignalHeaders = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": process.env.ONESIGNAL_AUTHORIZATION
    };

    OneSignalOptions = {
        host: process.env.ONESIGNAL_HOST,
        path: process.env.ONESIGNAL_PATH,
        method: process.env.ONESIGNAL_METHOD,
        headers: this.OneSignalHeaders
    };

    OneSignalPushNotificationData = {
        app_id: process.env.ONESIGNAL_APP_ID,
        title: process.env.ONESIGNAL_TITLE,
        data: { "foo": "s" },
        contents: { "en": "Turkish Message" },
        headings: { "en": "Turkish Message" },
        include_player_ids: []
    };

    months = [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık"
    ];

    pushNotify(app, id, content, head) {
        db.query(`SELECT device_token FROM ${app} WHERE id = ${id}`, (err, result) => {
            if (err || result[0] == null) return;
            if (result[0].device_token == "") return;

            let notificationData = this.OneSignalPushNotificationData;
            let device_token = result[0].device_token;
            notificationData.include_player_ids.push(device_token);
            notificationData.contents = { "en": content };
            notificationData.headings = { "en": head };

            this.createNotification(notificationData, this.OneSignalOptions, (d) => {});
        });
    }

    dbConnection(callback) {
        db.pool.getConnection().then(async(con) => {
            callback(con);
        });
    }

    // Auth For User And Pool Connection
    AuthorizationForUserAndPool(req, res, callback) {
        if (req.headers['authorization'] == null) { res.status(500).json(); return; }
        let authorization = req.headers['authorization'].split(' ');
        if (authorization[0] != "Bearer" || authorization[1] == null) { res.status(500).json(); return; }

        db.pool.getConnection().then(async(con) => {
            let [
                [result], // queryInfo
            ] = await con.execute("SELECT id FROM user WHERE token = ?", [authorization[1]]).catch((err) => {
                res.status(200).json({ success: false, message: "error" });
            });

            if (!result) {
                res.status(200).json({ success: false, message: "result is null" });
            }

            await callback(con, userModel.newUserID({ id: result.id }));
        });
    }

    Authorization(table, request, response, callback) {
        if (request.headers['authorization'] == null) { response.status(500).json(); return; }
        let authorization = request.headers['authorization'].split(' ');
        if (authorization[0] != "Bearer" || authorization[1] == null) { response.status(500).json(); return; }

        db.query("SELECT id FROM " + table + " WHERE token = ?", [authorization[1]], (err, result) => {
            if (err)
                console.log("Auth error : " + err.message);
            if (err || result[0] == null) { response.status(500).json(); return; }

            let data = result[0];
            callback(parseInt(data.id));
        });
    }

    AuthorizationAdministration(request, response, callback) {
        if (request.headers['authorization'] == null) { response.status(500).json(); return; }
        let authorization = request.headers['authorization'].split(' ');
        if (authorization[0] != "Bearer" || authorization[1] == null) { response.status(500).json(); return; }

        db.query("SELECT NOW() AS currentTime;", (err, result) => {
            let nowTime = result[0].currentTime;
            db.query("SELECT id,name,image FROM admin WHERE token = ?", [authorization[1]], (err, result) => {
                if (err || result[0] == null) { response.status(500).json(); return; }

                let data = result[0];
                callback(data, nowTime);
            });
        });
    }

    adminAuthWithCookies(request, response, callback) {
        // Read IP
        let ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
        console.log(ip);

        // Read Cookies
        let cookies = cookie.parse(request.headers.cookie);
        console.log(cookies);
        //

        // Token varsa, kontrol edilmeli
        if (cookies.token != null) {
            // Bir token var
            console.log(db.query(`SELECT id,name,email,image,description,isActive FROM admin WHERE token = ?`, [cookies.token], (err, result) => {
                if (err || result[0] == null) {
                    // Yok Login'e gönder
                    db.query(`SELECT * FROM admin`, (err, result) => {
                        console.log(result[0]);
                    });
                    console.log("AAAB" + cookies.token);
                    this.adminRedirectLoginAndCloseToken(response);
                    return;
                }
                let admin = result[0];
                admin.isActive = !!admin.isActive;
                if (!admin.isActive) {
                    // Yok Login'e gönder
                    console.log("AAAC");
                    this.adminRedirectLoginAndCloseToken(response);
                    return;
                }

                admin.cookies = cookies;
                admin.ip = ip;
                console.log("Profile");
                callback(admin);
            }).sql);
        } else {
            // Yok Login'e gönder
            console.log("AAAD");
            this.adminRedirectLoginAndCloseToken(response);
        }
    }

    adminRedirectLoginAndCloseToken(response) {
        console.log("AAA");
        // Yok Login'e gönder
        response.clearCookie('token');
        response.statusCode = 302;
        response.setHeader('Location', '/x12345747894101/login');
        response.end();
    }

    redirect(response, url) {
        response.statusCode = 302;
        response.setHeader('Location', url);
        response.end();
    }

    baseUrl() {
        return "http://localhost";
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    basePageView(callback) {
        db.query(`SELECT * FROM site`, (err, result) => {
            if (err || result[0] == null) return;

            let site = result[0];
            callback(site);
        });
    }

    getCodeV1(maxLength) {
        let length = maxLength / 2;
        let characters = ["A", "B", "C", "D", "E", "I", "L", "K", "N", "O", "P", "R", "S", "T", "U", "V", "Z"];
        let code = "";
        for (let index = 0; index < length; index++) {
            let c = crypto.randomInt(1, 3);
            if (c == 1)
                code += crypto.randomInt(1, 10).toString();
            else
                code += characters[crypto.randomInt(0, characters.length)];
        }
        for (let index = 0; index < length; index++) {
            let c = crypto.randomInt(1, 3);
            if (c == 1)
                code += crypto.randomInt(1, 10).toString();
            else
                code += characters[crypto.randomInt(0, characters.length)];
        }
        return code;
    }

    timeDiffCheck(oldTime, time, callback) {
        let query = db.query("SELECT now() AS currentTime;", (err, result, fields) => {
            if (err || result[0] == null) { callback({ success: false }); return; }

            let currentTime = Date.parse(result[0].currentTime);
            let fark = (currentTime - oldTime) / 1000;
            if (fark < time) {
                // Süre geçmemiş
                let ec = time - fark;
                callback({ success: false, ec: ec, currentTime: currentTime });
            } else {
                // Süre geçmiş
                callback({ success: true });
            }
        });
    }

    CheckArrayIsNotNullKey(sourceArray, destinationArray) {
        for (const key in sourceArray) {
            if (!(key in destinationArray))
                return false;
        }
        return true;
    }

    CheckArrayIsNullKey(sourceArray, destinationArray) {
        if (Object.keys(destinationArray).length == 0)
            return false;

        for (const key in destinationArray) {
            if (!(key in sourceArray))
                return false;
        }
        return true;
    }


    createRsaKeys() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
            // The standard secure default length for RSA keys is 2048 bits
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "pkcs1",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs1",
                format: "pem",
            },
        });

        fs.writeFile(__parentDir + '/security/public.pem', publicKey, (err) => {
            let data = fs.readFileSync(__parentDir + '/security/public.pem', { encoding: 'utf-8' });
            fs.writeFile(__parentDir + '/static/rsa/public.pem', data, (err) => {});
        });
        fs.writeFile(__parentDir + '/security/private.pem', privateKey, (err) => {});
    }

    encryptData(data) {
        let publicKey = crypto.createPublicKey(fs.readFileSync(__parentDir + '/security/public.pem', { encoding: 'utf-8' }));
        return crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(data)).toString('base64');
    }

    decryptData(data) {
        let privateKey = crypto.createPrivateKey(fs.readFileSync(__parentDir + '/security/private.pem', { encoding: 'utf-8' }));
        return crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, Buffer.from(data, "base64")).toString();
    }

    errorPage404(response) {
        fs.readFile(__parentDir + '/static/html/404.html', (err, data) => {
            if (err) { response.status(400).json(); return; }

            response.status(400);
            response.end(data);
        });
    }

    sendSMS(body, callback) {
        const options = {
            hostname: 'sms.verimor.com.tr',
            path: '/v2/send.json',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const req = http.request(options, res => {
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

    call(caller, callee, callback) {
        console.log(`http://213.74.183.197/originate.php?caller=${caller}&callee=${callee}`);
        const req = http.request(`http://213.74.183.197/originate.php?caller=${caller}&callee=${callee}`, res => {
            res.on('data', d => {
                console.log(d);
                callback(d);
            })
        });

        req.on('error', error => {
            fs.appendFile(__parentDir + '/static/logs/callLog.txt', Date.now() + " : " + error.message + "\n", { encoding: 'utf-8' }, (err) => {});
        });
        req.end();
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

module.exports = new Functions();