const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

const socket = io();            //io accessible due to script added in chat.html

//Get username and room from URL as objects
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});   //location.search = url and other arguement excludes symbols in url
//Joins Chatroom
socket.emit('joinChatRoom', {username, room});

//Listen to Room and user details
socket.on('roomUsers', ({room, users}) => { 
    outputRoomName(room);
    outputUserList(users);
})

socket.on('message', msg => {   //msg caught (event emitted by server.js)  logged to browser console
    console.log(msg);
    outputMessage(msg);         //add msg to chat 
    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e => { 
    e.preventDefault();                        //important
    const msg = e.target.elements.msg.value;   //msg is id provided for chat-form in chat.html
    //console.log(msg);
    
    //Emit message to server
    socket.emit('chatMessage', msg);
    //Clear inout field and focus
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

//Output message to DOM
function outputMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
//Output roomName to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
function outputUserList(users) {
//    let list = '';
//    users.forEach(user => {
//        const li = `<li>${user.username}</li>`;
//        list+= li;
         
//     });
//      userList.innerHTML = list;
                        //OR
userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join()}`;
//forEach is not used since it cant RETURN ANYTHING
}