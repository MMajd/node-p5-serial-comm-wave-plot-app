const socket = require('socket.io'); 
const express = require('express'); 
const serialport = require('serialport'); 

let bufferArray = []; 
let currentBuffer = [];
let samples = []; 


var port =  new serialport('COM2', (err) => {
    console.log(err); 
});  

var app = express(); 
app.use(express.static('client'));  

var io = socket(app.listen(3000));

io.on('connection', (socket) => { 
    console.log("connected to: " + socket.id); 
    socket.on('payload', message);
}); 

function message(payload) { 
    console.log(payload); 
    port.write(payload); 
}

port.on('data', onData); 

function onData(data) {
    for(let i=0; i<data.length; i++) {
        if(currentBuffer.length == 7) {
            bufferArray.push(currentBuffer);
            currentBuffer = [];  
        } 
        currentBuffer.push(data[i]); 
    }
    if(bufferArray.length == 99) {    
        if(currentBuffer.length == 7) {
            bufferArray.push(currentBuffer);
            currentBuffer = [];  
        } 
        printBuffer();
   }
}

function printBuffer() { 
    for(let i=0; i<bufferArray.length; i++) {
        let j = 0; 
        pinValue = bufferArray[i][++j]; 
        time = bufferArray[i][++j] << 24 || bufferArray[i][++j] << 16 || bufferArray[i][++j] << 8 || bufferArray[i][++j] << 0;
        
        samples.push({ pinValue: pinValue, time: time }); 
    }
    bufferArray = []; 

    io.emit('samples', samples); 
    samples = []; 
} 
