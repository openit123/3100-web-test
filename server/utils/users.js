// This fragment of codes referenced the materials in an online course on udemy that I participated in:
// https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview

class Users {
    constructor () {
        this.users = [];
    }
    // methods
    addUser (id, name, room) {
        var newUser = {id, name, room};
        this.users.push(newUser);
        return newUser;
    }
    removeUser (id) {
        // return user that was removed
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }
    getUser (id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList (room) {
        var usersInRoom = this.users.filter((user) => user.room === room);
        var namesArr = usersInRoom.map((user) => user.name);

        return namesArr;
    }
}

module.exports = {Users};