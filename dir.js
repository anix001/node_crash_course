const { hasSubscribers } = require('diagnostics_channel');
const fs = require('fs');

//creating directory
if(!fs.existsSync('./new')){
    fs.mkdir('./new', err=>{
        if(err) throw err;
        console.log("directory created.")
    })
}

//removing directory
if(fs.existsSync('./new')){
    fs.rmdir('./new', err=>{
        if(err) throw err;
        console.log("directory created.")
    })
}