import '../css/Button.css';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Button extends Component {
  render() {
    const {
      title,
      onClick,
      type,
      value,

      full,
      xsm,
      right,

      rounded,
      info,
      success,
      error,
      customClasses
    } = this.props;

    const classes = classNames('c-button', {
      'c-button--rounded': rounded,
      'c-button--info': info,
      'c-button--success': success,
      'c-button--error': error,
      'full': full,
      'right': right,
      'u-xsmall': xsm
    }, customClasses);

    return (
      <button type={type} value={value} className={classes} onClick={onClick}>{title}</button>
    );
  }
};

Button.prototypes = {
  title: PropTypes.string,
  onClick: PropTypes.function,
  type: PropTypes.string,
  value: PropTypes.string,

  full: PropTypes.bool,
  xsm: PropTypes.bool,
  right: PropTypes.bool,

  rounded: PropTypes.bool,
  info: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
  customClasses: PropTypes.array
};

