import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import deepPurple from '@material-ui/core/colors/deepPurple';

const styles = theme => ({
  cssLabel: {
    '&$cssFocused': {
      color: deepPurple[500],
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:after': {
      borderBottomColor: deepPurple[500],
    },
  },
  error: {
    color: 'red',
  },
});

class TextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value : '',
    };
  }

  render() {
    const { autoComplete, multiline, rows, classes, label, id, type, required, error } = this.props;

    return (
      <FormControl>
        <InputLabel
          FormLabelClasses={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
          htmlFor="custom-css-input"
          className={error ? classes.error : ''}
        >
          {required ? label+'*' : label}
        </InputLabel>
        <Input
          required={required}
          error={error}
          fullWidth
          id={id}
          multiline={multiline}
          rows={rows}
          type={type}
          onChange={this.props.handleParentChange}
          value={this.props.value}
          classes={{
            underline: classes.cssUnderline,
          }}
          autoComplete={autoComplete}
        />
      </FormControl>
    );
  }
}

TextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextField);