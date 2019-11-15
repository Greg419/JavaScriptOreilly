//var userInput = prompt("JS 輸入資料測試環境");
//
//console.log("The userInput is : " + userInput);
//
//var oPerson = {
//    country : "Taiwan",
//    height : 171,
//    age : 34
//};
//
//console.log(typeof(userInput));
//console.log(typeof(oPerson));

var location1 = 3;
var location2 = 4;
var location3 = 5;
var guess = 0;
var hit = 0;
var guesses = 0;
var isStunk = false;
var hitHead =false, hitBody = false, hitTail = false;

while(isStunk == false){
    guess = prompt("準備，第" + guesses + "次射擊!! (鍵入範圍 0 ~ 6 的數字) :");
    
    if(guess < 0 || guess > 6){
        
        alert("請輸入有效數字");
        
    } else{
        guesses += 1;
        
        if(guess == location1 && hitHead == false){
            hit ++;
            hitHead = true;
            alert("擊中船艦 Head, 命中次數 : " + hit);
        }else if(guess == location2 && hitBody == false){
            hit ++;
            hitBody = true;     
            alert("擊中船艦 Body, 命中次數 : " + hit);
        }else if(guess == location3 && hitTail == false){
            hit ++;
            hitTail = true;
            alert("擊中船艦 Tail, 命中次數 : " + hit);
        }
        
        if(hit == 3){
            alert("擊沉船艦!! 命中率為 : " + 3/guesses);
            isStunk = true;
        }
                  
    }
}
