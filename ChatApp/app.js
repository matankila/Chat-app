const express = require('express'),
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    body = require('body-parser'),
    request = require('request'),
    socketIO = require('socket.io'),
    http = require('http'),
    { generateMessage } = require('./utils/message'),
    { isString } = require('./utils/validation'),
    {Users}      = require('./utils/users');

var app = express(),
    server = http.createServer((app)),
    io = socketIO(server),
    users = new Users();

//=======================  MIDDLEWARE  ==========================================

//use the body parser to return values from post requests
app.use(body.urlencoded({ extended: true }));
//connect to UsersDB
mongoose.connect('mongodb://localhost:27017/chatDB', { useNewUrlParser: true });
//use for the css to use the public folder
app.use(express.static("public"));

//=======================  ROUTES  ===============================================

//ROOT ROUTES
app.get('/', function (req, res) {
    res.render('join.ejs');
});

app.get('/chat', function (req, res) {
    res.render('chat.ejs');
});

io.on('connection', function (socket) {
    console.log('new user connected to the server');

    //socket.emit('newMess',generateMessage('Admin','welcome to the chat app'));

    // socket.broadcast.emit('newMess',generateMessage('Admin','new user joined the chat'));

    socket.on('join', (params, callback) => {
        if (!isString(params.userName) || !isString(params.roomName)) {
            return callback("name and room name are required");
        }
        else {
            socket.join(`${params.roomName}`, function () {
                users.addUser(socket.id, params.userName, params.roomName);
                io.to(params.roomName).emit('updateUserList', users.getUserList(params.roomName));
                socket.emit('newMess', generateMessage('Admin', 'Welcome to the chat app'));
                socket.broadcast.to(params.roomName).emit('newMess', generateMessage('Admin', `${params.userName} has joined.`));
                callback();
            });
        }
    });

    socket.on("createMess", function (newEmail) {
        console.log("new message", newEmail);
        io.sockets.in(newEmail.chat).emit('newMess', generateMessage(newEmail.from, newEmail.text));
    });

    socket.on('disconnect', function () {
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMess',generateMessage('Admin',`${user.name} left`));
        }
    });
});
//Listen on Port 3000
server.listen(3000, function (req, res) {
    console.log("server is up and running!");
});