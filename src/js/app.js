import React, { Component } from "react";
import ReactDOM from "react-dom";
import { isEmpty } from "lodash";
class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      joinedChat: false,
      messageList: []
    };
    this.joinChat = this.joinChat.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  joinChat() {
    this.setState({ joinedChat: true });
  }

  handleChange(event) {
    console.log("meow", event);
    this.setState({ name: event.target.value });
  }

  render() {
    console.log("currentState:", this.state);
    return (
      <div>
        <h1>Notar-chat</h1>
        <div>Your name is: {this.state.name}</div>
        {
          (this.state.joinedChat && !isEmpty(this.state.name)) ?
            <div>
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
