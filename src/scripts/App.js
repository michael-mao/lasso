import * as firebase from 'firebase';
import React, { Component } from 'react';

import Button from './Button';
import ListItem from './ListItem';
import '../css/App.css';

const STAGE = Object.freeze({LOGIN: 1, LIST: 2, CREATE: 3});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      outings: [],
      stage: STAGE.LOGIN,
      outingName: '',
      outingTime: '',
      userEmail: '',
      userPassword: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.toggleCreateForm = this.toggleCreateForm.bind(this);

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

    firebase.auth().onAuthStateChanged(user => {
      if (user && user.email) {
        this.setState({
          userEmail: user.email,
          stage: STAGE.LIST
        });
      } else {
        console.log('No user');
      }
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
    this.setState({ stage: STAGE.CREATE });
  };

  handleSubmit(event) {
    let database = firebase.database();
    let outingsRef = database.ref('outings/');
    outingsRef.push({
      name: this.state.outingName.trim(),
      time: this.state.outingTime,
      participants: [this.state.userEmail]
    });
    this.setState({
      stage: STAGE.LIST
    });
    event.preventDefault();
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleLogin(event) {
    event.preventDefault();
    let email = this.state.userEmail;
    let password = this.state.userPassword;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({
          stage: STAGE.LIST
        });
      })
      .catch(error => {
        let errorCode = error.code;
        let errorMessage = error.message;

        // if user does not exist, create new user
        if (errorCode === 'auth/user-not-found') {
          firebase.auth().createUserWithEmailAndPassword(email, password)
        } else {
          console.log('Invalid login');
        }
    });
  }

  addParticipant(id) {
    let database = firebase.database();
    let outings = this.state.outings;
    let index = outings.findIndex(outing => {
      if (outing.id === id) {
        return outing;
      }
    });
    outings[index].participants.push(this.state.userEmail);
    let updates = {
      [`/outings/${id}/participants`]: outings[index].participants
    };
    database.ref().update(updates);
    this.setState({'outings': outings});
  }

  removeParticipant(id) {
    let database = firebase.database();
    let outings = this.state.outings;
    let index = outings.findIndex(outing => {
      if (outing.id === id) {
        return outing;
      }
    });
    let indexParticipant = outings[index].participants.indexOf(this.state.userEmail);
    outings[index].participants.splice(indexParticipant, 1);
    let updates = {
      [`/outings/${id}/participants`]: outings[index].participants
    };
    database.ref().update(updates);
    this.setState({'outings': outings});
  }

  render() {
    const outingItems = this.state.outings.map(outing => {
      return <ListItem id={outing.id}
                       key={outing.id}
                       title={`${outing.name} at ${outing.time}`}
                       right="true"
                       peopleNames={outing.participants}
                       outingJoined={outing.participants.includes(this.state.userEmail)}
                       onClickJoin={() => this.addParticipant(outing.id)}
                       onClickLeave={() => this.removeParticipant(outing.id)}/>;
    });
    // date string without year
    const dateString = new Date().toDateString().slice(0, -5);

    return (
      <div className="App">
        <h3 className="c-heading u-centered">Today is {dateString}</h3>

        { this.state.stage === STAGE.LOGIN
            ? <form onSubmit={this.handleLogin}>
                <div className="o-form-element">
                  <div className="c-input-group c-input-group--stacked">
                      <div className="o-field">
                          <input className="c-field" name="userEmail" placeholder="Email"
                            value={this.state.userEmail}
                            onChange={this.handleInputChange}/>
                      </div>
                      <div className="o-field">
                          <input className="c-field" name="userPassword" placeholder="Password" type="password"
                            value={this.state.userPassword}
                            onChange={this.handleInputChange}/>
                      </div>
                  </div>
                </div>
                <div className="o-form-element">
                  <button className="c-button c-button--brand c-button--block" type="submit">Login</button>
                </div>
              </form>
            : this.state.stage === STAGE.CREATE
            ? <div className="section">
                <form onSubmit={this.handleSubmit}>
                  <input type="text" name="outingName" value={this.state.outingName} onChange={this.handleInputChange} className="text-input" placeholder="Outing Name" />
                  <input type="time" name="outingTime" value={this.state.outingTime} onChange={this.handleInputChange} className="text-input" />
                  <div className="padded-section">
                    <Button full="true" className="text-input" success="true" title="OK" type="submit" />
                  </div>
                </form>
              </div>
            : <div>
                {outingItems}
                <div className="section">
                  <Button full="true" success="true" title="CREATE" onClick={this.toggleCreateForm} />
                </div>
              </div>
        }
      </div>
    );
  }
}

export default App;
