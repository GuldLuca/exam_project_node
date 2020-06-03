const express = require("express");
const someColor = require("randomcolor");
const sequelize = require("sequelize");

const DB = require("./util/database");
const User = require("./models/user");
const Message = require("./models/message");

//Listen on port 3000
const app = express();
const server = app.listen(process.env.PORT || 4000);

//Middleware look for files in associated folder to run
app.use(express.static("public"));
app.set("views", "views");

//Route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/chat/index.html");
});

//socket.io setup and instantiaze
const io = require("socket.io")(server);

//Making empty arrays to store connections and users from socket
let users = [];
let connnections = [];

//This whole block listens on every connection made
io.on("connection", (socket) => {
    connnections.push(socket);
    
    let color = someColor();
    socket.color = color;

    socket.username = "NoName";

    //This block listens on name_input from user
    socket.on("name_input", data => {
        socket.username = data.chatName;
        users.push({
            username: socket.username,
            color: socket.color
        });

        updateUsersConnected();

        //Create a User in db with username from socket
        User.create({
            username: socket.username
        });
    })

    //function to update the list of users connected in the front
    const updateUsersConnected = () => {
        io.sockets.emit("get_users_connected", users);
    }

    //Block of code that listens on new_input from users
    socket.on("new_input", (data) => {

        io.sockets.emit("new_input", {
            message : data.message,
            username : socket.username,
            color: socket.color
        });

        //Creating new message in db
        Message.create({
            from: socket.username,
            message: data.message,
            time: new Date().getTime()
        });
    })

    //Listening on typing from users
    socket.on("typing", () => {
        socket.emit("typing",{username: socket.username});
    })

    //Listens on disconnect
    socket.on("disconnect", () => {

        //Finding the user that has disconnected - in the users array
        //Then update the list of users connected without the user found
        let user = undefined;

        // if element(user) on index with username is equal to the username from socket, that user is found / equal to user on index
        for(let i= 0;i<users.length;i++){
            if(users[i].username === socket.username){
                user = users[i];
                break;
            }
        }

        //change users array to array where condition is met - where parameter x isnt equal to user found
        users = users.filter( x => x !== user);
        
        updateUsersConnected();

        //Changing original array, removing 1 element on index socket and returns removed element
        connnections.splice(connnections.indexOf(socket),1);

        //Emit to all that the found user was disconnected
        io.emit("disconnect", {username: socket.username});

    })
})

//Database associations

User.hasMany(Message);
Message.belongsTo(User);

//Sequelize sync
sequelize
DB.sync({force: true})
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        return user;
    })
    .catch(err => console.log(err));
