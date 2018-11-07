import React, { Component } from 'react';
import TextField from '../../../TextField';
import ContainedButtonActive from '../../../Buttons/ContainedButtonActive';
import ContainedButtonInactive from '../../../Buttons/ContainedButtonInactive';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '@material-ui/core/Button';
import './style.css';

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

class RegistrationForm extends Component {
  constructor(props) {
    super(props);

    this.username = {invalid: false, cause : ''};
    this.email = {invalid: false, cause : ''};
    this.password1 = {invalid: false, cause : ''};
    this.password2 = {invalid: false, cause : ''};
    this.url = {invalid: false, cause : ''};

    this.state = {
      loginModal : true,
      formInvalid : false,
      userNameValue : '',
      emailValue : '',
      password1Value : '',
      password2Value : '',
      urlValue : '',
      uploadFile : null,
      cloudinaryImgUrl: '',
    };
  }

  handleNameChange = (event) => {
    this.setState({
      userNameValue: event.target.value,
    });
  };

  handleEmailChange = (event) => {
    this.setState({
      emailValue: event.target.value,
    });
  };

  handlePassword1Change = (event) => {
    this.setState({
      password1Value: event.target.value,
    });
  };

  handlePassword2Change = (event) => {
    this.setState({
      password2Value: event.target.value,
    });
  };

