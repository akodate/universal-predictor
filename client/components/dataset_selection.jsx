import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import SummaryStatistics from './tables/summary_statistics';

class DatasetSelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: {},
      display: 'none'
    };
  }

  // TODO: File upload error handling (wrong filetype, file too large)
  // TODO: Dataset submit error handling (no dataset selected)

  uploadFile(event) {
    const file = event.target.files[0]; 
    console.log(file);
    if (!file) return;

    let xhr = new XMLHttpRequest(); 
    xhr.open('POST', '/upload', true);
    xhr.onload = (event) => {
      console.log('done uploading!');
      this.runDFDescribeScript();
    };

    xhr.upload.onprogress = (event) => {
      let percent = 100 * (event.loaded / event.total);
      console.log(percent+'% uploaded');
    };

    xhr.send(file);
  };

  runDFDescribeScript() {
    console.log('Running Python df_describe script...')

    Meteor.call('runPython', 'df_describe.py', (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(result.info_log);
        console.log(result.results);
        this.setState({ results: result.results });
      }
    });
  }

  goToParamsSelection() {
    browserHistory.push('/params_selection');
  };

  render() {
    return (
      <div className='container dataset-selection-form'>
        <h1 className='text-center heading'>Select your cleaned dataset</h1>
        <form>
          <div className="form-group">
            <input type="file" id="exampleInputFile" onChange={() => this.uploadFile} />
            <p style={{display: this.state.display}}>ERROR</p>
            <em className="help-block small">(CSV only. Max file size is **MB)</em>
          </div>
        <button type="button" className="btn btn-lg btn-success center-block" onClick={this.goToParamsSelection}>Next</button>
        </form>
        <hr />

        <SummaryStatistics />

      </div>
    );
  }
};

export default DatasetSelection;