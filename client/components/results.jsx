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
  let chartData = [];
  for (let [i, col] of results.cnfMatrix.entries()) {
    for (let [i2, x] of col.entries()) {
      chartData.push([i, i2, x]);
    }
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

  const config = {
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
        data: chartData,
        dataLabels: {
            enabled: true,
            color: '#000000'
        }
    }]
  };

  return (
    <div className="model-stats">
      <ul className="list-unstyled">
        <li><h2><em>Model accuracy: </em>{roundedScore}</h2></li>
        <li><h2><em>Baseline accuracy: </em>{roundedBaselineAcc}</h2></li>
      </ul>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Class</th>
            <th>Precision</th>
            <th>Recall</th>
            <th>F1 score</th>
            <th>Support</th>
          </tr>
        </thead>      
        <tbody>
          {renderClassificationReport()}
        </tbody>
      </table>

      <hr />
      <ReactHighcharts config={config}></ReactHighcharts>
    </div>
  );
};

export default Results;