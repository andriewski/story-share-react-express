import React, {Component} from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import grey from '@material-ui/core/colors/grey';

const stylesInactive = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  cssRoot: {
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

class ContainedButtonInactive extends Component{
  render() {
    const { classes, onClick, value } = this.props;
    return (
      <Button
        variant="contained"
        className={classNames(classes.margin, classes.cssRoot)}
        onClick={onClick}
      >
        {value}
      </Button>

    );
  }
}

ContainedButtonInactive.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(stylesInactive)(ContainedButtonInactive);