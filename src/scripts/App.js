import * as firebase from 'firebase';
import React, { Component } from 'react';
import Button from './Button';
import ListItem from './ListItem';
import '../css/App.css';
import * as moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outings: [],
      showCreateForm: false,
      name: '',
      time: ''
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // Initialize Firebase
    let config = {
      apiKey: "AIzaSyDZhnXsQIOxJz-fkRh1W2vXQPGrUpJkX3w",
      authDomain: "lasso-4b1e2.firebaseapp.com",
      databaseURL: "https://lasso-4b1e2.firebaseio.com",
      projectId: "lasso-4b1e2",
      storageBucket: "lasso-4b1e2.appspot.com",
      messagingSenderId: "279090645839"
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
  
  toggleCreateForm() {
    this.setState({ showCreateForm: !this.state.showCreateForm });
  };

  writeUserData(name, time) {
    let database = firebase.database();
    let outingsRef = database.ref('outings/');
    outingsRef.push({
      name: name.trim(),
      time: time
    });
  };

  handleNameChange(event) {
    this.setState({ name: event.target.value });
  }

  handleTimeChange(event) {
    this.setState({ time: event.target.value });
  }

  handleSubmit(event) {
    this.writeUserData(this.state.name, this.state.time);
    this.toggleCreateForm();
    event.preventDefault();
  };

  render() {
    const outingItems = this.state.outings.map(outing => {
      return <ListItem id={outing.id}
                       key={outing.id}
                       title={`${outing.name} at ${outing.time}`}
                       peopleNames={outing.people}
                       right="true"/>;
    });

    let toggleCreateForm = () =>
      this.setState({ showCreateForm: !this.state.showCreateForm });

    return (
      <div className="App">
        <h3 className="c-heading u-centered">Wed Oct 24</h3>
        

        { this.state.showCreateForm
            ? <div className="section">
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="name"  value={this.state.name} onChange={this.handleNameChange} className="text-input" placeholder="Outing Name" />
                  <input type="time"  value={this.state.time} onChange={this.handleTimeChange} className="text-input" />
                  <div className="padded-section">
                    <Button full="true" className="text-input" success="true" title="OK" type="submit" />
                  </div>
                </form>
              </div>
            : <div>
                {outingItems}
                <div className="section">
                  <Button full="true" success="true" title="CREATE" onClick={toggleCreateForm} />
                </div>
              </div>
        }
      </div>
    );
  }
}

export default App;
