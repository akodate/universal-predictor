import React, { Component } from 'react';

const renderSummaryStatisticsHead = (dfDescription) => {
  return dfDescription[0].map((cell, i) => {
    return (
      <th key={i}>
        {cell}
      </th>
    )
  });
};

const renderSummaryStatisticsBody = (dfDescription) => {
  dfDescription = dfDescription.map((row) => [row[0].toUpperCase()].concat(row.slice(1))); // Capitalize row titles
  dfDescription = roundSummaryStatistics(dfDescription);
  return dfDescription.slice(1).map((row, i) => {
    let cells = row.map((cell, j) => <td className={cell === '' ? "active" : "disabled"} key={j}>{cell}</td>); 
    return (
      <tr key={i}>
        {cells}
      </tr> 
    );     
  });
};

const roundSummaryStatistics = (dfDescription) => {
  for (let [i, row] of dfDescription.entries()) {
    for (let [j, cell] of row.entries()) {
      if (typeof(cell) == 'number' && !Number.isInteger(cell)) {
        dfDescription[i][j] = cell.toFixed(3);
      }
    }
  }
  return dfDescription
}

const SummaryStatistics = (props) => {
  return (
    <div>
      <hr />
      <h4>Summary statistics:</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            {renderSummaryStatisticsHead(props.dfDescription)}
          </tr>
        </thead>
        <tbody>
          {renderSummaryStatisticsBody(props.dfDescription)}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryStatistics;