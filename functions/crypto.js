const crypto = require('crypto');
class Crypto {
    uuID() {
        return crypto.randomUUID();
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
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

    createRsaKeys() {
        return { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
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

        /*fs.writeFile(__parentDir + '/security/public.pem', publicKey, (err) => {
            let data = fs.readFileSync(__parentDir + '/security/public.pem', { encoding: 'utf-8' });
            fs.writeFile(__parentDir + '/static/rsa/public.pem', data, (err) => {});
        });
        fs.writeFile(__parentDir + '/security/private.pem', privateKey, (err) => {});*/
    }

    encryptData(data, publicKeyPath) {
        let publicKey = crypto.createPublicKey(fs.readFileSync(publicKeyPath, { encoding: 'utf-8' }));
        return crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(data)).toString('base64');
    }

    decryptData(data, privateKeyPath) {
        let privateKey = crypto.createPrivateKey(fs.readFileSync(privateKeyPath, { encoding: 'utf-8' }));
        return crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        }, Buffer.from(data, "base64")).toString();
    }
}

module.exports = new Crypto();