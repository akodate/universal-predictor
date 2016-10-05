import React, { Component } from 'react';
import { browserHistory } from 'react-router';

const DatasetSelection = () => {
  // TODO: File upload error handling (wrong filetype, file too large)
  let display = 'none';

  const uploadFile = (event) => {
    const file = event.target.files[0]; 
    console.log(file);
    if (!file) return;

    let xhr = new XMLHttpRequest(); 
    xhr.open('POST', '/upload', true);
    xhr.onload = (event) => {
      console.log('done uploading!');
    };

    xhr.upload.onprogress = (event) => {
      let percent = 100 * (event.loaded / event.total);
      console.log(percent+'% uploaded');
    };

    xhr.send(file); 
  };

  const goToParamsSelection = () => {
    browserHistory.push('/params_selection');
  };

  // display = 'block';
  // TODO: Dataset submit error handling (no dataset selected)

  return (
    <div className='container dataset-selection-form'>
      <h1 className='text-center heading'>Select your cleaned dataset</h1>
      <form>
        <div className="form-group">
          <input type="file" id="exampleInputFile" onChange={uploadFile} />
          <p style={{display: display}}>ERROR</p>
          <em className="help-block small">(CSV only. Max file size is **MB)</em>
        </div>
      <button type="button" className="btn btn-lg btn-success center-block" onClick={goToParamsSelection}>Next</button>
      </form>
    </div>
  );
};

export default DatasetSelection;