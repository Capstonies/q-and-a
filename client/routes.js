import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import {
  Login,
  Signup,
  UserHome,
  PageNotFound,
  Manage,
  QuestionQueue
} from './components';
import { Auth } from './containers';
import { me } from './store';

class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn, isAdmin } = this.props;
    return (
      <Switch>
        <Route exact path="/" component={UserHome} />
        <Route exact path="/questionqueue" component={QuestionQueue} />

        {isLoggedIn && (
          <Switch>
            {/* LOGGED-IN ONLY ROUTES */}
            <Route path="/manage" component={Manage} />
          </Switch>
        )}

        <Route path="/(login|signup)" component={Auth} />
        <Route component={PageNotFound} />
      </Switch>
    );
  }
}

const mapState = state => ({
  isLoading: !!state.me.isLoading,
  isLoggedIn: !!state.me.id,
  isAdmin: !!state.me.isAdmin
});

const mapDispatch = dispatch => ({
  loadInitialData: () => dispatch(me())
});

// `withRouter` makes sure updates are not blocked when url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
