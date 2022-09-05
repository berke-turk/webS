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
    constructor(id, username, email) {
        // Super Extends Called
        super(id);
        //

        this.username = username;
        this.email = email;
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
    newUserID(user) {
        return new ID(user.id);
    }

    newUserView(user) {
        console.log(user.id);
        return new UserView(user.id, user.username, user.email);
    }
}

module.exports = new UserModel();