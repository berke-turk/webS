const fs = require('fs');
class Functions {
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

    errorPage404(response) {
        fs.readFile('/static/html/404.html', (err, data) => {
            if (err) { response.status(400).json(); return; }

            response.status(400);
            response.end(data);
        });
    }
}

module.exports = new Functions();