import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
require('highcharts-more')(ReactHighcharts.Highcharts);
require('highcharts-heatmap')(ReactHighcharts.Highcharts);

import setCorrMatrixConfig from '../chart_configs/correlation_matrix';

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
      <ReactHighcharts config={setCorrMatrixConfig(props.corrMatrix, props.dfDescription[0].slice(1))}></ReactHighcharts>
    
      <div className="model-stats">
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
    </div>
  );
};

export default SummaryStatistics;