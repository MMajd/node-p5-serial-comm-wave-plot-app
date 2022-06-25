var socket = undefined; 

var windowHistory = []; 

var hasHistory = false; 
var payload = 'G'; 

let time, pinValue;

function setup() {
	createCanvas(windowWidth, windowHeight); 
	var gui = new dat.GUI(); 

	gui.add(this, 'payload').name("Payload"); 
	gui.add(this, 'send').name("Send Payload . . ."); 

	socket = io.connect('http://localhost:3000'); 
	socket.on('samples', setSamples); 
}

function send() { 
	if(payload === '') {
		alert("Enter N for NO, or G for GO and more samples"); 
		return;
	}
	socket.emit('payload', payload); 
}

function setSamples(samples) {
	console.log(windowHistory); 

	if(hasHistory) windowHistory = []; 

	for(let i=0; i<samples.length; i++) {
		windowHistory.push(samples[i]); 
	}
	hasHistory = true; 
}


function draw() {
	background(255);
	for (var x = 0; x < width; x += width / 80) {
		for (var y = 0; y < height; y += height / 40) {
			stroke(200);
			strokeWeight(1);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
	drawHistory(); 
}

function drawHistory() { 
	if(!hasHistory) return; 

	windowHistory.sort(compare); 

	noFill(); 
	stroke(255, 0, 0); 
	strokeWeight(2); 
	beginShape(); 
	for(var i=10; i<windowHistory.length-10; i++) {
		time = map(windowHistory[i].time * 8.2, 0, windowWidth, 100, width); 
		pinValue = map(windowHistory[i].pinValue, 0, 255, 500, 100);
		curveVertex(time, pinValue); 
	}
	endShape(); 
}

function compare(a, b){
	if(a.time > b.time) return -1; 
	return 1; 
}	