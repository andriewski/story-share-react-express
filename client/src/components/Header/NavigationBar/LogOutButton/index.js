import React, { Component } from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import grey from '@material-ui/core/colors/grey';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  cssRootInactive: {
    minWidth: 60,
    color: grey[900],
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

class LogOutButton extends Component {

  handleClick = () => {
    localStorage.clear();
    if (window.location.pathname === '/messages' || window.location.pathname.slice(1,5) === 'chat') {
      window.location.replace('/home#0')
    } else {
      document.location.reload(true);
    }
  };

  render() {
    const {classes} = this.props;

    return (
      <Button
        variant="contained"
        className={classNames(classes.margin, classes.cssRootInactive)}
        onClick={this.handleClick}
      >
        <FontAwesomeIcon icon={faSignOutAlt} />
        <span>Log out</span>
      </Button>
    );
  }
}

LogOutButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LogOutButton);