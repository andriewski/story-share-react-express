import React, { Component } from 'react';
import './style.css';
import Stories from './Stories';
import StoryEditor from './StoryEditor';

class MainPage extends Component {
  render() {
    return (
      <div className="content">
        <StoryEditor changeLocation={this.props.history.push} />
        <Stories/>
      </div>
    );
  }
}

export default MainPage;
