[{
    id: '/#sajldhlk1',
    name: 'User1',
    room: 'room1'
}]

// addUserID(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

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