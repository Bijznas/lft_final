var el = document.getElementById('boxx');
rotated = false;
el.onclick = function() {
   // var div = document.getElementById('div'),
        deg = -10;

    el.style.webkitTransform = 'rotate('+deg+'deg)'; 
    el.style.mozTransform    = 'rotate('+deg+'deg)'; 
    el.style.msTransform     = 'rotate('+deg+'deg)'; 
    el.style.oTransform      = 'rotate('+deg+'deg)'; 
    el.style.transform       = 'rotate('+deg+'deg)'; 

    rotated = !rotated;
}




var anim = new Animator();
//anim.animate(el,{top:100,left:200},1000);


function Animator(){
	var that = this;
	this.element;
	this.props;
	this.duration;
	this.callback;
	this.intervalId;
	
	var frequency = 50;
	var counter = 0;
	this.ydirection=false;
	this.xdirection=false;
	var val=0;
	
	
	this.animate = function(el,props,duration){
		that.element = el;
		that.props = props;
		that.duration = duration;
		leftt = that.element.offsetLeft;
		if(that.element.offsetLeft>that.props.left){
			that.xdirection=false;
		}else{
			that.xdirection=true;
		}
		
		if(that.element.offsetTop>that.props.top){
			that.ydirection=false;
		}else{
			that.ydirection=true;
		}
		
		that.intervalId = setInterval(that.move, frequency);
		
	}	
	
	this.move = function(){
			counter++;
			if(that.xdirection){
				
				if(counter >= (that.duration/frequency)){
					console.log(that.element.offsetLeft);
					clearInterval(that.intervalId);
				}else{
					var valleft = (that.props.left-that.element.offsetLeft)/(that.duration/frequency)*counter;
					that.element.style.left = that.element.offsetLeft + valleft + 'px';	
					
				}
			
			
			}else{
				if(counter >= (that.duration/frequency)){
					clearInterval(that.intervalId);
					console.log(that.element.offsetLeft);
				}else{
					var valleft = (that.element.offsetLeft-that.props.left)/(that.duration/frequency)*counter;
					that.element.style.left = that.element.offsetLeft - valleft + 'px';	
					
				}
				
				
			}
			
			////for moving along
			if(that.ydirection){
				if(counter >= (that.duration/frequency)){
					console.log(that.element.offsetTop);
					clearInterval(that.intervalId);
				}else{
					var valtop = (that.props.top-that.element.offsetTop)/(that.duration/frequency)*counter;
					that.element.style.top = that.element.offsetTop + valtop + 'px';	
					
				}
			
			
			}else{
				if(counter >= (that.duration/frequency)){
					clearInterval(that.intervalId);
					console.log(that.element.offsetTop);
				}else{
					var valtop = (that.element.offsetTop-that.props.top)/(that.duration/frequency)*counter;
					that.element.style.top = that.element.offsetTop - valtop + 'px';	
					
				}
				
				
			}
			
			
		
		
	}
	
	this.stops = function(){
		clearInterval(that.intervalId);
		counter=0;
		that.cmargin = parseInt(that.element.style.marginLeft.split('px')[0]);
	}
	
	this.finish = function(){
		that.element.style.marginLeft = that.props.marginLeft+'px';
		that.cmargin = that.props.marginLeft;
		//console.log(that.props.marginLeft+'px');
		clearInterval(that.intervalId);
	}
	
}
