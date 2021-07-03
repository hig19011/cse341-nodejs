const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const chatBox = document.getElementById('chatBox')
const messageEl = document.getElementById('message')
const user = document.getElementById('user')
const date = new Date() // Date implementation

socket.on('newMessage', data => {
    addMessage(data, false);
})

socket.on('userLeft', data => {
    if(data.time === undefined) {
        data.time = getTime();
    }
    addMessage(data, false);
})

socket.on('register', ()=>{
    console.log("register");
    console.log(user.value);
    socket.emit('registerUser', {userName: user.value});
})

// Post message to board
const postMessage = () => {
    /***********************************
     *         YOUR CODE HERE          *
     ***********************************/
    var message = messageEl.value
    var userName = user.value;
    data = {message: message, user:userName, time: getTime()};
    socket.emit('message', data);
    addMessage(data, true);
}

// Add message from any user to chatbox, determine if added
// by current user.
const addMessage = (data = {}, user = false) => {
    /***********************************
     *         YOUR CODE HERE          *
     ***********************************/
    var li = document.createElement('li');
    
    var messageSpan = document.createElement('span');
    messageSpan.innerText = data.time + " " + data.user + " - " + data.message;
    li.appendChild(messageSpan);
  

    li.setAttribute("data-id",data.id);
    li.classList.add("message");   
    if(user) {
        li.classList.add("uMessage");        
    }

    chatBox.appendChild(li);
}


getTime = () => {
    const now = new Date();
    let time = now.getHours().toString().padStart(2,"0") +":"+now.getMinutes().toString().padStart(2,"0");
    return time;
}

window.onbeforeunload  = () => {
    var userName = user.value;
    const response = fetch('/leaveChat?userName='+userName, {
        method: 'GET'       
    });

}