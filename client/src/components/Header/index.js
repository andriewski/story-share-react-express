import React, { Component } from 'react';
import Menu from './Menu';
import NavigationBar from './NavigationBar';
import Logo from './Logo';
import './style.css';

class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="navigation">
          <Menu/>
          <NavigationBar/>
        </div>
          <Logo/>
      </div>
    );
  }
}

export default Header;
