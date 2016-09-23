import React, { Component } from 'react';

const DatasetSelection = () => {
  return (
    <div className='container dataset_selection_form'>
      <h1 className='text-center heading'>Select your cleaned dataset</h1>
      <form>
        <div className="form-group">
          <input type="file" id="exampleInputFile" />
          <em className="help-block small">(CSV only. Max file size is **MB)</em>
        </div>
      <button type="button" className="btn btn-lg btn-success center-block">Upload</button>
      </form>
    </div>
  );
};

export default DatasetSelection;