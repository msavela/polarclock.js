window.requestAnimFrame = (function()
{
	return window.requestAnimationFrame		||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function(callback)
		{
			window.setTimeout(callback, 1000 / 60);
		};
})();

Math.deg2rad = function(deg) { return deg * (Math.PI/180); }

var PolarClock = function(canvas)
{
	var _sStroke = "#94AA2C", _mStroke = "#CCB321", _hStroke = "#6694AC";
	var _dayOfTheWeekStroke = "#C91E5A", _dayOfTheMonthStroke = "#E46F39", _monthStroke = "#33CCFF";

	var _canvas = canvas, _context, _animation, _radius, _perimeter, _x, _y;
	var _run = false, _self;
	var _date, _seconds, _minutes, _hours, _dayOfTheWeek, _dayOfTheMonth, _month;
	var _strokeWidth = 25, _spacing = 5;
	
	var _weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	var _months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	this.start = function()
	{
		if(!_canvas.getContext) return this;
		
		_context = _canvas.getContext("2d");
		_context.lineCap = "round";
		_context.font = "bold 12px Sans-serif";
		
		_run = true;
		this.draw();
		return this;
	};
	
	this.stop = function()
	{
		_run = false;
		return this;
	};
	
	this.draw = function()
	{
		if(!_canvas || !_context) return;
		
		_self = this;
		if(_run)
			requestAnimFrame(function(){ _self.draw(); });
		
		_date = new Date();
		_seconds = _date.getSeconds() + (_date.getMilliseconds()/1000);
		_minutes = _date.getMinutes() + (_seconds/60);
		_hours = _date.getHours() + (_minutes/60);
		//if(_hours >= 13) _hours -= 12; // 12 hours instead of 24 TODO
		
		_dayOfTheWeek = _date.getDay() == 0 ? 6 : _date.getDay() - 1; // Make sunday the last day of the week
		_dayOfTheMonth = _date.getDate();
		_month = _date.getMonth();
		
		_context.clearRect(0, 0, _canvas.width, _canvas.height);

		this.drawArc(0, (_seconds/60)*360, _sStroke, Math.round(_seconds) + " seconds"); // Seconds
		this.drawArc(1, (_minutes/60)*360, _mStroke, Math.round(_minutes) + " minutes"); // Minutes
		this.drawArc(2, ((_hours >= 13 ? _hours-12 : _hours)/12)*360, _hStroke, Math.round(_hours) + " hours"); // Hours
		
		this.drawArc(4, (_dayOfTheWeek/6)*360, _dayOfTheWeekStroke, _weekDays[_dayOfTheWeek]); // Day of the week

		var dayOfTheMonthSuffix;
		if(_dayOfTheMonth == 1) dayOfTheMonthSuffix = "st";
		else if(_dayOfTheMonth == 2) dayOfTheMonthSuffix = "nd";
		else if(_dayOfTheMonth == 3) dayOfTheMonthSuffix = "rd";
		else dayOfTheMonthSuffix = "th";

		this.drawArc(5, (_dayOfTheMonth/31)*360, _dayOfTheMonthStroke, _dayOfTheMonth + dayOfTheMonthSuffix); // Day of the month
		this.drawArc(6, (_month/11)*360, _monthStroke, _months[_month]); // Month
	};
	
	this.drawArc = function(offset, angle, strokeStyle, label)
	{
		_radius = (_canvas.width/2) - (_strokeWidth/2) - (_strokeWidth*offset) - (_spacing*offset);

		_perimeter = 2 * Math.PI * _radius;
		var minWidthAngle = (_context.measureText(label).width / _perimeter) * 360;
		if(angle < minWidthAngle)
			angle = minWidthAngle;
		
		_context.strokeStyle = strokeStyle;
		_context.lineWidth = _strokeWidth;
		_context.beginPath();
		_context.arc(_canvas.width/2, _canvas.height/2, _radius, Math.deg2rad(-90), Math.deg2rad(-90 + angle), false);
		_context.stroke();
		_context.closePath();
		
		this.drawText(label, angle, _radius, _perimeter);
	};
	
	this.drawText = function(text, angle, radius, perimeter)
	{
		_context.fillStyle = "#000";
		_context.textBaseline = "middle";
		
		var angleDiff = ((_context.measureText(text).width / _perimeter) * 360) * -1;
		
		for(i=0;i<text.length;i++)
		{
			_x = Math.cos(Math.deg2rad(-90 + angle + angleDiff )) * radius + _canvas.width/2;
			_y = Math.sin(Math.deg2rad(-90 + angle + angleDiff )) * radius + _canvas.height/2;
			
			_context.save();
			_context.translate(_x, _y);
			_context.rotate(Math.deg2rad(angle + angleDiff));
			_context.fillText(text[i], 0, 0);
			_context.restore();
			
			angleDiff += (_context.measureText(text[i]).width / _perimeter) * 360;
		}
	};
}