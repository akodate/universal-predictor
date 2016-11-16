import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import SummaryStatistics from './summary_statistics';

class ParamsSelection extends Component {

  constructor(props) {
    super(props);

    const dfDescription = props.location.state.dfDescription;
    const corrMatrix = props.location.state.corrMatrix;
    const colNames = dfDescription[0].slice(1);
    const results = {};

    this.state = {
      dfDescription,
      corrMatrix,
      colNames,
      results, // eslint-disable-line comma-dangle
    };
  }

  runAutoMLScript(event) {
    event.preventDefault();
    const target = this.refs.target.value;
    const time = this.refs.time.value;
    console.log('Running Python automl script...');

    Meteor.call('runPython', 'automl.py', target, time, (error, result) => { // eslint-disable-line no-undef
      if (error) {
        console.log(error);
      } else {
        console.log(result.info_log);
        console.log(result.results_log);
        console.log(result.results);
        this.setState({ results: result.results });
        browserHistory.push({
          pathname: '/results',
          state: result.results,
        });
      }
    });
  }

  renderColumnNames() {
    return this.state.colNames.map(colName =>
      (
        <option key={_.uniqueId()}>{colName}</option> // eslint-disable-line no-undef
      ),
    );
  }

  renderTimeOptions() {
    const timeOptions = [10, 30, 60];
    return timeOptions.map(timeOption =>
      (
        <option key={_.uniqueId()}>{timeOption}</option> // eslint-disable-line no-undef
      ),
    );
  }

  render() {
    return (
      <div>
        <div className="container dataset-selection-form">
          <h1 className="text-center heading">Select model parameters</h1>

          <form onSubmit={event => this.runAutoMLScript(event)}>
            <div className="form-group">
              <div className="form-inline param">
                <label htmlFor="target-selector">Target to predict:</label>
                <select ref="target" className="form-control param" id="target-selector">
                  {this.renderColumnNames()}
                </select>
              </div>
              <div className="form-inline param">
                <label htmlFor="time-selector">Seconds to train model:</label>
                <select ref="time" className="form-control param" id="time-selector">
                  {this.renderTimeOptions()}
                </select>
              </div>
            </div>
            <input type="submit" value="Create model!" className="btn btn-lg btn-success center-block" />
          </form>
        </div>

        <div>
          {this.state.dfDescription && <SummaryStatistics
            corrMatrix={this.state.corrMatrix}
            dfDescription={this.state.dfDescription}
          />}
        </div>
      </div>
    );
  }
}

export default ParamsSelection;
