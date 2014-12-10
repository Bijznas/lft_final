// JavaScript Document
'use strict';
var width = 81;
var height = 112;
var playerCards=[];
var wrapper = document.getElementById("wrap");
var ind = document.getElementById("dt");
var stake = document.getElementById("stake");
var sum = document.getElementById("sum_total");

var cardThrowSpeed = 300;
var defaultBoatAmount = 5;
var tbl;
var counter=0;
				
var positions = [{top:180, left:10, rot:10},{top:350, left:170, rot:10},{top:350, left:470, rot:10},{top:350, left:770, rot:10},{top:180, left:960, rot:10}];


var game = new Game();
game.init();

function Game(){
	var that = this;
	this.cardDeck;
	this.intervalId=0;
	this.numPlayers = 5;
	this.players = [];
	this.table;
	this.currentBoat = defaultBoatAmount;
	this.currentSum = 0;
	var x=0, y=500;
	
	this.init = function(){
		//that.cardDeck = setupCards();
		that.cardDeck = that.setupCardsDeck();
		that.cardShuffle(1); 
		//setUpTable();
		that.table = document.getElementById("tables");
		tbl = that.table;
		///Setup deck of cards in tabls
		for(var i = that.cardDeck.length-1; i>=0; i--){
			y= y+0.1;
			that.cardDeck[i].divNode.style.left = y+'px';
			that.cardDeck[i].divNode.style.top = x+'px';
			that.table.appendChild(that.cardDeck[i].divNode);
		}
		
		///Setup players
		for(var i = 0; i<that.numPlayers; i++){
			var player = new Players();
			that.players.push(player);
		}
		
		that.distributeCards(0);
		
	}
	
	this.distributeCards = function(pos){
		if(pos<that.numPlayers*3){
			that.cardDeck[0].divNode.style.zIndex=pos;//to make the cards come upwards
			//console.log(getStyle(that.cardDeck[0].divNode,'z-index'));
			
			var anims = new Animator();
			anims.animate(that.cardDeck[0].divNode,positions[pos%that.numPlayers],cardThrowSpeed,pos+1,that.distributeCards);
			var card = that.cardDeck.shift();
			that.players[pos%that.numPlayers].cards.push(card);
		}
		
		if(pos == that.numPlayers*3){
			console.log(that.getFlushResult(that.players[0].cards)+"    "+that.getFlushResult(that.players[1].cards)+"      "+that.getFlushResult(that.players[2].cards));
			
			that.collectBoatAmount(that.currentBoat);
			ind.innerHTML="Collecting boat amount";
		}
	
	}
	
	
	this.collectBoatAmount = function(cash){
		var i;
		for(var i = 0;i<that.players.length;i++){
			that.players[i].showCash(cash, i, true);
			that.currentSum += cash;
			sum.innerHTML='Current Sum:'+that.currentSum;
			
		}
		
		
	}
	
	this.serverFoldProcess = function(player_pos){
		that.players[player_pos].disableControls(1);
		that.players[player_pos].displayNode('Packed');
		
		if(player_pos+1 == that.players.length) nextPlayer = 0;
			else nextPlayer = player_pos+1;
			
		if(that.players[nextPlayer].isPacked){
			that.serverProcess(nextPlayer);
		}else{
			that.players[nextPlayer].enableControls();
			ind.innerHTML = 'Player '+(player_pos+2)+' turn';
		}
	}
	
	this.serverCallProcess = function(player_pos){
		if(!that.ifBlindPresent() || (that.players[player_pos].isBlind)){
			var competing_cards = [];
			var competing_pos = [];
			that.players[player_pos].showCash(that.currentBoat, player_pos, false);
			that.players[player_pos].disableControls();
			
			var winner = {};
			for(var i=0;i < that.players.length;i++){
				if(!that.players[i].isPacked){
					that.players[i].showCards();
					competing_cards.push(that.players[i].cards);
					competing_pos.push(i);
				}	
			}
			winner = decideWinner(competing_cards,competing_pos);
			
			that.players[winner.pos].displayNode("Winner", winner.pos);
			that.players[winner.pos].showCash(that.currentSum, winner.pos, false, true);
			
			console.log('Player ' +(winner.pos+1));
		}
		
	}
	
	
	this.serverProcess = function(player_pos){
		
		var c = player_pos == undefined ? getRandom(0,that.players.length) : player_pos;
		
		if(player_pos || player_pos==0){
			
			that.players[c].disableControls(1);
			
				
			if(!that.players[c].isPacked){
				var subAmount,nextPlayer;
				if(that.players[c].isBlind || !this.ifBlindPresent()){
					subAmount = that.currentBoat;
				}else{
					subAmount = that.currentBoat*2;	
				}
				that.players[player_pos].showCash(subAmount, c, false);
				that.currentSum += subAmount;
				sum.innerHTML="Current Sum:" + that.currentSum;
			}
			
			
			if(c+1 == that.players.length) nextPlayer = 0;
			else nextPlayer = c+1;
			
			if(that.players[nextPlayer].isPacked){
				that.serverProcess(nextPlayer);
			}else{
				that.players[nextPlayer].enableControls();
				ind.innerHTML = 'Player '+(c+2)+' turn';
			}
			
		}else{
			that.players[c].enableControls();
			ind.innerHTML = 'Player '+(c+1)+' turn';
		}
		
		
	}
	
	
	this.getFlushResult = function(cards){
		
		var card1=cards[0];
		var card2=cards[1];
		var card3=cards[2];
		
		if(card1.rank == card2.rank && card2.rank == card3.rank){
			return 'Three of a kind '+ card1.rank;	
		}else if(isRun([card1, card2, card3])){
			if(card1.suit == card2.suit && card2.suit == card3.suit){
				return 'Double Run';
			}else{
				return 'You got Run';
			}
		}else if(card1.suit == card2.suit && card2.suit == card3.suit){
			return 'You got Color';
		}else if(isDouble([card1, card2, card3])){
			return 'You got Two of a kind'+ card1.rank;
		}else{
			return 'You got Top'+ sortMax([card1, card2, card3])[0];
		}
		
		return 'Not Yet Defined' + playerCards.length;
	}
	
	this.setupCardsDeck = function(){
		var ranks = new Array("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K");
  		var suits = new Array("C", "D", "H", "S");
  		var i, j, k;
  		var m;

  		m = ranks.length * suits.length;

  		// Set array of cards.
		this.cards = new Array(m);
	
		// Fill the array with '1' packs of cards.
		for (j = 0; j < suits.length; j++){
		  for (k = 0; k < ranks.length; k++){
			this.cards[j * ranks.length + k] = new Card(ranks[k], suits[j]);
			//this.cards[j * ranks.length + k].stateFront();
		  }
		}
	
		return this.cards;
	}
	
	this.ifBlindPresent = function(){
		for(var i = 0;i < that.players.length;i++){
			if(that.players[i].isBlind)
				return true;	
		}
		return false;
	}
	
	this.getRemainingPlayers = function(){
		var counter = 0;
		for(var i = 0;i < that.players.length;i++){
			if(!that.players[i].isPacked)
				counter++;	
		}
		if(counter>0){
			return counter;	
		}else{
			return false;
		}
	}
//--------------Shuffling the cards Deck	
	this.cardShuffle = function(n) {
	
		var i, j, k;
		var temp;
	
	  // Shuffle the stack 'n' times.
		for (i = 0; i < n; i++)
			for (j = 0; j < that.cardDeck.length; j++) {
				k = Math.floor(Math.random() * that.cardDeck.length);
				temp = that.cards[j];
				that.cardDeck[j] = that.cardDeck[k];
				that.cardDeck[k] = temp;
			}
	}
//--------------End Shuffling the cards Deck	
}




