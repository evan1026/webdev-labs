const ws = window.WebSocket || window.MozWebSocket;
// shortcut:
const qs = document.querySelector.bind(document);
let connection;
let username = "";

/********************************************************/
/* 1. Settng up the web socket + socket event listeners */
/********************************************************/
const initializeConnection = ev => {
    const url = qs('#server').value;
    connection = new ws(url);
    console.log(`Connecting to ${url}...`);

    connection.onopen = () => {
        // fires when the server message received indicating an open connection
        console.log("WebSocket connection is open.");
        utils.showLogin();
    };
    
    connection.onclose = () => {
        // fires when the server message received indicating a closed connection
        console.log("WebSocket connection is closed.");
        alert('Socket server disconnected!');
    };
    
    connection.onerror = ev => {
        // fires when the server indicates a websocket error
        console.error("WebSocket error observed:", ev);
    };
    
    // this is what you will be implementing (see below)
    connection.onmessage = handleServerMessage;
};

/********************************************************/
/* 2. Helper functions that send messages to the server */
/********************************************************/
const notify = {
    sendChat: () => {
        if (qs("#message").value !== "") {
            connection.send(JSON.stringify({
                type: "chat",
                text: qs("#message").value,
                username: username
            }));
            qs("#message").value = "";
        }
    },

    triggerFromEnter: (ev, callback) => {
        if (ev.keyCode === 13) {
            ev.preventDefault();
            callback(ev);
        }
    },

    logout: () => {
        if (!connection) {
            return;
        }
        connection.send(JSON.stringify({
            type: "disconnect",
            username: username
        }));
    },

    login: () => {
        username = qs("#name").value;
        if (!username) {
            return;
        }
        if (!connection) {
            return;
        }

        // log into server:
        connection.send(JSON.stringify({
            type: "login",
            username: username
        }));

        // update UI:
        utils.showChatInterface();
    }
}

/************************************************/
/* 3. Event handlers that listen for DOM events */
/************************************************/
qs('#connect').addEventListener('click', initializeConnection);
qs("#set-name").addEventListener("click", notify.login);
qs('#send').addEventListener('click', notify.sendChat);
qs("#server").addEventListener('keyup', ev => {
    notify.triggerFromEnter(ev, initializeConnection);
});
qs("#name").addEventListener('keyup', ev => {
    notify.triggerFromEnter(ev, notify.login);
});
qs("#message").addEventListener('keyup', ev => {
    notify.triggerFromEnter(ev, notify.sendChat);
});

// logout when the user closes the tab:
window.addEventListener('beforeunload', notify.logout);

// load with cursor on the server textbox:
qs("#server").focus();

/******************************************************/
/* 4. Helper Functions that hide and show UI elements */
/******************************************************/
const utils = {
    resetApp: () => {
        connection = null;
        utils.showElements(['#ws-status']);
        utils.hideElements(
            ['#name-display', '#chat-container', '#send-container', '#status']);
        qs("#chat").innerHTML = '';
    },

    showLogin: () => {
        utils.hideElements(['#step1']);
        utils.showElements(['#step2', '#ws-status']);
        qs("#ws-status").textContent = "Connected";
        qs("#name").focus();
    },

    showChatInterface: () => {
        qs("#name-display").textContent = `Signed in as ${username}.`;
        utils.hideElements(['#step2']);
        utils.showElements(
            ['#name-display', '#chat-container', '#send-container', '#status']);
        qs("#message").focus();
    },

    showElements: elements => {
        document.querySelectorAll(elements).forEach(elem => {
            elem.classList.remove('hidden');
        })
    },
    hideElements: elements => {
        document.querySelectorAll(elements).forEach(elem => {
            elem.classList.add('hidden');
        })
    }
};


/********************
 * 5. Your Code Here
 ********************/
const updateActiveUsers = users => {
    let userList = qs('#users-list > ul');
    while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
    }
    for (let user of users) {
        let listElement = document.createElement('li');
        listElement.innerText = user;
        userList.appendChild(listElement);
    }
}

const handleServerMessage = ev => {
    const data = JSON.parse(ev.data);
    if (data.type === "login") {
        updateActiveUsers(data.active_users);
        if (data.username === username){
            qs('#update').innerText = "You have joined the chat";
        } else {
            qs('#update').innerText = `${data.username} has joined the chat`;
        }
    } else if (data.type === "disconnect") {
        updateActiveUsers(data.active_users);
        if (data.username === username){
            qs('#update').innerText = "You have left the chat";
        } else {
            qs('#update').innerText = `${data.username} has left the chat`;
        }
    } else if (data.type === "chat") {
        let chatDiv = qs("#chat");
        let newMessage = document.createElement("p");
        if (data.username === username){
            newMessage.style.alignSelf = 'flex-end';
            newMessage.innerHTML = `<b>You:</b>&emsp;${data.text}`;
        } else {
            newMessage.innerHTML = `<b>${data.username}:</b>&emsp;${data.text}`;
        }
        chatDiv.appendChild(newMessage);
    } else {
        console.error("Message type not recognized.");
        console.log(data);
    }
};