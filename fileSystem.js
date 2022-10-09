// const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');


//best way 
const fileOperations = async()=>{
    try{
      const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8');
      console.log("data: ", data);
      //to delete file
    //   await fsPromises.unlink(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
      await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data);
      await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'),'\n\n appending to the file.');
      await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'),'\n\n appending to the file.');
      await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseWriteComplete.txt'));
      const newdata = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseWriteComplete.txt'), 'utf8');
      console.log("nw data", newdata);
    }catch(err){
        console.error(err);
    }
}

fileOperations();

//sync
 //read file way 1
// fs.readFile('./files/starter.txt', 'utf8', (err, data)=>{
//     if(err) throw err;
//     // if utf8 is not written 
//     // console.log("data:", data?.toString());
//     console.log("data:", data);
// });

//read file way 2
// fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8', (err, data)=>{
//     if(err) throw err;
//     // if utf8 is not written 
//     // console.log("data:", data?.toString());
//     console.log("data:", data);
// });


//writefile 
//  it is okay but looks like callback hell 
// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you', (err)=>{
//     if(err) throw err;
//     console.log('Write complete');

//     //appendfile
//     fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\nYes it is.', (err)=>{
//         if(err) throw err;
//         console.log('Write complete');

//         //renamefile
//         fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt') , (err)=>{
//             if(err) throw err;
//             console.log('rename complete');
//         })
//     })
// });



//exit on uncaught errors
process.on('uncaughtException', err=>{
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})