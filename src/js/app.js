import React, { Component } from "react";
import ReactDOM from "react-dom";
class App extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
  }
  render() {
    return (
      <div>MEOW</div>
    );
  }
}
export default App;

ReactDOM.render(<App />, document.getElementById('notarchat'));
