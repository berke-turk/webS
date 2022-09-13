class ID {
    constructor(id) {
        this.id = parseInt(id);
    }

    getID() {
        return this.id;
    }

    setID(id) {
        this.id = parseInt(id);
    }
}

class UserView extends ID {
    constructor({ id = 0, username = '', email = '', image = '' }) {
        // Super Extends Called
        super(id);
        //

        this.username = username;
        this.email = email;
        this.image = image;
    }

    getUser() {
        return {
            getID: this.getID,
            getUsername: () => { return this.username; },
            getEmail: () => { return this.email; }
        }
    }

    serialize() {
        return JSON.stringify({
            id: this.getUser().getID(),
            username: this.getUser().getUsername(),
            email: this.getUser().getEmail()
        });
    }

    json() {
        return {
            id: this.getUser().getID(),
            username: this.getUser().getUsername(),
            email: this.getUser().getEmail()
        }
    }
}

class UserModel {
    newUserID(id) {
        return new ID(id);
    }

    newUserView(user) {
        console.log(user.id);
        return new UserView({ id: user.id, username: user.username, email: user.email, image: user.image });
    }
}

module.exports = new UserModel();