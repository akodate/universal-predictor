import React from 'react';
import csvParse from 'csv-parse'

const ParamsSelection = () => {

  const getColumnNames = () => {
    console.log(csvParse);
    return (
      <option>getColumnNames function</option>
    );
  };

  return (
    <div className='container dataset-selection-form'>
      <h1 className='text-center heading'>Select model parameters</h1>

      <div className="form-group" // Double form-group for proper styling
      >
        <form className="form-inline">
          <div className="form-group">
            <label htmlFor="target-selector">Target to predict:</label>
            <select className="form-control param" id="target-selector">
              <option>col1</option>
              <option>col2</option>
              <option>col_name_3</option>
              {getColumnNames()}
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
              <option>10</option>
              <option>30</option>
              <option>60</option>
            </select>
          </div>
        </form>
      </div>

      <button type="button" className="btn btn-lg btn-success center-block">Create model!</button>
    </div>
  );
};

export default ParamsSelection;