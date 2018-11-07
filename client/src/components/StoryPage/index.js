import React, { Component } from 'react';
import './style.css';
import SingleStory from './SingleStory';
import CircularProgress from '@material-ui/core/CircularProgress';
import deeppurple from '@material-ui/core/colors/deepPurple';
import StoryComments from './StoryComments';
import TextField from '../TextField';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ContainedButtonActive from "../Buttons/ContainedButtonActive";


class StoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      post : null,
      formInvalid : false,
      textAreaValue : '',
    };
    this.textAreaInput = {invalid: false, cause : ''};
  }

  componentDidMount() {
    this.getData();
    this.timerID = setInterval(this.getData, 5000);
    /*this.props.history.push('/'); - альтернативный способ перейти на страницу*/
  }

  componentWillUnmount() {
    if (this.timerID) clearInterval(this.timerId);
  }

  getData = () => {
    this.setState({ isLoading: true });
    const data = {id : this.props.match.params.id};
    axios
      .get('/api/posts/single', {params : data})
      .then(res => {
        if (this.timerID) {
          clearInterval(this.timerID);
        }
        this.setState({
          isLoading: false,
          post : res.data.post,
        });
      });
  };

  handleChange = (event) => {
    this.setState({
      textAreaValue: event.target.value,
    });
  };

  validateTextArea = (textarea) => {
    textarea = textarea.trim();
    if (textarea.length === 0) {
      this.textAreaInput.invalid = true;
      this.textAreaInput.cause = 'Please, write your Comment';
    } else {
      this.textAreaInput.invalid = false;
      this.textAreaInput.cause = '';
    }
  };

  handleButtonClick = () => {
    const textarea = document.getElementById('story-comment');
    textarea.onfocus = () => {
      this.textAreaInput = {invalid: false, cause: ''};
      this.setState({
        formInvalid : false,
      });
    };

    this.validateTextArea(this.state.textAreaValue);

    if (!this.textAreaInput.invalid) {
      const userProfile = JSON.parse(localStorage.user),
            postComment = {
              postID : this.props.match.params.id,
              name : userProfile.name,
              text : this.state.textAreaValue,
            };

      axios.post('/api/posts/comment', postComment)
        .then((resp) => {
          this.setState({
            textAreaValue: '',
          });
          this.getData();
      });
    } else {
      this.setState({
        invalidStoryForm: true,
      });
    }
  };

  render() {
    const post = this.state.post;
    const textAreaInput = this.textAreaInput;
    return (
      <div className="story-page">
        {
          this.state.post
            ? <div>
                <SingleStory
                  id={post._id}
                  userAvatar={post.avatar}
                  userName={post.name}
                  storyTitle={post.text}
                  storyImage={post.picture}
                  dateOfPost={post.date}
                  likes={post.likes}
                  userID={post.userID}
                />
                <form action="" className="comment-form">
                  <TextField
                    id="story-comment"
                    required={true}
                    label={textAreaInput.invalid ? textAreaInput.cause : 'Leave your comment'}
                    error={textAreaInput.invalid}
                    handleParentChange={this.handleChange}
                    value={this.state.textAreaValue}
                    multiline={true}
                    rows={2}
                  />
                  {
                    localStorage.user
                      ? <ContainedButtonActive
                          className="comment-button"
                          onClick={this.handleButtonClick}
                          value="Leave your comment"
                        />
                      : <Link
                          to={window.location.hash
                                ? `/login/?${window.location.pathname.slice(1)+window.location.search+window.location.hash}`
                                : `/login/?${window.location.pathname.slice(1)}`
                             }
                        >
                          <ContainedButtonActive
                            className="comment-button"
                            value="Leave your comment"
                          />
                        </Link>
                  }
                </form>
                <StoryComments
                  comments={this.state.post.comments}
                />
              </div>
            : <CircularProgress
                style={{display: 'block', margin: '100px auto', color: deeppurple[500]}}
                size={200}
                thickness={2}
              />
        }
      </div>
    );
  }
}

export default StoryPage;