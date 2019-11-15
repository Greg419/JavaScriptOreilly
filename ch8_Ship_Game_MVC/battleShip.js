/* -------- Structure ----------
| 1.View                        | 
| 2.Model                       | 
| 3.Controller                  | 
| 4.Functions                   | 
-------------------------------*/

// ----- View -----
// 顯示 hit/niss 時欲出現之訊息
// 顯示圖式(船艦/MISS)於玩家攻擊的座標位置 
var view = {
    displayMessage : function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    
    displayHit : function(location){
        // 抓取 id值為location的td, 並新增class屬性且將值設置為為hit
        // 在html檔案裡, 透過css設定, 即可將有class值為hit的td, 其background改為船艦的圖式(ship.png)
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    
    displayMiss : function(location) {
        // 同理於hit, 透過設定class值為miss, td的background會被設為miss.png
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
}

// ----- Model -----
// 1.紀錄遊戲狀態(棋盤大小 船艦數 擊沉數 船身長度 船艦物件)
// 2.判斷輸入值是否命中船艦
// 3.若命中 是否擊沉 且 結束遊戲
// functions: fire, isSunk, generateShipLocations, collision
var model = {
    borderSize : 7,
    numShips : 3,
    shipsSunk : 0,
    shipLength : 3,
    
    ships : [
        {locations : ["0", "0", "0"], hits : ["", "", ""]},
        {locations : ["0", "0", "0"], hits : ["", "", ""]},
        {locations : ["0", "0", "0"], hits : ["", "", ""]}
    ],
    
    // 判斷輸入值是否命中船艦
    fire : function (guess){
        for(var i=0; i<this.numShips; i++){
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            // 若都沒命中location ,index值會是 -1
            if(index >= 0){
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!! The guesses now is : " + controller.guesses);
                if(this.isSunk(ship)){
                    this.shipsSunk ++;
                    view.displayMessage("You sank a BattleShip!!");
                   }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("MISS!! The guesses now is : " + controller.guesses);
        return false;
    },
    // 判斷被擊中的船艦 是否所有部位都被hit
    isSunk : function (ship){
        for(var i = 0; i<this.shipLength; i++){ 
            if(ship.hits[i] !== "hit"){
                return false;
            }
        }
        return true;
    },
    
    // 於init()內被調用, 整個遊戲的起始切入點
    generateShipLocations : function () {
        var locations;
        for(var i = 0; i<this.numShips; i++){
            do{
                // generateShip回傳一組 該船艦所有座標的array
                locations = this.generateShip();
            // 若無碰撞 則跳出while迴圈
            } while(this.collision(locations));
            // 將第 i 條船艦存起來
            this.ships[i].locations = locations; 
        }
    },
    
    // 隨機產生縱向or橫向的一條船
    generateShip : function (){
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        
        if(direction === 1){
            // 產生水平船艦的起始位置
            row = Math.floor(Math.random() * this.borderSize);
            col = Math.floor(Math.random() * this.borderSize - this.shipLength);
        } else {
            // 產生垂直船艦的起始位置
            row = Math.floor(Math.random() * this.borderSize - this.shipLength);
            col = Math.floor(Math.random() * this.borderSize);
        }
        
        var tmpShipLocations = [];
        for(var i = 0; i<this.shipLength; i++){
            if(direction === 1){
                // 產生水平船艦的所有座標
                tmpShipLocations.push(row + "" + (col+i));
            } else {
                tmpShipLocations.push((row+i) + "" + col);
            }
        }
        return tmpShipLocations;
    },
    
    // 判斷隨機產生出的船艦 是否與已存在的船艦有碰撞
    collision : function (location) {
        for(var i = 0; i < this.ships.length; i++){
            for(var j = 0; j < this.shipLength; j++){
                if(this.ships[i].locations.indexOf(location[j]) >= 0){
                    return true;   
                }
            }
        }
        return false;
    }
}

// ----- Controller -----
// 1.驗證輸入值格式
// 2.驗證完將輸入值pass給 model.fire
// 3.判斷是否結束遊戲
// function : processGuess
var controller = {
    guesses : 0,
    
    processGuess :　function(guess) {
        var location = parseGuess(guess);
        if(location) {
            this.guesses ++;
            var hit = model.fire(location);
            // 遊戲結束條件(已擊沉數量 = 船艦數)
            if(hit && model.shipsSunk === model.numShips){
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses!!");
                //alert("You Win! Game Over.");
            }
        }
    }
}

/* -------- Global Functions ------------
| 1.parseGuess                          | 
| 2.handleFireButton                    | 
| 3.handleKeyPress                      | 
| 4.init                                | 
---------------------------------------*/

// 驗證玩家輸入數值
// 1.驗證長度
// 2.抓取猜測數值左位元之"英文"字母
// 3.透過 indexOf 比對左位元 並轉為數字
// 4.抓取猜測數值右位元之"數字"
// 5.判斷"左"+"右"位元值是否在範圍內 並回傳字串
function parseGuess(guess) {
    // 此array用於將 A-G 轉成 0-6 的值
    var alphabet = ["A","B","C","D","E","F","G"];
    
    if(guess === null || guess.length !== 2){
        alert("Please enter a number on board!!");
    } else {
        firstChar = guess.charAt(0);
        // 透過 indexOf 比對並回傳陣列 index 值, 達到將英文字母轉換為數字之目的
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);
        
        if(isNaN(row) || isNaN(column)){
           alert("Oops! that isn't on the board!!");
        } else if(row < 0 || row >= model.borderSize ||
           column <0 || column >= model.borderSize){
            alert("Please enter a number inside the range!!");
        } else {
            // 此處回傳為 字串
            return row + column;
        }
    }
    return null;
}

// 監聽按下 fireButton 後所執行的方法
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    controller.processGuess(guessInput.value);
    
    // 清空 text內的值, 免去要輸入下一個座標時 要手動清除的麻煩
    guessInput.value = "";
}

// 監聽text, 若於text內按下enter, 則按下 fireButton 按鈕
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();
        return false;
    }
}

function init() {
    // 將所有船艦產生於棋盤上後, 就可以開始監聽使用者輸入
    model.generateShipLocations();
    
    var fireButton = document.getElementById("fireButton");
    // 監聽 點擊 fireButton 事件
    fireButton.onclick = handleFireButton;
    
    var guessInput = document.getElementById("guessInput");
    // 監聽 於 text 內 敲擊鍵盤 事件
    guessInput.onkeypress = handleKeyPress;
}
    


window.onload = init;

    