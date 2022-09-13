class Consts {
    dir = __dirname;

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
}

module.exports = new Consts();