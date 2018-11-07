import React, { Component } from 'react';
import './style.css';
import io from 'socket.io-client';
import ContainedButtonActive from '../Buttons/ContainedButtonActive';
import TextField from '../TextField';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import deeppurple from '@material-ui/core/colors/deepPurple';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
    marginLeft: 5,
    width: 40,
    height: 40,
    float: 'left',
  },
  card: {
    minWidth: 320,
    maxWidth: 620,
    margin: '30px auto 0px',
  },
  cardContent: {
    padding: 0,
  }
};

class SocketChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messageValue: '',
      chatHistory: null,
      sender: localStorage.user ? JSON.parse(localStorage.user) : null,
      receiver: null,
    };

    this.socket = io.connect('http://localhost:5000');
    this.socket.on('sendMessage', resp => {

      navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
      /*sender === current user, senderID - who sent the message */
      if (navigator.vibrate && (resp.senderID !== this.state.sender.id)) {
        navigator.vibrate(400);
      }

      let array = this.state.chatHistory;
      array.push(resp);
      this.setState({
        textAreaValue : '',
        chatHistory: array,
      });
      document.querySelector('#chat-messages > li:last-child').scrollIntoView();
    });
  }

  handleMessageChange = (event) => {
    this.setState({
      messageValue: event.target.value,
    });
  };

  componentDidMount() {
    if (localStorage.user) {
      const data = {
        senderID : JSON.parse(localStorage.user).id,
        receiverID : window.location.pathname.slice(6),
      };
      this.socket.emit('startDialog', data);
      this.socket.on('startDialog', res => {
        this.setState({
          receiver : res[0],
          chatHistory : res[1],
        });
        document.querySelector('#chat-messages > li:last-child').scrollIntoView();
      });
    } else {
      this.props.history.replace('/home#0');
    }
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  handleSendMessage = (e) => {
    if (localStorage.user && this.state.messageValue.trim()) {
      this.setState({
        messageValue: '',
      });
      const user = JSON.parse(localStorage.user);
      const data = {
        senderID: user.id,
        receiverID: window.location.pathname.slice(6),
        name: user.name,
        text: this.state.messageValue,
        date: Date.now(),
        senderAvatar: user.avatar,
      };
      this.socket.emit('sendMessage', data);
    }
  };

  render() {
    const { classes } = this.props;
    const dateFormat = require('dateformat');
    const date = dateFormat("d");
    let currentDate = null;
    let lastDate = null;
    return (
      <div>
        {
          localStorage.user
          && <Card className={classes.card}>
            {
              this.state.chatHistory === null
                ? <CircularProgress
                  style={{display: 'block', margin: '100px auto', color: deeppurple[500]}}
                  size={200}
                  thickness={2}
                />
                :
                <CardContent className={classes.cardContent}>
                  <ul id="chat-messages" className="chat-messages">
                    {
                      this.state.chatHistory.length === 0
                        ? <li className="no-messages-chat">You have no messages with this user</li>
                        : this.state.chatHistory.map((comment, i) => {
                            if (currentDate !== dateFormat(comment.date, "d")) {
                              lastDate = currentDate;
                              currentDate = dateFormat(comment.date, "d");
                            } else {
                              lastDate = currentDate;
                            }
                          return (
                            <li key={i} className="chat-message clearfix">
                              {
                                currentDate !== lastDate &&
                                <div className="chat-message__day">
                                  {date === dateFormat(comment.date, "d")
                                    ? 'Today'
                                    : dateFormat(comment.date, "mmmm dS")
                                  }
                                </div>
                              }
                              <Avatar
                                alt="User Avatar"
                                src={
                                  comment.senderID === this.state.sender.id
                                    ? this.state.sender.avatar
                                    : this.state.receiver.avatar
                                }
                                className={classNames(classes.avatar)}
                              />
                              <span className="chat__user-name">{comment.name}</span>
                              <span className="chat__date">
                                {dateFormat(comment.date, "h:MM TT")}
                              </span>
                              <span className="chat__user-text">{comment.text}</span>
                            </li>
                          );
                        })
                    }
                  </ul>
                  <div className="message-form-wrapper">
                    <form action="" id="message-form" className="message-form">
                      <TextField
                        id="user-chat-message"
                        required={false}
                        label={'Your Story'}
                        handleParentChange={this.handleMessageChange}
                        value={this.state.messageValue}
                        multiline={true}
                        rows={2}
                      />
                    </form>
                    <ContainedButtonActive
                      id="submit-button"
                      value={'Send'}
                      onClick={this.handleSendMessage}
                    />
                  </div>
                </CardContent>
            }
            </Card>
        }
      </div>
    );
  }
}
SocketChat.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SocketChat);