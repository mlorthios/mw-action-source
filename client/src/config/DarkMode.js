import { useStateValue, StateContext } from '../reducer/config';

import React, { Component } from 'react';
export default class ThemedButton extends Component {
  static contextType = StateContext;

  callDarkMode() {
    const [{ theme }, dispatch] = this.context;
    dispatch({
        type: 'changeTheme',
        newTheme: { mode: 'blue'}
      })
  }
}