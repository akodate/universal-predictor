import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import Results from './results';

class ParamsSelection extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      colNames: [], 
      results: {}
    };
  }

  componentDidMount() {
    this.getColumnNames();
  }

  getColumnNames() {
    Meteor.call('getColNames', (error, result) => {
      if (error) {
        console.log(error);
      } else {
        const colNames = result;
        this.setState({ colNames });
      }
    });
  }

  runPythonScript(event) {
    event.preventDefault();
    const target = this.refs.target.value
    const time = this.refs.time.value  
    console.log('Running python script...')  

    Meteor.call('runPython', 'automl.py', target, time, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result.info_log);
        console.log(result.results_log);
        console.log(result.results);
        this.setState({ results: result.results });
        browserHistory.push({
          pathname: '/results', 
          state: result.results
        });
      }
    });
  }

  renderColumnNames() {
    return this.state.colNames.map(colName => {

      return (
        <option key={_.uniqueId()}>{colName}</option>
      );

    });
  }

  renderTimeOptions() {
    timeOptions = [10, 30, 60];
    return timeOptions.map(timeOption => {

      return (
        <option key={_.uniqueId()}>{timeOption}</option>
      );

    });
  }

  render() {
    return (
      <div className='container dataset-selection-form'>
        <h1 className='text-center heading'>Select model parameters</h1>

        <form onSubmit={(event) => this.runPythonScript(event)}>
          <div className="form-group">
            <div className="form-inline param">
              <label htmlFor="target-selector">Target to predict:</label>
              <select ref='target' className="form-control param" id="target-selector">
                {this.renderColumnNames()}
              </select>
            </div>
            <div className="form-inline param">
              <label htmlFor="time-selector">Seconds to train model:</label>
              <select ref='time' className="form-control param" id="time-selector">
                {this.renderTimeOptions()}
              </select>
            </div>                 
          </div>
          <input type="submit" value="Create model!" className="btn btn-lg btn-success center-block" />
        </form>

      </div>
    );
  }
};

export default ParamsSelection;