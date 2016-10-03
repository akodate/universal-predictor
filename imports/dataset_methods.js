import fs from 'fs';
import parse from 'csv-parse';
import path from 'path';
import Future from 'fibers/future';
import { spawn } from 'child_process';

Meteor.methods({
  // Uses futures to asynchronously read, write, parse, and return the column names
  'getColNames': function() {
    const future = new Future();

    // TODO: Stop this from streaming the entire dataset just to get column names
    const parser = parse({delimiter: ','}, function(err, data){
      const colNames = data[0];
      future.return(colNames);
    });

    const datasetPath = path.resolve('../../../../../datasets~/test.csv');
    console.log('Dataset path to get column names from:', datasetPath);
    fs.createReadStream(datasetPath).pipe(parser);
    return future.wait();
  },

  'runPython': function(scriptName, target, time) {
    const future = new Future();
    const datasetPath = path.resolve('../../../../../datasets~/test.csv');
    const pythonPath = '/Users/alex/anaconda/envs/p3/bin/python'
    const scriptPath = path.resolve('../../../../../imports/python_scripts/' + scriptName);
    console.log('Running Python script named', scriptName, 'at', scriptPath);

    const proc = spawn(pythonPath, [scriptPath, datasetPath, target, time]);

    proc.stdout.on('data', function (data){
      parsedData = data.toString();
      console.log(parsedData);
    });

    proc.stdout.on('end', () => {
      console.log('Finished reading output from Python.');
      future.return(parsedData);
    });

    return future.wait();
  }
});