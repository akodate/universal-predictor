import React from 'react';

const renderClassificationReport = (pRFS, classNames) =>
  pRFS.map((pRFS, i) =>
    (
      <tr key={i}>
        <td><strong>{classNames[i]}</strong></td>
        <td>{pRFS[0]}</td>
        <td>{pRFS[1]}</td>
        <td>{pRFS[2]}</td>
        <td>{pRFS[3]}</td>
      </tr>
    )
  );

const ClassificationReport = props =>
  (
    <div>
      <h4>Classification report:</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Class</th>
            <th>Precision</th>
            <th>Recall</th>
            <th>F1 Score</th>
            <th>Support</th>
          </tr>
        </thead>
        <tbody>
          {renderClassificationReport(props.pRFS, props.classNames)}
        </tbody>
      </table>
    </div>
  );

export default ClassificationReport;
