import * as React from "react";

import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./scenes/Home";
import Header from "./components/Header";
import Article from "./scenes/Article/Article";
import Login from "./scenes/Login";
import Register from "./scenes/Register";
import PostEditor from "./scenes/PostEditor";
import Settings from "./scenes/Settings";
import Profile from "./scenes/Profile";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/edit/:slug" exact component={PostEditor} />
        <Route path="/new" exact component={PostEditor} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/settings" exact component={Settings} />
        <Route path="/article/:slug" exact component={Article} />
        <Route path="/user/:username/favorites" component={Profile} />
        <Route path="/user/:username" component={Profile} />
        <Route path="/" exact component={Home} />
      </Switch>
    </Router>
  );
};

export default AppRouter;
