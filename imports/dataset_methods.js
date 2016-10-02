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

    dataset_path = path.resolve('../../../../../datasets~/test.csv');
    console.log('Dataset path to get column names from:', dataset_path);
    fs.createReadStream(dataset_path).pipe(parser);
    return future.wait();
  },

  'runPython': function(scriptName, target, time) {
    const future = new Future();
    dataset_path = path.resolve('../../../../../datasets~/test.csv');
    python_path = '/Users/alex/anaconda/envs/p3/bin/python'
    script_path = path.resolve('../../../../../imports/python_scripts/' + scriptName);
    console.log('Running Python script named', scriptName, 'at', script_path);

    const proc = spawn(python_path, [script_path, target, time]);

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