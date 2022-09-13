const crypto = require('./crypto');
const database = require('./database');

class Authorization {
    // Auth For User And Pool Connection
    User(req, res, callback) {
        let { successToken, token } = this.read_token(req, res); // Read Token for Authorization
        if (successToken) { res.type('txt').send('Wtf Token!'); return; }

        let { successID, id } = this.read_id(req, res); // Waiting ID
        if (successID) { res.type('txt').send('Wtf ID!'); return; }

        let { successIP, ip } = this.read_id(req, res); // Waiting IP
        if (successIP) { res.type('txt').send('Wtf IP!'); return; }

        database.dbConnection(async(con) => {
            let [
                [result], // queryInfo
            ] = await con.execute("SELECT * FROM login_token WHERE BINARY token = ? AND id = ? AND ip = ?", [token, id, ip]).catch((err) => {
                res.type('txt').send('Wtf');
                return;
            });

            if (!result) {
                res.type('txt').send('hop!');
                return;
            }

            await callback(con, userModel.newUserID({ id: result.id }));
        });
    }

    /* Auth For Admins
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
*/
    read_token(req, res) {
        if (req.headers['authorization'] == null) { res.status(500).json(); return { success: false, token: 0 }; }
        let authorization = req.headers['authorization'].split(' ');
        if (authorization[0] != "Bearer" || authorization[1] == null) { res.status(500).json(); return { success: false, token: 0 }; }

        return { success: true, token: authorization[1] };
    }

    read_id(req, res) {
        let id = 0;
        if (req.body.id) {
            id = parseInt(req.body.id);
        } else {
            res.status(500).json();
            return { success: false, id: 0 };
        }
        parseInt()
        if (authorization[0] != "Bearer" || authorization[1] == null) { res.status(500).json(); return { success: false, token: 0 }; }

        return { success: true, token: authorization[1] };
    }

    read_ip(req, res) {
        let id = 0;
        if (req.body.id) {
            id = parseInt(req.body.id);
        } else {
            res.status(500).json();
            return { success: false, id: 0 };
        }
        parseInt()
        if (authorization[0] != "Bearer" || authorization[1] == null) { res.status(500).json(); return { success: false, token: 0 }; }

        return { success: true, token: authorization[1] };
    }
}

module.exports = new Authorization();