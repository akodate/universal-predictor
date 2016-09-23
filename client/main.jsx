import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  return (
    <div>Model Agency!</div>
  )
}

Meteor.startup(() => {
  ReactDOM.render(<App />, document.querySelector('.render-target'));
});