import React, { Component } from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
  } from 'react-router-dom'

import AttackSrfcPage from './Pages/AttackSrfcPage';
import PricingPage from './Pages/PricingPage';
import LoginPage from './Pages/LoginPage';
import ToolboxPage from './Pages/ToolboxPage';

export default class App extends Component {
    
    loggedIn = false;
    
    _setPage = (page, route) => {
        this.setState({ page, route, currentMenu: null, modal: null, error: null });
    }
    
  render() {
    return (
            <Router>
                <Switch>
                    <Route path='/attacksrfc' component={AttackSrfcPage} />
                    <Route path='/pricing' component={PricingPage} />
                    <Route path='/login' component={LoginPage} />
                    <Route path='/toolbox' component={ToolboxPage} />
                    <Route exact path='/' component={AttackSrfcPage} />
                    <Route exact path='/index.html' component={AttackSrfcPage} />
                    		      		
                    <Route render={({ location }) => (
                          <div className='ui inverted red segment'>
                            <h3>
                              Error! No routes for <code>{location.pathname}</code>
                            </h3>
                          </div>
                        )} />
                </Switch>
            </Router>
    );
  }
}
