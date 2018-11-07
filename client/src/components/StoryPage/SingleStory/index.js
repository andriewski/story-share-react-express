import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ImageAvatars from './ImageAvatars';
import TextButton from '../../Buttons/TextButton';
import grey from '@material-ui/core/colors/grey';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './style.css';

const theme = createMuiTheme({
  palette: {
    primary: red,
    secondary: {
      main: '#f44336',
    },
  },
});

let styles = theme => ({
  card: {
    width: 320,
    margin: '50px auto',

  },
  media: {
    maxHeight: 'auto',
    paddingTop: '56.25%', // 16:9
  },
  avatar: {
    backgroundColor: red[500],
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  likeCounter: {
    position: 'relative',
    left: -60,
    color: grey[500],
    fontSize: 16,
  },
  icon: {
    color: 'red',
  },
  text: {
    wordWrap: 'break-word',
  },
});

class SingleStory extends Component {
  constructor(props) {
    super(props);
    this.likes = this.props.likes;
    this.userID = localStorage.user ? JSON.parse(localStorage.user).id : null;
    this.state = {
      likeCounter : this.likes.length,
      likeColor: this.likes.indexOf(this.userID) !== -1 ? 'primary' : 'inherit',
    };
  }

  handleLikeClick = (id) => {
    this.likes.indexOf(this.userID) === -1
      ? this.likes.push(this.userID)
      : this.likes.splice(this.likes.indexOf(this.userID), 1);

    this.setState({
      likeCounter : this.likes.length,
      likeColor: this.likes.indexOf(this.userID) !== -1 ? 'primary' : 'inherit'
    });

    const data = {
      /*userID : localStorage.user.id,*/
      postID : id,
      userID : this.userID,
    };

    axios.post('/api/posts/likes', data)
      .then((resp) => {
        console.log(resp.data);
      });
  };

  render() {
    const dateFormat = require('dateformat');
    const { classes, userAvatar, userName, storyTitle, storyImage, dateOfPost, userID } = this.props;
    const date = dateFormat("d");

    return (
      <MuiThemeProvider theme={theme}>
        <Card className={`${classes.card} card-animation`}>
          <CardHeader
            avatar={
              <ImageAvatars userAvatar={userAvatar}/>
            }
            title={userName}
            subheader={date === dateFormat(dateOfPost, "d")
              ? dateFormat(dateOfPost, "h:MM TT")
              : dateFormat(dateOfPost, "h:MM TT, mmmm dS")
            }
            action={
              localStorage.user &&
              userID !== JSON.parse(localStorage.user).id
              &&
              <Link
                to={`/chat/${userID}`}
              >
                <IconButton>
                  <FontAwesomeIcon icon={faComments}/>
                </IconButton>
              </Link>
            }
          />
          <div>
            <img src={storyImage} alt={storyTitle} className="media" />
          </div>
          <CardContent>
            <Typography className={classes.text}>
              {storyTitle}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Link
              to={window.location.hash
                ? `/home${window.location.hash}`
                : `/home#0`
              }
            >
              <TextButton
                aria-label="Return"
                value='Return'
              />
            </Link>
            <a href={storyImage} target="_blank">
              <TextButton
                aria-label="Full size"
                value='Full size'
                onClick={() => window.history.forward()}
              />
            </a>
          </CardActions>
        </Card>
      </MuiThemeProvider>
    );
  }
}

SingleStory.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SingleStory);