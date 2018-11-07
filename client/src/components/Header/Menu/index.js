import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComment, faComments, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './style.css';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import deepPurple from '@material-ui/core/colors/deepPurple';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  cssRootActive: {
    minWidth: 60,
    color: grey[50],
    fontSize: '18px',
    textTransform: 'none',
    backgroundColor: deepPurple[500],
    '&:hover': {
      color: grey[300],
      backgroundColor: deepPurple[600],
    },
    '&:active': {
      color: grey[400],
      backgroundColor: deepPurple[700],
    },
  },
  cssRootInactive: {
    minWidth: 60,
    color: grey[900],
    fontSize: '18px',
    textTransform: 'none',
    backgroundColor: grey[300],
    '&:hover': {
      color: grey[900],
      backgroundColor: grey[400],
    },
    '&:active': {
      color: grey[900],
      backgroundColor: grey[500],
    },
  },
});


class Menu extends Component {

  render() {
    const {classes} = this.props;

    return (
      <ul className="menu">
        <li>
          <Link
            to={`/`}
          >
            {
              window.location.pathname === '/home'
                ? <Button
                    variant="contained"
                    className={classNames(classes.margin, classes.cssRootActive)}
                  >
                    <FontAwesomeIcon icon={faHome}/>
                    <span>Home</span>
                  </Button>
                : <Button
                    variant="contained"
                    className={classNames(classes.margin, classes.cssRootInactive)}
                  >
                    <FontAwesomeIcon icon={faHome}/>
                    <span>Home</span>
                  </Button>
            }
          </Link>
        </li>
        <li>
          {
            <Link to={`${localStorage.user ? '/messages' : '/login?messages'}`}>
              {
                window.location.pathname === '/messages'
                  ? <Button
                      variant="contained"
                      className={classNames(classes.margin, classes.cssRootActive)}
                    >
                      <FontAwesomeIcon icon={faEnvelope}/>
                      <span>Messages</span>
                    </Button>
                  : <Button
                      variant="contained"
                      className={classNames(classes.margin, classes.cssRootInactive)}
                    >
                      <FontAwesomeIcon icon={faEnvelope}/>
                      <span>Messages</span>
                    </Button>
              }
            </Link>
          }
        </li>
        {
          window.location.pathname.indexOf('/story') !== -1 &&
          <li>
            <Button
              variant="contained"
              className={classNames(classes.margin, classes.cssRootActive)}
            >
              <FontAwesomeIcon icon={faComment}/>
              <span>Story</span>
            </Button>
          </li>
        }
        {
          window.location.pathname.indexOf('/chat') !== -1 &&
          <li>
            <Button
              variant="contained"
              className={classNames(classes.margin, classes.cssRootActive)}
            >
              <FontAwesomeIcon icon={faComments}/>
              <span>Chat</span>
            </Button>
          </li>
        }
      </ul>
    );
  }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);
