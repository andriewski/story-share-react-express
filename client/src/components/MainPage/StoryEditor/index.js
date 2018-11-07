import React, { Component } from 'react';
import './style.css';
import ContainedButtonActive from "../../Buttons/ContainedButtonActive";
import ContainedButtonInactive from "../../Buttons/ContainedButtonInactive";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import TextField from '../../TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    textTransform: 'none',
    fontSize: '18px',
  },
  input: {
    display: 'none',
  },
});

class StoryEditor extends Component {
  constructor(props) {
    super(props);
    this.textAreaInput = {invalid: false, cause : ''};
    this.url = {invalid: false, cause : ''};
    this.state = {
      menuOpen : false,
      invalidStoryForm : false,
      storyValue : '',
      urlValue : '',
      uploadFile : null,
      cloudinaryImgUrl: '',
    }
  }

  handleUrlChange = (event) => {
    this.setState({
      urlValue: event.target.value,
    });
  };

  handleStoryChange = (event) => {
    this.setState({
      storyValue: event.target.value,
    });
  };

  validateUrl = (url) => {
    const matchedUrl = url.match(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?(.jpg|.png|.jpeg|.gif)$/gi);
    if (url.length === 0 || matchedUrl !== null) {
      this.url.invalid = false;
      this.url.cause = '';
    } else if (matchedUrl === null) {
      this.url.invalid = true;
      this.url.cause = 'Incorrect Url address';
    }
  };

  validateStory = (textarea) => {
    textarea = textarea.trim();
    if (textarea.length === 0) {
      this.textAreaInput.invalid = true;
      this.textAreaInput.cause = 'Please, write the Story';
    } else if (textarea.length < 4) {
      this.textAreaInput.invalid = true;
      this.textAreaInput.cause = 'Sorry, the Story can\'t be so short';
    } else {
      this.textAreaInput.invalid = false;
      this.textAreaInput.cause = '';
    }
  };

  handleClick = () => {
    if (localStorage.user) {
      this.textAreaInput = {invalid: false, cause : ''};
      this.setState({
        menuOpen: !this.state.menuOpen,
      });
    } else {
      this.props.changeLocation(`/login/?${window.location.pathname.slice(1)+window.location.hash}`);
    }
  };

  handleUploadImage = (e) => {
    if (e.target.files[0]) {
      const matchedImg = e.target.files[0].name.match(/(.jpg|.png|.jpeg|.gif)/gi);
      if (matchedImg && matchedImg.length) {
        this.setState({
          uploadFile: e.target.files[0],
        });
      } else {
        alert('Wrong type of data!');
      }
    }
  };

  formSubmit = () => {
    const textarea = document.getElementById('story-text'),
          url = document.getElementById('story-image-url');

    textarea.onfocus = () => {
      this.textAreaInput.invalid = false;
      this.textAreaInput.cause = '';
      this.setState({
        invalidStoryForm : false
      });
    };

    url.onfocus = () => {
      this.url.invalid = false;
      this.url.cause = '';
      this.setState({
        invalidStoryForm : false
      });
    };

    this.validateStory(this.state.storyValue);

    if (!this.state.uploadFile) {
      this.validateUrl(this.state.urlValue);
    }

    if (!this.textAreaInput.invalid && !this.url.invalid && localStorage.user) {

      if (this.state.uploadFile) {
        //https://gist.github.com/BilalBudhani/97c36307bfb184d32f4125bcedc0fd55

          const formData = new FormData();
          formData.append("file", this.state.uploadFile);
          formData.append("tags", `hello world!`);
          formData.append("upload_preset", "wb9dfgis");
          formData.append("api_key", "548799191465161");
          formData.append("timestamp", (Date.now() / 1000) | 0);

          axios
            .post("https://api.cloudinary.com/v1_1/djv1c5ugx/image/upload", formData, {
              headers: {"X-Requested-With": "XMLHttpRequest"},
            })
            .then(response => {
              const data = response.data;

              this.setState({
                cloudinaryImgUrl: data.secure_url,
              });
            })
            .then(() => {
              const userProfile = JSON.parse(localStorage.user),
                defaultPicture = 'https://i105.fastpic.ru/big/2018/0720/fd/074b4416a66fc8dff41b7353d23d8cfd.png',
                postStory = {
                  avatar: userProfile.avatar,
                  name: userProfile.name,
                  picture: this.state.cloudinaryImgUrl || url.value || defaultPicture,
                  text: textarea.value,
                  userID: userProfile.id,
                };

              axios.post('/api/posts', postStory)
                .then(() => {
                  if (window.location.hash === '#0') {
                    document.location.reload(true)
                  } else {
                    window.location.hash = '#0';
                    document.location.reload(true);
                  }
                });
            })
            .catch(() => {
              alert('Sorry, something went wrong! \n Try again :)');
            });
      } else {

        const userProfile = JSON.parse(localStorage.user),
          defaultPicture = 'https://i105.fastpic.ru/big/2018/0720/fd/074b4416a66fc8dff41b7353d23d8cfd.png',
          postStory = {
            avatar: userProfile.avatar,
            name: userProfile.name,
            picture: url.value || defaultPicture,
            text: textarea.value,
            userID: userProfile.id,
          };

        axios.post('/api/posts', postStory)
          .then(() => {
            if (window.location.hash === '#0') {
              document.location.reload(true)
            } else {
              window.location.hash = '#0';
              document.location.reload(true);
            }
          });
      }

    } else {
      this.setState({
        invalidStoryForm : true,
      });
    }
  };

  render() {
    const {classes} = this.props;
    return (
      <div>
        {
          !this.state.menuOpen
            ? <div className="story-editor">
                <ContainedButtonActive
                  onClick={this.handleClick}
                  value="Start the Story"
                />
              </div>
            : <div className="story-editor">
                <ContainedButtonInactive
                  onClick={this.handleClick}
                  value="Stop the Story"
                />
                <form action="" className="story-form">
                  <TextField
                    id="story-text"
                    required={true}
                    label={this.textAreaInput.invalid ? this.textAreaInput.cause : 'Your Story'}
                    error={this.textAreaInput.invalid}
                    handleParentChange={this.handleStoryChange}
                    value={this.state.storyValue}
                    multiline={true}
                    rows={2}
                  />
                  <TextField
                    id="story-image-url"
                    label={this.url.invalid ? this.url.cause : 'Image Url'}
                    type="Url"
                    error={this.url.invalid}
                    multiline={false}
                    handleParentChange={this.handleUrlChange}
                    value={this.state.urlValue}
                  />
                  <span className="story-form__choice"> Or </span>
                  <div>
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        component="span"
                        className={classes.button}
                      >
                        <input
                          accept="image/*"
                          className={classes.input}
                          id="contained-button-file"
                          multiple
                          type="file"
                          onChange={this.handleUploadImage}
                        />
                        Upload
                        <FontAwesomeIcon icon={faCloudUploadAlt} className='UploadIcon'/>
                      </Button>
                    </label>
                  </div>
                  <ContainedButtonActive value='Post the Story' onClick={this.formSubmit}/>
                </form>
              </div>
        }
      </div>
    );
  }
}

StoryEditor.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StoryEditor);
