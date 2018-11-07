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
import FavoriteIcon from '@material-ui/icons/Favorite';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ImageAvatars from './ImageAvatars';
import TextButton from '../Buttons/TextButton';
import grey from '@material-ui/core/colors/grey';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
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
    minHeight: 362,
    marginRight: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  media: {
    width: 320,
    minHeight: 140,
    maxHeight: 'auto',
   /* paddingTop: '56.25%', // 16:9*/
  },
  avatar: {
    backgroundColor: red[500],
  },
  actions: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 3,
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
});

class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.likes = this.props.likes;
    this.userID = localStorage.user ? JSON.parse(localStorage.user).id : null;
    this.state = {
      likeCounter : this.likes.length,
      likeColor: this.likes.indexOf(this.userID) !== -1 ? 'primary' : 'inherit',
      isImageLoaded: false,
    };
    this.image = null;
    this.isImageLoaded = false;
  }

  componentDidMount () {
    this._mounted = true
  }

  handleLikeClick = (cardID) => {
    this.likes.indexOf(this.userID) === -1
      ? this.likes.push(this.userID)
      : this.likes.splice(this.likes.indexOf(this.userID), 1);

    this.setState({
      likeCounter : this.likes.length,
      likeColor: this.likes.indexOf(this.userID) !== -1 ? 'primary' : 'inherit'
    });

    const data = {
      /*userID : localStorage.user.id,*/
      postID : cardID,
      userID : this.userID,
    };

    axios.post('/api/posts/likes', data);
  };

  handleLoadImage = () => {
    if (this._mounted) {
      this.setState({isImageLoaded: true});
    }
  };

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const dateFormat = require('dateformat');
    const { cardID, classes, userAvatar, userName, storyTitle, storyImage, dateOfPost, userID } = this.props;
    const date = dateFormat("d");
    this.image = new Image();
    this.image.src = storyImage;
    this.image.addEventListener("load", this.handleLoadImage);

    return (
      <MuiThemeProvider theme={theme}>
        <Card
          className={classes.card}
          style={{marginBottom: this.state.isImageLoaded ? 20 : 120}}
        >
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
          <img
            src={storyImage}
            alt={storyTitle}
            className={classes.media}
          />
          <CardContent>
            <Typography className='story-card__text'>
              {storyTitle.length > 450 ? storyTitle.slice(0, 450)+'...' : storyTitle}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            {
              localStorage.user
                ? <IconButton aria-label="Add to favorites" onClick={() => this.handleLikeClick(cardID)}>
                    <FavoriteIcon
                      color={this.state.likeColor}
                    />
                  </IconButton>
                : <Link to={`/login/?${window.location.pathname.slice(1)+window.location.hash}`}>
                    <IconButton aria-label="Add to favorites">
                      <FavoriteIcon
                        color='inherit'
                      />
                    </IconButton>
                  </Link>
            }
            <span className={classes.likeCounter}>{this.state.likeCounter}</span>
            <Link
              to={`/story/${cardID}?${window.location.pathname.slice(1)+window.location.hash}`}
            >
              <TextButton
                aria-label="Show more"
                value='Show more'
                className="see-more-button"
              />
            </Link>
          </CardActions>
        </Card>
      </MuiThemeProvider>
    );
  }
}

StoryCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryCard);