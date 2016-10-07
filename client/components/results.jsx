import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactHighcharts from 'react-highcharts';
require('highcharts-more')(ReactHighcharts.Highcharts);
require('highcharts-heatmap')(ReactHighcharts.Highcharts);

const Results = (props) => {
  const results = props.location.state

  const roundedScore = results.score.toFixed(3)
  const roundedBaselineAcc = results.baselineAcc.toFixed(3)

  // Rounds precision, recall, and Fscore to 3 decimal places, then support to 0 decimal places
  const roundedPrecRecFscoreSupport = results.precRecFscoreSupport.map(
    row => row.slice(0, 3).map(
      x => x.toFixed(3)
    ).concat(row[3].toFixed(0))
  );

  // Formats confusion matrix as chart data
  let cnfMatrixData = [];
  for (let [i, col] of results.cnfMatrix.entries()) {
    for (let [i2, x] of col.entries()) {
      cnfMatrixData.push([i, i2, x]);
    }
  }

  // Changes the fpr and tpr arrays into (rounded) coordinate arrays for the ROC curve chart...
  let rocCurveData = [];
  for (let [fprArr, tprArr] of _.zip(results.fpr, results.tpr)) {
    coordArr = []
    for (let [x, y] of _.zip(fprArr, tprArr)) {
      coordArr.push([
        (Math.round(x * 1e3) / 1e3),
        (Math.round(y * 1e3) / 1e3)
      ]);
    }
    rocCurveData.push({ data: coordArr });
  }
  // ...then adds class name to the chart data
  for (let [i, category] of rocCurveData.entries()) {
    rocCurveData[i]['name'] = results.classNames[i];
  }

  const renderClassificationReport = () => {
    return roundedPrecRecFscoreSupport.map((pRFS, i) => {
      return (
        <tr key={i}>
          <td><strong>{results.classNames[i]}</strong></td>
          <td>{pRFS[0]}</td>
          <td>{pRFS[1]}</td>
          <td>{pRFS[2]}</td>
          <td>{pRFS[3]}</td>
        </tr> 
      );     
    });
  };

  const cnfMatrixConfig = {
    chart: {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
    },

    title: {
        text: 'Confusion Matrix'
    },

    xAxis: {
        categories: results.classNames,
        title: {
          text: '<b>Predicted class</b>'
        }
    },

    yAxis: {
        categories: results.classNames,
        title: {
          text: '<b>True class</b>'
        }
    },

    colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: ReactHighcharts.Highcharts.getOptions().colors[0]
    },

    legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
        formatter: function () {
            return '<strong>' + this.point.value + '</strong> predicted as class <strong>' + this.series.xAxis.categories[this.point.x] + '</strong><br>' + 
             'that are actually class <strong>' + this.series.yAxis.categories[this.point.y] + '</strong>';
        }
    },

    series: [{
        name: 'Predicted vs. Actual Classes',
        borderWidth: 1,
        data: cnfMatrixData,
        dataLabels: {
            enabled: true,
            color: '#000000'
        }
    }]
  };

  const rocCurveConfig = {
    title: {
        text: 'ROC Curve',
        x: -20 //center
    },
    xAxis: {
        title: {
            text: 'False Positive Rate'
        }
    },
    yAxis: {
        title: {
            text: 'True Positive Rate'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: ''
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: rocCurveData
  }

  return (
    <div className="model-stats">

      <h1>Results</h1>
      <hr />
      <ul className="list-unstyled">
        <li><h3>Model accuracy — <strong>{roundedScore}</strong></h3></li>
        <li><h3>Baseline accuracy — <strong>{roundedBaselineAcc}</strong></h3></li>
      </ul>
      <hr />

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
          {renderClassificationReport()}
        </tbody>
      </table>

      <hr />
      <ReactHighcharts config={cnfMatrixConfig}></ReactHighcharts>
      <ReactHighcharts config={rocCurveConfig}></ReactHighcharts>

    </div>
  );
};

export default Results;