import React, { Component } from 'react';
import RegistrationButton from './RegistrationButton';
import LogOutButton from './LogOutButton';
import './style.css';

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn : !!localStorage.user,
    };
  }

  handleUserStatus = () => {
    this.setState({
      userLoggedIn : !this.state.userLoggedIn,
    });
  };

  render() {

    return (
      <ul className="navigation-bar">
        <li>
          {
            localStorage.user
              ? <LogOutButton/>
              : <RegistrationButton/>
          }
        </li>
      </ul>
    );
  }
}

export default NavigationBar;