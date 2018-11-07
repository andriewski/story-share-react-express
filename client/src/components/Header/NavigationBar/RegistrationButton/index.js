import React, { Component } from 'react';
import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
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
});

class RegistrationButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen : false,
    };
  }

  render() {
    const {classes} = this.props;

    return (
      <Link
        to={window.location.hash
          ? `/login/?${window.location.pathname.slice(1)+window.location.search+window.location.hash}`
          : `/login/?${window.location.pathname.slice(1)}`
        }
      >
        <Button
          variant="contained"
          className={classNames(classes.margin, classes.cssRootActive)}
          onClick={this.handleClick}
        >
          <FontAwesomeIcon icon={faSignInAlt}/>
          <span>Log in</span>
        </Button>
      </Link>
    );
  }
}

RegistrationButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistrationButton);