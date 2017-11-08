import * as firebase from 'firebase';
import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete'


import Button from './Button';
import ListItem from './ListItem';
import '../css/App.css';

const STAGE = Object.freeze({LOGIN: 1, LIST: 2, CREATE: 3});

class App extends Component {
  constructor(props) {
    super(props);
    this.chrome = this.props.chrome;
    this.state = {
      outings: [],
      stage: STAGE.LOGIN,
      outingName: '',
      outingTime: '',
      outingNameError: '',
      outingTimeError: '',
      userEmail: '',
      userPassword: '',
      address: ''
    };
    this.onLocationChange = this.onLocationChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.setStage = this.setStage.bind(this);
    this.timeStringToDate = this.timeStringToDate.bind(this);

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
      this.chrome.storage.sync.set({outings: outings}, (data) => {
        console.log('saved outings to local storage');
      });
    });
  }

  componentWillUnmount() {
    // detach listeners
    firebase.database().off();
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        timeString : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      })
    }, 1000);
  }

  setStage(stage) {
    this.setState({ stage: stage });
  };

  // timeString - format of '15:00'
  timeStringToDate(timeString) {
    var now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      timeString.substr(0, 2),
      timeString.substr(3, 5)
    );
  }
  
  handleSubmit(event) {
    var now = new Date();
    let outingName = this.state.outingName.trim();
    var outingTime = this.state.outingTime.length > 0
      ? this.timeStringToDate(this.state.outingTime)
      : false;

    if (outingName.length === 0) {
      this.setState({
        outingNameError: 'Name is required'
      });
      event.preventDefault();
      return;
    } else if (this.state.outings.find(outing => outing.name === outingName)) {
      this.setState({
        outingNameError: 'Name already exists'
      });
      event.preventDefault();
      return;
    } else if (this.state.outingTime.length === 0) {
      this.setState({
        outingTimeError: 'Time is required'
      });
      event.preventDefault();
      return;
    } else if (outingTime < now) {
      this.setState({
        outingTimeError: 'Time should be in the future'
      });
      event.preventDefault();
      return;
    }
    let database = firebase.database();
    let outingsRef = database.ref('outings/');
    outingsRef.push({
      name: outingName,
      time: this.state.outingTime,
      location: this.state.address,
      participants: [this.state.userEmail]
    });
    this.setState({
      stage: STAGE.LIST,
      outingName: '',
      outingTime: '',
      outingNameError: '',
      outingTimeError: ''
    });
    event.preventDefault();
  };

  onLocationChange(address) {
    this.setState({ address });
  }

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
                       title={`${outing.name} at ${this.timeStringToDate(outing.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                       right="true"
                       peopleNames={outing.participants}
                       outingJoined={outing.participants && outing.participants.includes(this.state.userEmail)}
                       onClickJoin={() => this.addParticipant(outing.id)}
                       onClickLeave={() => this.removeParticipant(outing.id)}/>;
    });
    const inputProps = {
      value: this.state.address,
      onChange: this.onLocationChange,
    }

    // date string without year
    const dateString = new Date().toDateString().slice(0, -5);

    return (
      <div className="App">
        <h3 className="c-heading u-centered">Today is {dateString}</h3>
        <h4 className="u-centered">{this.state.timeString}</h4>

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
                  { this.state.outingNameError !== ''
                      ? <small className="error">{this.state.outingNameError}</small>
                      : false
                  }
                  <input type="time" name="outingTime" value={this.state.outingTime} onChange={this.handleInputChange} className="text-input" />
                  { this.state.outingTimeError !== ''
                      ? <small className="error">{this.state.outingTimeError}</small>
                      : false
                    }
                  <div className="text-input"><PlacesAutocomplete inputProps={inputProps} /></div>
                  <div className="padded-section">
                    <Button full="true" className="text-input" success="true" title="OK" type="submit" />
                    <Button full="true" title="CANCEL" onClick={() => this.setStage(STAGE.LIST)} />
                  </div>
                </form>
              </div>
            : <div>
                {outingItems}
                <div className="section">
                  <Button full="true" success="true" title="CREATE" onClick={() => this.setStage(STAGE.CREATE)} />
                </div>
              </div>
        }
      </div>
    );
  }
}

export default App;
