import React, { Component } from 'react';

class ParamsSelection extends Component {

  constructor(props) {
    super(props);

    this.state = { colNames: [] };
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

        <div className="form-group" // Double form-group for proper styling
        >
          <form className="form-inline">
            <div className="form-group">
              <label htmlFor="target-selector">Target to predict:</label>
              <select className="form-control param" id="target-selector">
                {this.renderColumnNames()}
              </select>
            </div>
          </form>
        </div>

        <div className="form-group"
        >
          <form className="form-inline">
            <div className="form-group">
              <label htmlFor="time-selector">Seconds to train model:</label>
              <select className="form-control param" id="time-selector">
                {this.renderTimeOptions()}
              </select>
            </div>
          </form>
        </div>

        <button type="button" className="btn btn-lg btn-success center-block">Create model!</button>
      </div>
    );
  }
};

export default ParamsSelection;