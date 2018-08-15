import React, { Component } from "react";
import ReactDOM from "react-dom";
import { isEmpty } from "lodash";
import openSocket from 'socket.io-client';
import { Observable } from "rxjs";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      text: "",
      joinedChat: false,
      messageList: [],
      numUsers: 0
    };
    this.joinChat = this.joinChat.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  joinChat() {
    // Opens connection to socket
    const socket = openSocket("http://localhost:3000");

    // Creates an observable that executes data from socket when it gets a socketId event
    var socketConnectObservable = Observable.create(observer => {
      socket.on("socketId", data => { observer.next(data); });
    });

    socketConnectObservable.subscribe(data => {
      socket.emit("client connect", {
        socketId: data.socketId
      });
    });

    var socketUsersObservable = Observable.create(observer => {
      socket.on("users", data => { observer.next(data) });
    });

    socketUsersObservable.subscribe(data => {
      this.setState({ numUsers: data.length });
    });

    var socketMessagesObservable = Observable.create(observer => {
      socket.on("message", data => { observer.next(data) });
    });

    socketMessagesObservable.subscribe(data => {
      this.setState(prevState => {
        const newMessageList = prevState.messageList.concat(data.text);
        return { messageList: newMessageList };
      });
    });

    this.setState({ joinedChat: true });
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  sendMessage() {
    fetch("http://localhost:3000/message", {
      method: "POST",
      body: JSON.stringify({ text: this.state.text }),
      headers: {
        "content-type": "application/json"
      }
    }).then(function(res) {
      this.setState({ text: "" });
    }).catch(function() {
      console.log("sendmessage failed");
    });
  }

  render() {
    return (
      <div>
        <h1>Notar-chat</h1>
        <div>Number of Users in chat: {this.state.numUsers}</div>
        <div>Your name is: {this.state.name}</div>
        {
          (this.state.joinedChat && !isEmpty(this.state.name)) ?
            <div>
              <div>
                <label>
                  Talk in chat:
                  <input type="text" value={this.state.text} onChange={this.handleTextChange} placeholder="text" />
                </label>
                <button onClick={this.sendMessage}>send</button>
              </div>
              Messages
              <div>
                {
                  this.state.messageList.map(function(message) {
                    return <div>{message}</div>
                  })
                }
              </div>
            </div> :
            <div>
              <label>
                Choose your display name:
                <input type="text" value={this.state.name} onChange={this.handleChange} placeholder="name" />
              </label>
              <button onClick={this.joinChat}>join chat</button>
            </div>
        }
      </div>
    );
  }
}
export default App;

ReactDOM.render(<App />, document.getElementById('notarchat'));
