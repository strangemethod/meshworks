var app = (function(){
	
	function init(){
		app.canvas = document.getElementById("meshworks");
		app.pointsEl = document.getElementById("points");	
		app.connectionsEl = document.getElementById("connections");	
		app.validationEl = document.getElementById("validation");	
		app.countPoints = app.pointsEl.value;
		app.connectionDepth = app.connectionsEl.value;
		app.canvas.width = app.windowWidth = window.innerWidth;
		app.canvas.height = app.windowHeight =  window.innerHeight;
		app.ctx = app.canvas.getContext("2d");
		setupCanvas();
	}

	function setupCanvas(){

		app.points = [];

		// draw points
		for (var i=0; i<app.countPoints; i++){
			drawRandomPoint(i);
		}

		// draw lines
		for (var i=0; i<app.countPoints; i++){
			connectNearestPoints(i, app.connectionDepth);
		}
	}

	function clearCanvas(){

		var countPoints = Number(app.pointsEl.value);
		var connectionDepth = Number(app.connectionsEl.value);

		if (connectionDepth < countPoints){
			app.validationEl.textContent = '';
			app.countPoints = countPoints;
			app.connectionDepth = connectionDepth;
			app.ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);
			setupCanvas();

		} else {
			app.validationEl.textContent = 'There cannot be more connections than points.';
		}

	}

	function connectNearestPoints(i, depth){
			var point = app.points[i],
				exclusions = [i];

			// iterate grayscale values between 0-250
			var colorCoefficient = 250 / depth;

			for (var n=0; n<depth; n++){
				var closest = findClosestPoint(point, exclusions);
				var colorVal = n*colorCoefficient; // iterate color value
				drawLine(point, app.points[closest], colorVal);
				exclusions.push(closest);
				
			}
	}

	function getRandomArbitrary(min, max) {
		return Math.round(Math.random() * (max - min) + min);
	}

	function drawRandomPoint(index){
		point = {};
		point.x = getRandomArbitrary(0, app.windowWidth);
		point.y = getRandomArbitrary(0, app.windowHeight);
		// draw point
		app.ctx.fillRect(point.x, point.y, 1,1);
		// save point data
		app.points[index] = point;
		app.points[index]['index'] = index;
	}

	function findClosestPoint(point, exclusions){

		// max distance across window, via Pythagorus
		var maxDist = Math.sqrt((app.windowWidth*app.windowWidth)+(app.windowHeight*app.windowHeight)),
			closestDist = maxDist,
			closestIndex;

		// loop through all points again and compare to app.points[index]
		for (var i=0; i<app.countPoints; i++){
			// check exclusions array
			if (exclusions.indexOf(i) === -1) {
				var x = Math.abs(point.x - app.points[i].x),
					y = Math.abs(point.y - app.points[i].y),
					distance = Math.sqrt((x*x)+(y*y));
				if (distance < closestDist) {
					closestDist = distance;
					closestIndex = i;
				}
			}
		}

		// save closest node index, draw line to it, find line midpoint
		return closestIndex;
	}

	function drawLine(a,b, color){
		var rgb =  !color ? 'rgb(0,0,0)' : 'rgb('+color+','+color+','+color+')';
    	app.ctx.beginPath();
	    app.ctx.moveTo(a.x,a.y);
	    app.ctx.lineTo(b.x,b.y);
	    app.ctx.strokeStyle = rgb;
	    app.ctx.stroke();
	}

	return {
		init: init,
		redraw: clearCanvas
	}

})();

app.init();