function Players(){
	var that = this;
	this.name;
	this.cards = [];
	this.cash = 1000;
	this.position={};
	this.isBlind = true;
	this.isPacked = false;
	this.butShow; 
	this.butBlind; 
	this.butCall;
	this.butPack; 
	this.cashInd;
	
	
	
	this.updateCash = function(add, amount,pos){
		if(add){
			that.cash = that.cash + amount;
		}else{
			that.cash = that.cash - amount;
		}
		
		//that.cashInd.innerHTML = 'Player '+ (pos+1)+' (Cash:' + that.cash+')';
		return that.cash;
	}	
	
	this.showCash = function(amount, pos, isFirst, add){
		
		var el = document.createElement('div');
		el.style.top = positions[pos].top + 'px';
		el.style.left = positions[pos].left + 'px';
		el.className = 'showcash';
		el.innerHTML = '-'+ amount;
		tbl.appendChild(el);
		
		
		
		if(!add){
			that.updateCash(false, amount);
			var anim = new Animator();
			anim.animate(el, {top:positions[pos].top-80}, 600, pos, function(pos){
			
					tbl.removeChild(el);	
					
					if(isFirst){
						ind.innerHTML='.....';
						that.showControls(pos);
					}else{
						that.cashInd.innerHTML = 'Player '+ (pos+1)+' (Cash:' + that.cash+')';
					}
			});
		}else{
			that.updateCash(true, amount);
			el.style.top = positions[pos].top-150 + 'px';
			el.style.color='#009900';
			var anim = new Animator();
			el.innerHTML = '+'+ amount;
			anim.animate(el, {top:positions[pos].top}, 1500, pos, function(pos){
			
					tbl.removeChild(el);	
					
					
					
			});	
		}
		
	}
	
	this.showControls = function(pos){
		that.cashInd = document.createElement('div');
		that.cashInd.style.top = positions[pos].top -50 + 'px';		
		that.cashInd.style.left = positions[pos].left- 30 + 'px';
		that.cashInd.className = 'but-show';
		that.cashInd.innerHTML = 'Player '+ (pos+1)+' (Cash:' + that.cash+')';
		tbl.appendChild(that.cashInd);
		
		
		
		that.butShow = document.createElement('button');
		that.butShow.style.top = positions[pos].top + 50 + 'px';
		that.butShow.style.left = positions[pos].left - 30 + 'px';
		that.butShow.className = 'but-show';
		that.butShow.innerHTML = 'see the cards';
		tbl.appendChild(that.butShow);
		
		
		that.butBlind = document.createElement('button');
		that.butBlind.style.top = positions[pos].top + 115 + 'px';
		that.butBlind.style.left = positions[pos].left + 40 + 'px';
		that.butBlind.className = 'but-show';
		that.butBlind.innerHTML = 'go blind';
		tbl.appendChild(that.butBlind);
		
		that.butCall = document.createElement('button');
		that.butCall.style.top = positions[pos].top + 115 + 'px';
		that.butCall.style.left = positions[pos].left - 70 + 'px';
		that.butCall.className = 'but-show';
		that.butCall.innerHTML = 'call';
		tbl.appendChild(that.butCall);
		
		that.butPack = document.createElement('button');
		that.butPack.style.top = positions[pos].top + 115 + 'px';
		that.butPack.style.left = positions[pos].left - 20 + 'px';
		that.butPack.className = 'but-show';
		that.butPack.innerHTML = 'fold';
		tbl.appendChild(that.butPack);
		
		
		that.butBlind.onclick = function(){
			console.log('blind Click');	
			
			game.serverProcess(pos);
		}
		
		
		that.butShow.onclick = that.showCards;
		
		
		
		
		
		that.butCall.onclick = function(){
			game.serverCallProcess(pos);
		}
		
		that.butPack.onclick = function(){
			that.isPacked = true;
			game.serverProcess(pos);
			that.displayNode('Packed',pos);
		}
		
		that.disableControls(pos);
		
		
	}
	this.showCards = function(){
		for(var i=0;i<that.cards.length;i++){
			that.cards[i].stateFront();	
		}	
		if(that.isBlind){
			tbl.removeChild(that.butShow);
			that.butBlind.innerHTML='go';
			
		}
		that.isBlind = false;
		
			
	}
	
	this.disableControls = function(pos){
		//that.butBlind.disabled=true;
		//that.butCall.disabled = true;
		
		that.butBlind.style.visibility='hidden';
		that.butPack.style.visibility='hidden';
		that.butCall.style.visibility='hidden';
		
		//console.log(counter);
		if(pos == 4){
			game.serverProcess();
		}
	
	}
	
	this.enableControls = function(){
		//that.butBlind.disabled=false;
		//that.butCall.disabled = false;
		
		that.butBlind.style.visibility='visible';
		that.butPack.style.visibility='visible';
		that.butCall.style.visibility='visible';
	
	}
	
	this.displayNode = function(msg,pos){
		console.log('dsnbskjdk');
		that.node = document.createElement('div');
		that.node.style.top = positions[pos].top + 'px';		
		that.node.style.left = positions[pos].left -30 + 'px';
		that.node.className = 'node';
		that.node.innerHTML = msg;
		tbl.appendChild(that.node);
	
	}
	
	
	
}


