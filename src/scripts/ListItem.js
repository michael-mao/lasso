import React, { Component } from 'react';
import logo from './logo.svg';
import '../css/ListItem.css';

class ListItem extends Component {
  render() {
    return (
      <div className="ListItem">
        <div className="ListItem-header">
          <h2>Welcome to React</h2>
        </div>
        <p className="ListItem-intro">
          To get started, edit <code>src/ListItem.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default ListItem;
