// JavaScript Document

console.log("start");
var ani =new Animation();
ani.init("circle",{
			top:100,
			left:100,
			topfinal:0,
			leftfinal:0,
			width:50,
			height:50,
			background:'000000'},1000);
			
var intervalId = setInterval(ani.move,30);
console.log("interval: "+intervalId);

function Animation(){
	
	var that=this;
	this.element;
	this.props;
	this.duration;
	this.initalColor;
	var increase=0;
	
	this.init = function(el,props,duration){
		that.element =document.getElementById(el);
		that.props = props;
		that.duration=duration;
	}
	
	this.move=function(){
		var x,y;
		if(that.props.top>that.props.topfinal){
			that.props.top--;
			
		}else if(that.props.top==that.props.topfinal){
			console.log("match top");
		}
		else{
			that.props.top++;
		}
		//console.log(that.props.left+"="+that.props.leftfinal);
		if(that.props.left>that.props.leftfinal){
			that.props.left--;
		}else if(that.props.left==that.props.leftfinal){
			console.log("match left");
		}else{
			that.props.left++;
		}

		if(that.props.top==that.props.topfinal&&that.props.left==that.props.leftfinal){
			console.log("finish");
			clearInterval(intervalId);
			console.log("interval: "+intervalId);
		}
		
		
		//that.props.width++;
		//that.props.height++;
		var color = parseInt(that.props.background,16);
		color++;
		that.props.background = color.toString(16);
		//console.log(color + "="+color.toString(16));
		that.element.style.width=that.props.width+"px";
		that.element.style.height =that.props.height + "px";
		that.element.style.marginLeft =that.props.left + "px";
		that.element.style.marginTop =that.props.top + "px";
		that.element.style.background = "#"+color.toString(16);
		
		//console.log(change+change+change);
	}
}