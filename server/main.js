import fs from 'fs';
import path from 'path';
import parse from 'csv-parse';

// Saves file sent by file input in DataSelection component
// TO DO: Create file and folder if they don't exist yet
WebApp.connectHandlers.use('/upload',function(req,res){
  const dataset_path = path.resolve('../../../../../datasets~/test.csv');
  console.log("Writing dataset to", dataset_path);
  let file = fs.createWriteStream(dataset_path); 

  file.on('error',function(error){
    console.log(error);
  });
  file.on('finish',function(){
    res.writeHead(200) 
    res.end();
    console.log("Finished writing dataset.")
  });

  req.pipe(file);
});



const parser = parse({delimiter: ';'}, function(err, data){
  colnames = data[0][0].split(',');
  console.log(colnames);
});

dataset_path = path.resolve('../../../../../datasets~/test.csv');
console.log('Path:', dataset_path);
fs.createReadStream(dataset_path).pipe(parser);