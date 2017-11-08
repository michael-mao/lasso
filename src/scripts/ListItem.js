import '../css/ListItem.css';
import React, { Component, PropTypes } from 'react';
import Button from './Button';

export default class ListItem extends Component {
  render() {
    const {
      id,
      title,
      peopleNames,
      outingJoined,
      onClickJoin,
      onClickLeave
    } = this.props;

    const people = peopleNames ? peopleNames.map(function(name, index) {
      return <li key={index} className="c-list__item">{name}</li>;
    }) : '';

    return (
      <div className="c-card c-card--accordion u-high">
        <input type="checkbox" id={id} />
        <label className="c-card__item" htmlFor={id}>
          {title}
          {outingJoined
            ? <Button customClasses="outing-leave-button" xsm="true" title="LEAVE" error="true" onClick={onClickLeave}/>
            : <Button customClasses="outing-join-button" xsm="true" title="JOIN" info="true" onClick={onClickJoin}/>
          }
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
  peopleNames: PropTypes.object,
  outingJoined: PropTypes.bool,
  onClickJoin: PropTypes.function,
  onClickLeave: PropTypes.function
};
