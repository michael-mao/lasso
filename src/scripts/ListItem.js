import React, { Component } from 'react';
import '../css/ListItem.css';
import Button from './Button'

class ListItem extends Component {
  render() {
    const {
      title,
      peopleNames
    } = this.props;

    function onClick() {
      console.log('add current person to this outing');
    }

    return (
      <div className="c-card c-card--accordion u-high">
        <input type="checkbox" id="accordion-1"/>
        <label className="c-card__item" htmlFor="accordion-1">{title}</label>
        <div className="c-card__item">
          {peopleNames}
        </div>
      </div>
    );
  }
}

export default ListItem;
