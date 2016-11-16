import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/app';
import DatasetSelection from './components/dataset_selection';
import ParamsSelection from './components/params_selection';
import Results from './components/results';

const routes = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={DatasetSelection} />
      <Route path="params_selection" component={ParamsSelection} />
      <Route path="results" component={Results} />
    </Route>
  </Router>
);

Meteor.startup(() => { // eslint-disable-line no-undef
  ReactDOM.render(routes, document.querySelector('.render-target')); // eslint-disable-line no-undef
});
