import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 50,
    height: 50,
  },
};

class ImageAvatars extends Component {

  render() {
    const {classes, userAvatar} = this.props;
    return (
      <div className={classes.row}>
        <Avatar
          alt="User Avatar"
          src={userAvatar}
          className={classNames(classes.avatar, classes.bigAvatar)}
        />
      </div>
    );
  }

}

ImageAvatars.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageAvatars);