  handleUrlChange = (event) => {
    this.setState({
      urlValue: event.target.value,
    });
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

  validateUserName = (name) => {
    const matchedName = name.match(/[a-z\-_а-ё]/gi);
    if (name.length === 0) {
      this.username.invalid = true;
      this.username.cause = 'Please, write your name';
    } else if (matchedName === null) {
      this.username.invalid = true;
      this.username.cause = 'Sorry, your name can only contains letters, numbers, - and _';
    } else {
      this.username.invalid = false;
      this.username.cause = '';
    }
  };

  validateEmail = (email) => {
    const matchedEmail = email.match(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,6})$/g);
    if (email.length === 0) {
      this.email.invalid = true;
      this.email.cause = 'Please, write your email';
    } else if (matchedEmail === null) {
      this.email.invalid = true;
      this.email.cause = 'Incorrect email address';
    } else {
      this.email.invalid = false;
      this.email.cause = '';
    }
  };

  validatePasswords = (password1, password2) => {
    if (password1.length === 0) {
      this.password1.invalid = true;
      this.password1.cause = 'Please, write your password';
    } else if (password2.length === 0) {
      this.password2.invalid = true;
      this.password2.cause = 'Please, repeat your password';
    } else if (password1 !== password2) {
      this.password1.invalid = true;
      this.password1.cause = 'Password doesn\'t matches';
      this.password2.invalid = true;
      this.password2.cause = 'Password doesn\'t matches';
    } else {
      this.password1.invalid = false;
      this.password1.cause = '';
      this.password2.invalid = false;
      this.password2.cause = '';
    }
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

  formSubmit = () => {
    const name = document.getElementById('name-reg'),
          email = document.getElementById('email-reg'),
          password1 = document.getElementById('password1-reg'),
          password2 = document.getElementById('password2-reg'),
          url = document.getElementById('user-avatar-reg');

    name.onfocus = () => {
      this.username.invalid = false;
      this.username.cause = '';
      this.setState({
        formInvalid : false,
      });
    };
    email.onfocus = () => {
      this.email.invalid = false;
      this.email.cause = '';
      this.setState({
        formInvalid : false,
      });
    };
    password1.onfocus = () => {
      this.password1.invalid = false;
      this.password1.cause = '';
      this.setState({
        formInvalid : false,
      });
    };
    password2.onfocus = () => {
      this.password2.invalid = false;
      this.password2.cause = '';
      this.setState({
        formInvalid : false,
      });
    };
    url.onfocus = () => {
      this.url.invalid = false;
      this.url.cause = '';
      this.setState({
        formInvalid : false,
      });
    };

    this.validateUserName(this.state.userNameValue);
    this.validateEmail(this.state.emailValue);
    this.validatePasswords(this.state.password1Value, this.state.password2Value);

    if (!this.state.uploadFile) {
      this.validateUrl(this.state.urlValue);
    }

    if (!this.username.invalid &&
        !this.email.invalid &&
        !this.password1.invalid &&
        !this.password2.invalid &&
        !this.url.invalid) {

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
            const registerData = {
              name: this.state.userNameValue,
              email: this.state.emailValue,
              password: this.state.password1Value,
              avatar: this.state.cloudinaryImgUrl,
            };

            axios.post('/api/users/register', registerData)
              .then((resp) => {
                if (resp.data.email === 'Email already exists') {
                  this.email.invalid = true;
                  this.email.cause = 'Sorry, email already exists';
                  this.setState({
                    formInvalid: true,
                  });

                } else {
                  document.location.reload(true);
                }
              });

          })
          .catch(error => {
            alert('Sorry, something went wrong! \n Try again :)');
          });
      } else {

        const registerData = {
          name: this.state.userNameValue,
          email: this.state.emailValue,
          password: this.state.password1Value,
          avatar: this.state.urlValue,
        };

        axios.post('/api/users/register', registerData)
          .then((resp) => {
            if (resp.data.email === 'Email already exists') {
              this.email.invalid = true;
              this.email.cause = 'Sorry, email already exists';
              this.setState({
                formInvalid: true,
              });

            } else {
              document.location.reload(true);
            }
          });
      }

    } else {
      this.setState({
        formInvalid : true,
      });
    }
  };

  render() {
    const {classes} = this.props;

    return (
      <Card className="login-form-registration">
        <ContainedButtonInactive
          value={'Sign in'}
          onClick={this.props.onClick}
        />
        <ContainedButtonActive
          value={'Registration'}
        />
        <form className="login-form__registration">
          <TextField
            label={this.username.invalid ? this.username.cause : 'Name'}
            type="text"
            id="name-reg"
            error={this.username.invalid}
            multiline={false}
            handleParentChange={this.handleNameChange}
            value={this.state.userNameValue}
            required={true}
            autoComplete="off"
          />
          <TextField
            label={this.email.invalid ? this.email.cause : 'Email'}
            type="email"
            id="email-reg"
            error={this.email.invalid}
            multiline={false}
            handleParentChange={this.handleEmailChange}
            value={this.state.emailValue}
            required={true}
            autoComplete="off"
          />
          <TextField
            label={this.password1.invalid ? this.password1.cause : 'Password'}
            type="password"
            id="password1-reg"
            error={this.password1.invalid}
            multiline={false}
            handleParentChange={this.handlePassword1Change}
            value={this.state.password1Value}
            required={true}
            autoComplete="off"
          />
          <TextField
            label={this.password2.invalid ? this.password2.cause : 'Repeat password'}
            type="password"
            id="password2-reg"
            error={this.password2.invalid}
            multiline={false}
            handleParentChange={this.handlePassword2Change}
            value={this.state.password2Value}
            required={true}
            autoComplete="off"
          />
          <TextField
            id="user-avatar-reg"
            label={this.url.invalid ? this.url.cause : 'Avatar Url'}
            type="url"
            error={this.url.invalid}
            multiline={false}
            handleParentChange={this.handleUrlChange}
            value={this.state.urlValue}
            autoComplete="off"
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
          <ContainedButtonActive
            value='Submit'
            onClick={this.formSubmit}
          />
        </form>
        <Link
          to={window.location.hash ? `${'/'+window.location.search.slice(1)+window.location.hash}`
            : window.location.search
              ? '/'+window.location.search.slice(1)
              :`/home#0`}
        >
          <ContainedButtonActive
            value="x"
          />
        </Link>
      </Card>
    );
  }
}

RegistrationForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegistrationForm);
