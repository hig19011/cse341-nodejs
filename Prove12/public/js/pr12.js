const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const errorContainer = document.getElementById('errMsg')
const usernameInput = document.getElementById('username')
const date = new Date()

// A simple async POST request function
const getData = async (url = '') => {
    const response = await fetch(url, {
        method: 'GET'
    })
    return response.json()
}

// A simple async POST request function
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

// Login user to access chat room.
const login = async () => {
    var userName = usernameInput.value;
    var response = await postData('/login', {userName: userName});
    if(response.error){
        errorContainer.innerText = response.error;
        return;
    }

    socket.emit('newUser', userName, getTime());
    window.location = '/chat';
}

getTime = () => {
    const now = new Date();
    let time = now.getHours().toString().padStart(2,"0") +":"+now.getMinutes().toString().padStart(2,"0");
    return time;
} 

