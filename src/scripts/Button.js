import '../css/Button.css';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

export default class Button extends Component {
  render() {
    const {
      title,
      onClick,

      full,
      xsm,
      right,

      rounded,
      info,
      success,
      error,
    } = this.props;

    const classes = classNames('c-button', {
      'c-button--rounded': rounded,
      'c-button--ghost-info': info,
      'c-button--ghost-success': success,
      'c-button--ghost-error': error,
      'full': full,
      'right': right,
      'u-xsmall': xsm
    });

    return (
      <button className={classes} onClick={onClick}>{title}</button>
    );
  }
};

Button.prototypes = {
  title: PropTypes.string,
  onClick: PropTypes.function,

  full: PropTypes.bool,
  xsm: PropTypes.bool,
  right: PropTypes.bool,

  rounded: PropTypes.bool,
  info: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool
};

