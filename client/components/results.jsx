import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactHighcharts from 'react-highcharts';
require('highcharts-more')(ReactHighcharts.Highcharts);
require('highcharts-heatmap')(ReactHighcharts.Highcharts);

const Results = (props) => {
  const results = props.location.state;
  let classNames = results.classNames;

  const roundedScore = results.score.toFixed(3);
  const roundedBaselineAcc = results.baselineAcc.toFixed(3);

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

  let rocCurveData = [];
  if (results.rocAUC.length) {
  // Changes the fpr and tpr arrays into (rounded) coordinate arrays for the ROC curve chart...
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
    for (let [i, category] of rocCurveData.entries()) {
      rocCurveData[i]['name'] = classNames[i];
    }
    // ...then adds class name to the chart data
  } else {
    rocCurveData.push({
      data: _.zip(results.fpr, results.tpr),
      name: [classNames[1]]});
  }

  const renderClassificationReport = () => {
    return roundedPrecRecFscoreSupport.map((pRFS, i) => {
      return (
        <tr key={i}>
          <td><strong>{classNames[i]}</strong></td>
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
        categories: classNames,
        title: {
          text: '<b>Predicted class</b>'
        }
    },

    yAxis: {
        categories: classNames,
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
    subtitle: {
        text: 'Click on a class in the legend to show or hide it',
        x: -20
    },
    xAxis: {
        title: {
            text: 'False Positive Rate'
        },
        ceiling: 1
    },
    yAxis: {
        title: {
            text: 'True Positive Rate'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }],
        ceiling: 1,
        gridLineWidth: 0
    },
    tooltip: {
        formatter: function () {
            return 'FPR: <strong>' + this.point.x + '</strong><br>' + 
            'TPR: <strong>' + this.point.y + '</strong>';
        }
    },
    legend: {
        title: {
          text: 'Classes'
        },
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: rocCurveData
  }

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

    </div>
  );
};

export default Results;