//--------------Card Object----------------
function Card(rank, suit) {
	var that = this;
	this.rank = rank;
	this.suit = suit;
	
	this.toString   = cardToString;
	this.divNode = makeNode();
	
  
  //this function create a div node for the card
	function makeNode(){
		var tempNode = document.createElement("div");
		tempNode.className='card-layout';
		tempNode.style.background='url(images/backs.png) 0px 0px no-repeat';
		return tempNode;

	}
	
	
	this.stateBack = function (){
		that.divNode.background='url(images/back.png) 0px 0px no-repeat';
	}
	
	this.stateFront = function(card){
		/*var x,y;
		if(that.rank == 'A' || that.rank == '14'){
			x = 0;
		}else{
			x = (1-cardNum(that.rank))*width;
		}
		if(that.suit == 'C'){
			y = 0;	
		}else if(that.suit == 'D'){
			y = -height;
		}else if(that.suit == 'H'){
			y = -2*height;
		}else if(that.suit == 'S'){
			y = -3*height;
		}
		that.divNode.style.background='url(images/sprite.png) '+x+'px '+y+'px no-repeat';*/
		
		var x,y;
		if(that.rank == 'A' || that.rank == '14'){
			x = 0;
		}else{
			x = ((1-cardNum(that.rank))*width);
		}
		if(that.suit == 'C'){
			y = 'club';	
		}else if(that.suit == 'D'){
			y = 'diamond';
		}else if(that.suit == 'H'){
			y = 'heart';
		}else if(that.suit == 'S'){
			y = 'spade';
		}
		that.divNode.style.background='url(images/'+y+'.png) '+x+'px no-repeat';
	}
	
	function cardToString() {
		var rank, suit;

		switch (this.rank) {
			case "A" :
      		  rank = "Ace";
      		  break;
			case "2" :
			  rank = "Two";
			  break;
			case "3" :
			  rank = "Three";
			  break;
			case "4" :
			  rank = "Four";
			  break;
			case "5" :
			  rank = "Five";
			  break;
			case "6" :
			  rank = "Six";
			  break;
			case "7" :
			  rank = "Seven";
			  break;
			case "8" :
			  rank = "Eight";
			  break;
			case "9" :
			  rank = "Nine";
			  break;
			case "10" :
			  rank = "Ten";
			  break;
			case "J" :
			  rank = "Jack"
			  break;
			case "Q" :
			  rank = "Queen"
			  break;
			case "K" :
			  rank = "King"
			  break;
			default :
      		  rank = null;
      		  break;
  		}

		switch (this.suit) {
			case "C" :
			  suit = "Clubs";
			  break;
			case "D" :
			  suit = "Diamonds"
			  break;
			case "H" :
			  suit = "Hearts"
			  break;
			case "S" :
			  suit = "Spades"
			  break;
			default :
			  suit = null;
			  break;
		}

		if (rank == null || suit == null)
			return "";

		return rank + " of " + suit;
	}
}

//--------------End Card Object----------------

var card1 = new Card('9','C');
var card2 = new Card('A','C');
var card3 = new Card('3','C');

var card4 = new Card('8','S');
var card5 = new Card('A','S');
var card6 = new Card('6','S');
//console.log(isDouble([card1,card2,card3]));
//console.log(getFlushJson([card1,card2,card3]));
//console.log(decideWinner([[card4,card5,card6],[card1,card2,card3],],[0,8]));
