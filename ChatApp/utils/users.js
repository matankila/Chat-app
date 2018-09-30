class Users {
    constructor(){
        this.users = [];
    }
    addUser(id,name,room){
        var user={
            id,name,room
        };
        this.users.push(user);
        return user;
    }
    removeUser(id){
        //remove the user and returning it
        var x,value,arr=[];
        for (var i=0;i<this.users.length;i++){
            if(this.users[i].id === id){
                x = i;
                value = this.users[i];
            }
            else{
                arr.push(this.users[i]);
            }
        }
        this.users=arr;
        return value;
    }
    getUser(id){
        //get user without deleting
        for (var i=0;i<this.users.length;i++){
            if(this.users[i].id === id){
                return this.users[i];
            }
        }
    }
    getUserList (room){
        //return list of users in a room
        var arr = [];
        for (var i=0;i<this.users.length;i++){
            if(this.users[i].room === room){
                arr.push(this.users[i].name);
            }
        }
        return arr;
    }
}

module.exports = {Users};