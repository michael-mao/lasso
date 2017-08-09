import '../css/ListItem.css';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Button from './Button'

export default class ListItem extends Component {
  render() {
    const {
      title,
      right,
      peopleNames,
      onClick
    } = this.props;

    const classes = classNames('', {
      'right': right
    });

    const people = peopleNames.map(function(name) {
      return <li className="c-list__item">name</li>;
    });

    return (
      <div className="c-card c-card--accordion u-high">
        <input type="checkbox" id="accordion-1" />
        <label className="c-card__item" htmlFor="accordion-1">
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
  title: PropTypes.string,
  right: PropTypes.bool,
  peopleNames: PropTypes.object,
  onClick: PropTypes.function
};