import React, {Component} from 'react';
import './style.css';
import logo from '../../../assets/logo.svg';
import logo_150 from '../../../assets/logo_150.png';

class Logo extends Component {

  render() {
    return (
        <div className="logo">
          <link
            href="https://fonts.googleapis.com/css?family=Gloria+Hallelujah"
            rel='stylesheet'
            type='text/css'
          />
          <object aria-label="logo" type="image/svg+xml" data={logo}>
            <img src={logo_150} alt="logo"/>
          </object>
          <span className="logo-name">StoryShare</span>
        </div>
    );
  }
}

export default Logo;