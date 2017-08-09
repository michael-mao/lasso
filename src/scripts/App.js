import * as firebase from 'firebase';
import React, { Component } from 'react';
import Button from './Button';
import ListItem from './ListItem';
import '../css/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // Initialize Firebase
    var config = {
    };
    firebase.initializeApp(config);

    firebase.auth().signInAnonymously().catch(function(error) {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log('ERROR:', errorCode, errorMessage);
    });
  }

  render() {
    var a = ['a','b'];
    return (
      <div className="App">
        <h3 className="c-heading u-centered">Wed Oct 24</h3>
        <ListItem title='test' peopleNames={a} right="true"/>
        <div>
          <Button full="true" success="true" title="CREATE" />
        </div>
      </div>
    );
  }
}

export default App;
