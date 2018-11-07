import React, { Component } from 'react';
import TextField from '../../../TextField';
import ContainedButtonActive from '../../../Buttons/ContainedButtonActive';
import ContainedButtonInactive from '../../../Buttons/ContainedButtonInactive';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import './style.css';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.email = {invalid: false, cause : ''};
    this.password = {invalid: false, cause : ''};
    this.state = {
      loginModal : true,
      formInvalid : false,
      emailValue : '',
      passwordValue : '',
    };
  }

  handleEmailChange = (event) => {
    this.setState({
      emailValue: event.target.value,
    });
  };

  handlePasswordChange = (event) => {
    this.setState({
      passwordValue: event.target.value,
    });
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

  validatePassword = (password) => {
    if (password.length === 0) {
      this.password.invalid = true;
      this.password.cause = 'Please, write your password';
    } else {
      this.password.invalid = false;
      this.password.cause = '';
    }
  };

  formSubmit = () => {
    const email = document.getElementById('email-login'),
          password = document.getElementById('password-login');

    email.onfocus = () => {
      this.email.invalid = false;
      this.email.cause = '';
      this.setState({
        formInvalid : false,
      });
    };

    password.onfocus = () => {
      this.password.invalid = false;
      this.password.cause = '';
      this.setState({
        formInvalid : false,
      });
    };

    const loginData = {
      email : this.state.emailValue,
      password : this.state.passwordValue,
    };

    this.validateEmail(this.state.emailValue);
    this.validatePassword(this.state.passwordValue);

    if (!this.email.invalid && !this.password.invalid) {
      axios.post('/api/users/login', loginData)
        .then((resp) => {
          if (resp.data.email === 'User not found') {
            this.email.invalid = true;
            this.email.cause = 'Sorry, user not found';
            this.setState({
              formInvalid : true,
            });

          } else if (resp.data.password === 'Password incorrect') {
            this.password.invalid = true;
            this.password.cause = 'Sorry, incorrect password';
            this.setState({
              formInvalid : true,
            });

          } else {
            const savedUserData = {id : resp.data._id , avatar : resp.data.avatar, name : resp.data.name};
            localStorage.setItem('user', JSON.stringify(savedUserData));
            this.props.changeLocation(
              window.location.hash ? `${'/'+window.location.search.slice(1)+window.location.hash}`
                : window.location.search
                ? '/'+window.location.search.slice(1)
                :`/home`
            );
            /*window.location.replace(
              window.location.hash ? `${'/'+window.location.search.slice(1)+window.location.hash}`
                                   : window.location.search
                                     ? '/'+window.location.search.slice(1)
                                     :`/home`
            );*/
        }
        });

    } else {
      this.setState({
        formInvalid : true,
      });
    }
  };

  render() {
    return (
      <Card className='login-form-sign-up'>
        <ContainedButtonActive
          value={'Sign in'}
        />
        <ContainedButtonInactive
          value={'Registration'}
          onClick={this.props.onClick}
        />
        <form className="login-form__login">
          <TextField
            id="email-login"
            label={this.email.invalid ? this.email.cause : 'Email'}
            type="email"
            error={this.email.invalid}
            multiline={false}
            handleParentChange={this.handleEmailChange}
            value={this.state.emailValue}
            required={true}
            autoComplete="user-email"
          />
          <TextField
            id="password-login"
            label={this.password.invalid ? this.password.cause : 'Password'}
            type="password"
            error={this.password.invalid}
            multiline={false}
            handleParentChange={this.handlePasswordChange}
            value={this.state.passwordValue}
            required={true}
            autoComplete="current-password"
          />
          <ContainedButtonActive
            value='Submit'
            onClick={this.formSubmit}
            size='large'
          />
        </form>
        <Link
          to={window.location.hash ? `${'/'+window.location.search.slice(1)+window.location.hash}`
            : window.location.search && window.location.search !== '?messages'
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

export default LoginForm;