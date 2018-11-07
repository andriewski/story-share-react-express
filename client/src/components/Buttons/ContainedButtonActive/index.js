import React, {Component} from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import deepPurple from '@material-ui/core/colors/deepPurple';
import grey from '@material-ui/core/colors/grey';

const stylesActive = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  cssRoot: {
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
});

class ContainedButtonActive extends Component{
  render() {
    const { classes, onClick, value, size } = this.props;
    return (
      <Button
        variant="contained"
        className={classNames(classes.margin, classes.cssRoot)}
        onClick={onClick}
        size={size}
      >
        {value}
      </Button>

    );
  }
}

ContainedButtonActive.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(stylesActive)(ContainedButtonActive);