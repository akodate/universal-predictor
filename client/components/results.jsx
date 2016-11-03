import React, { Component } from 'react';
import ReactHighcharts from 'react-highcharts';
// require('highcharts-more')(ReactHighcharts.Highcharts);
require('highcharts-heatmap')(ReactHighcharts.Highcharts);
require('highcharts-treemap')(ReactHighcharts.Highcharts);

import ClassificationReport from './tables/classification_report';
import setCnfMatrixConfig from '../chart_configs/confusion_matrix';
import setRocCurveConfig from '../chart_configs/roc_curve';
import setEnsembleTreemapConfig from '../chart_configs/ensemble_treemap';

const Results = (props) => {
  const results = props.location.state;
  const classNames = results.classNames;
  const roundedScore = results.score.toFixed(3);
  const roundedBaselineAcc = results.baselineAcc.toFixed(3);

  // Rounds precision, recall, and Fscore to 3 decimal places, then support to 0 decimal places
  const roundedPrecRecFscoreSupport = results.precRecFscoreSupport.map(
    row => row.slice(0, 3).map(
      x => x.toFixed(3)
    ).concat(row[3].toFixed(0))
  );

  const cnfMatrixConfig = setCnfMatrixConfig(results.cnfMatrix, classNames);
  const rocCurveConfig = setRocCurveConfig(results, classNames);
  const ensembleTreemapConfig = setEnsembleTreemapConfig(results, classNames);

  return (
    <div className="model-stats">

      <h1>Classification Prediction Results</h1>
      <hr />
      <ul className="list-unstyled">
        <li><h3>Model score — <strong>{roundedScore}</strong></h3></li>
        <li><h5>Adjusted for baseline accuracy of <strong>{roundedBaselineAcc}</strong></h5></li>
      </ul>
      <hr />

      <ReactHighcharts config={rocCurveConfig}></ReactHighcharts>
      <hr />

      <ReactHighcharts config={cnfMatrixConfig}></ReactHighcharts>
      <hr />

      <ClassificationReport pRFS={roundedPrecRecFscoreSupport} classNames={classNames}/>
      <hr />

      <ReactHighcharts config={ensembleTreemapConfig}></ReactHighcharts>

    </div>
  );
};

export default Results;