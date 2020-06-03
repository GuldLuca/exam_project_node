$(document).ready(function () {

    //getting connection to the websocket server at host and port
    let socket = io.connect("http://dev3.rabotnik.coop:4000");

    //fetching inputs and buttons from DOM
    let chatInput = $("#chat-window_input");
    let inputBtn = $("#chat-window_input_btn");
    let chatWindow = $("#chat-window_messages");
    let chatOutput = $("#output");
    let usersConnected = $("#users-connected_list");
    let chatName = $("#name-input");
   

    //Send a message

    //Register through clicking the button
    inputBtn.click(function(){
        socket.emit("new_input", {message : chatInput.val()})
    });

    //register through hitting "enter"/"return" on keyboard (keycode 13)
    chatInput.keypress( e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == "13"){
            socket.emit("new_input", {message : chatInput.val()})
        }
    })

    //On new input show messages  in chat window / send html data to the DOM (setting/showing date and time message was sent, chatname, usercolor and message)
    socket.on("new_input", (data) => {
        chatOutput.html("");
        chatInput.val("");
        chatWindow.append(`
                        <div>
                            <div class="message-content">
                                <p class="message-time"><time>${new Date()}</time></></p>
                                <p style="color:${data.color}" class="chat-window_name">${data.username}</p>
                                <p class="chat-window_message" style="color: rgba(0,0,0,0.87)">${data.message}</p>
                                <hr>
                            </div>
                        </div>
                        `)
    });


    //Adding name to client and to list of users connected

    //Through hitting "enter"/"return" on keyboard (keycode 13)
    chatName.keypress( e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode == "13"){
            socket.emit("name_input", {chatName : chatName.val()});
            socket.on("get_users_connected", data => {
            let addToDOM = "";
            let alsoAddIt = "";
            for(let i=0;i<data.length;i++){
                addToDOM += `<li class="users-connected_list-item" style="color: ${data[i].color}">${data[i].username}</li>`;
                alsoAddIt += `<p id="user-connected">User [ ${data[i].username} ] connected</p>`;
            }
            usersConnected.html(addToDOM);
            chatOutput.html(alsoAddIt);
            })
        }
    });

    //Register when a user is hitting keyboard keys that are not with keycode 13
    chatInput.on("keypress", e => {
        let keycode = (e.keyCode ? e.keyCode : e.which);
        if(keycode != "13"){
            socket.emit("typing");
        }
    });

    // On register show that user is typing
    socket.on("typing", (data) => {
        chatOutput.html("<p><i>" + data.username + " is typing a message..." + "</i></p><hr>")
    });

    //On disconnect inform 
    socket.on("disconnect", (data) => {
        chatOutput.html("<p><i>" + data.username + " disconnected" + "</i></<p>")
    })
});
