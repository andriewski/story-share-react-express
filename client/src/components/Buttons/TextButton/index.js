import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import deepPurple from '@material-ui/core/colors/deepPurple';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  cssRoot: {
    color: deepPurple[500],
    fontSize: '18px',
    textTransform: 'none',
  },
});

class TextButton extends Component {
  render() {
    const { classes, value, onClick } = this.props;

    return (
      <div>
        <Button
          className={classes.cssRoot}
          onClick={onClick}
        >
          {value}
        </Button>
      </div>
    );
  }
}

TextButton.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextButton);