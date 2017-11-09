import '../css/ListItem.css';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import Button from './Button';

export default class ListItem extends Component {
  render() {
    const {
      title,
      description,
      outingJoined,
      onClickJoin,
      onClickLeave,
      // classes
      disabled
    } = this.props;

    const classes = classNames('c-card__item', {
      'c-card__item--disabled': disabled
    });

    return (
      <li className={classes}>
        <h1>
          {title}
          {outingJoined
            ? <Button customClasses="outing-leave-button" xsm="true" title="LEAVE" error="true" onClick={onClickLeave}/>
            : <Button customClasses="outing-join-button" xsm="true" title="JOIN" info="true" onClick={onClickJoin}/>
          }
        </h1>
        <p>{description}</p>
      </li>
    );
  }
};

ListItem.prototypes = {
  title: PropTypes.string,
  outingJoined: PropTypes.bool,
  onClickJoin: PropTypes.function,
  onClickLeave: PropTypes.function,
  // classes
  disabled: PropTypes.bool
};
