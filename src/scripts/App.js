import * as firebase from 'firebase';
import React, { Component } from 'react';
import Button from './Button';
import ListItem from './ListItem';
import '../css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outings: []
    };

    // Initialize Firebase
    let config = {

    };
    firebase.initializeApp(config);

    firebase.auth().signInAnonymously().catch(error => {
      let errorCode = error.code;
      let errorMessage = error.message;
      console.log('ERROR:', errorCode, errorMessage);
    });
  }

  componentWillMount() {
    let database = firebase.database();
    let outingsRef = database.ref('outings/');

    // listen for changes
    outingsRef.on('value', snapshot => {
      let outings = [];
      let data;
      snapshot.forEach(child => {
        data = child.val();
        data.id = child.key;
        outings.push(data);
      });
      this.setState({
        outings: outings
      });
    });
  }

  componentWillUnmount() {
    // detach listeners
    firebase.database().off();
  }

  render() {
    const outingItems = this.state.outings.map(outing => {
      return <ListItem id={outing.id}
                       key={outing.id}
                       title={outing.name}
                       peopleNames={outing.people}
                       right="true"/>;
    });

    return (
      <div className="App">
        <h3 className="c-heading u-centered">Wed Oct 24</h3>

        {outingItems}

        <div>
          <Button full="true" success="true" title="CREATE" />
        </div>
      </div>
    );
  }
}

export default App;
