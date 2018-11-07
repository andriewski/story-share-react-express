import React from 'react';
import { BrowserRouter,
         Route,
         Switch,
         Redirect } from 'react-router-dom';
import Header from '../components/Header';
import RegistrationModal from '../components/Forms/RegistrationModal';
import MainPage from '../components/MainPage';
import StoryPage from '../components/StoryPage';
import Messages from '../components/Messages';
import SocketChat from '../components/SocketChat';

const Router = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
          <Switch>
            <Route exact path="/home" component={MainPage} />
            <Route path="/login" component={RegistrationModal} />
            <Route path="/messages" component={Messages} />
            <Route path="/chat/:id" component={SocketChat} />
            <Route path="/story/:id" component={StoryPage} />
            <Redirect from="/" to="/home#0" />
          </Switch>
      </div>
    </BrowserRouter>
  )
};

export default Router;