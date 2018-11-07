import React, {Component} from 'react';
import './style.css';
import logo from '../../../../assets/logo.svg';
import logo_250 from '../../../../assets/logo_250.png';

class RegistrationLogo extends Component {

  render() {
    return (
        <div className="registration-logo">
          <link
            href="https://fonts.googleapis.com/css?family=Gloria+Hallelujah"
            rel='stylesheet'
            type='text/css'
          />
          <object aria-label="logo" type="image/svg+xml" data={logo}>
            <img src={logo_250} alt="logo"/>
          </object>
          <span className="registration-logo-name">StoryShare</span>
        </div>
    );
  }
}

export default RegistrationLogo;