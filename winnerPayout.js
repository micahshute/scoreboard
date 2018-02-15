
//User prototype for testing of this code
var users = [];

function User(userName, coinTotal){
	this.userName = userName;
	this.coinTotal = coinTotal;
}


for(var i = 0; i < 10; i++){
	users.push(new User(`User ${i + 1}`, 0))
}


//easier to write than to figure out how to import Math library
function power(x,y){
	if(y<0){
		return 1/(power(x,(-1 * y)));
	}

	var product = 1;
	for(var i = 0; i < y; i++){
		product *= x;
	}
	return product
}

//easier to write than figure out how to import Math library
function roundToInt(x){
	var fraction = x - parseInt(x);
	var firstDecimalPlace = parseInt(fraction * 10);
	if(firstDecimalPlace >= 5){
		return parseInt(x) + 1;
	}else{
		return parseInt(x);
	}
}



//Constructor for desired equation. This way we can change the equation
//we want to use by constructing a new EarningsEquation Object if the first one doesn't 
//work well
function EarningsEquation(coefficient, order){
	this.coefficient = coefficient;
	this.order = order;
	this.y = function(x){
		return coefficient * power(x,order);
	};
	this.integralEquation = function(){
		return (new EarningsEquation(this.coefficient / (order + 1), order + 1));
	}

}


//Object used to pay users. Equation used to calculate payment can be set 
//using the EarningEquation constructor above. 
var winningsATM = {
	earningsEquation: new EarningsEquation(1,3),
	integralEquation: (new EarningsEquation(1,3)).integralEquation(),
	payUsers: function(winnersArray, maxPay = 100, minPay = 1){
		var partitionsSize = 1 / winnersArray.length;
		var weightCoefficient = 1;
		for(var i = 0; i < winnersArray.length; i++){
			var areaUnderCurve = this.integralEquation.y(1.0 - (partitionsSize * i)) - this.integralEquation.y(1.0 - (partitionsSize * (i + 1)));
			if(i == 0){
				weightCoefficient = maxPay / areaUnderCurve;
			}
			var payout = areaUnderCurve * weightCoefficient;
			var intPayout = roundToInt(payout);
			if(intPayout < minPay){
				intPayout = minPay;
			}
			this.conductPayout(winnersArray[i], intPayout);
		}
	},
	conductPayout: function(user, amount){
		user.coinTotal = user.coinTotal + amount;
	}
}


//Using the above functions and objects to perform a sucessful payout

winningsATM.payUsers(users);

//test the payment
for(var i = 0; i < users.length; i++){
	console.log(users[i].coinTotal);
}
console.log("Test complete");

//reset users array
users = [];
for(var i = 0; i < 10; i++){
	users.push(new User(`User ${i + 1}`, 0));
}


//Pay again with custom set max and minimum values
winningsATM.payUsers(users, 70, 5);

//test the payment

for(var i = 0; i < users.length; i++){
	console.log(users[i].coinTotal);
}
console.log("Test complete");
//Change the equation from 1*(x^3) to 3*(x^2)
//NOTE: may be better to add a getter/setter for earningsEquation and integralEquation in order to 
//resetboth with the same command. Will look into it/


winningsATM.earningsEquation = new EarningsEquation(3,2);
winningsATM.integralEquation = winningsATM.earningsEquation.integralEquation();

//reset users array

users = [];

for(var i = 0; i < 10; i++){
	users.push(new User(`User ${i + 1}`, 0));
}

//pay users with new earnings equation
winningsATM.payUsers(users);

//test payment
for(var i = 0; i < users.length; i++){
	console.log(users[i].coinTotal);
}
console.log("Test complete");

