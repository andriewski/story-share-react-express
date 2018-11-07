import React, { Component } from 'react';
import io from 'socket.io-client';
import './style.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import deeppurple from '@material-ui/core/colors/deepPurple';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  smallAvatar: {
    marginRight: 10,
    width: 40,
    height: 40,
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  card: {
    minWidth: 320,
    maxWidth: 620,
    margin: '30px auto',
  },
  cardContent: {
    padding: 0,
  }
};

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatHistory: null,
      sender: localStorage.user ? JSON.parse(localStorage.user) : null,
    };

    this.socket = io.connect('http://localhost:5000');
    this.socket.on('sendMessage', resp => {

      navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
      /*sender === current user, senderID - who sent the message */
      if (navigator.vibrate && (resp.lastMessageUserID !== this.state.sender.id)) {
        navigator.vibrate(400);
      }

      let array = this.state.chatHistory;

      if (array.length === 0) {
        array.push(resp)

      } else {
        for (let i = 0; i < array.length; i++) {
          if ((array[i].receiverID === resp.receiverID && array[i].senderID === resp.senderID)) {
            array[i].text = resp.text;
            array[i].date = resp.date;
            array[i].senderID = resp.senderID;
            array[i].receiverID = resp.receiverID;
            array[i].lastMessageUserID = resp.lastMessageUserID;
            break;
          }
          if (i === array.length - 1) {
            array.push(resp);
            break;
          }
        }
      }

      array.sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } else {
          return -1;
        }
      });

      this.setState({
        chatHistory: array,
      });
    });

    this.socket.on('viewMessages', res => {
      const chatHistory = res;

      chatHistory.sort((a, b) => {
        if (a.date < b.date) {
          return 1;
        } else {
          return -1;
        }
      });

      this.setState({
        chatHistory : chatHistory,
      });
    });
  }

  componentDidMount() {
    if (localStorage.user) {
      const data = {
        userID : JSON.parse(localStorage.user).id,
      };
      this.socket.emit('viewMessages', data);
    } else {
      this.props.history.replace('/home#0');
    }
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  render() {
      const {classes} = this.props;
      const dateFormat = require('dateformat');
      const currentUser = localStorage.user ? JSON.parse(localStorage.user) : null;
      const date = dateFormat("d");
      return (
        <div>
          {
            currentUser
            && <Card className={classes.card}>
                {
                this.state.chatHistory === null
                  ? <CircularProgress
                      style={{display: 'block', margin: '100px auto', color: deeppurple[500]}}
                      size={200}
                      thickness={2}
                    />
                  : <CardContent className={classes.cardContent}>
                    {
                      this.state.chatHistory.length === 0
                        ? <div className="no-messages">You have no messages yet</div>
                        : <ul className="messages">
                          {
                            this.state.chatHistory.map((comment, i) => {
                              return (
                                <li
                                  key={i}
                                  className="message clearfix"
                                >
                                  <Link to={`/chat/${comment.receiverID}`} className="message-link">
                                    <div className="message__receiver-avatar">
                                      <Avatar
                                        alt="User Avatar"
                                        src={comment.receiverAvatar}
                                        className={classNames(classes.bigAvatar)}
                                      />
                                    </div>
                                    <div className="message__dialog-content clearfix">
                                      <span className="message__receiver-name">
                                        {comment.receiverName}
                                      </span>
                                      {
                                        currentUser.id === comment.lastMessageUserID
                                        && <div className="message__last-message-avatar">
                                          <Avatar
                                            alt="User Avatar"
                                            src={currentUser.avatar}
                                            className={classNames(classes.smallAvatar)}
                                          />
                                        </div>
                                      }
                                      <span className="message__last-message-text">{comment.text}</span>
                                    </div>
                                    <span className="message__last-message-date">
                                      {date === dateFormat(comment.date, "d")
                                        ? dateFormat(comment.date, "h:MM TT")
                                        : dateFormat(comment.date, "h:MM TT, mmmm dS")
                                      }
                                    </span>
                                  </Link>
                                </li>
                              );
                            })
                          }
                        </ul>
                    }
                    </CardContent>
                }
               </Card>
          }
        </div>
      );
  }
}
Messages.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Messages);