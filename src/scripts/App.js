import React, { Component } from 'react';
import ListItem from './ListItem';
import '../css/App.css';

class App extends Component {
  render() {
    var a = ['a','b'];
    return (
      <div className="App">
        <ListItem title='test' peopleNames={a}/>
      </div>
    );
  }
}

export default App;
