const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, roomUsers} = require('./utils/users')

const app = express();
//Usually not done as 'app' creates server underhood -->used 'server' to access socket.io 
const server = http.createServer(app); 
const io = socketio(server);   
//Set Static folder
app.use(express.static(path.join(__dirname,'public')));

//Run when client Connects ie joins
io.on('connection', socket => {
    socket.on('joinChatRoom', ({username, room}) => {
                
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);     //inbuid in socket

    //Welcome new user
        socket.emit('message', formatMessage('chatBot','Welcome to Socialize'));
    //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage('chatBot',`${user.username} has joined the chat`));
    //Send Room and user details
        io.to(user.room).emit('roomUsers', {room: user.room, users: roomUsers(user.room)});
    })
    //Listen for message from client
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));       
    })

//Run when client disconnects
    socket.on('disconnect', () => {      //disconnect is defined inside connect
        const user = userLeave(socket.id);
        if (user){
        io.to(user.room).emit('message', formatMessage('chatBot', `${user.username} has left the chat`));
        io.to(user.room).emit('roomUsers', {room: user.room, users: roomUsers(user.room)});   
        }
});


})



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server Running in port: ${PORT}`));