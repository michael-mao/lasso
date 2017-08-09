import '../css/ListItem.css';
import React, { Component, PropTypes } from 'react';
import Button from './Button'

export default class ListItem extends Component {
  render() {
    const {
      id,
      title,
      right,
      peopleNames,
      onClick
    } = this.props;

    const people = peopleNames.map(function(name, index) {
      return <li key={index} className="c-list__item">{name}</li>;
    });

    return (
      <div className="c-card c-card--accordion u-high">
        <input type="checkbox" id={id} />
        <label className="c-card__item" htmlFor={id}>
          {title}
          <Button right={right} xsm="true" title="+" info="true" rounded="true" onClick={onClick}/>
        </label>

        <div className="c-card__item">
          <ul className="c-list c-list--unstyled">
            {people}
          </ul>
        </div>
      </div>
    );
  }
};

ListItem.prototypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  right: PropTypes.bool,
  peopleNames: PropTypes.object,
  onClick: PropTypes.function
};
