import React, { Component } from 'react';
import RegistrationLogo from './ReristrationLogo';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import './style.css';

class RegistrationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal : true,
      loginFormActive : true,
    };
  }

  handleClick = i => {
    this.setState({
      loginFormActive : !this.state.loginFormActive,
    });
  };

  render() {
    return (
      <div className="modal-wrapper">
        <div className="login-form-wrapper">
          <RegistrationLogo/>
          {
            this.state.loginFormActive
              ? <LoginForm
                  onClick={this.handleClick}
                  changeLocation={this.props.history.push}
                />
              : <RegistrationForm
                  onClick={this.handleClick}
                />
          }
        </div>
      </div>
    );
  }
}

export default RegistrationModal;