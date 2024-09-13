// Default, Player ,Player Size TODO
let board;
let boardWidth = 1000; //TODO ขนาดบอร์ดตามต้องการ
let boardHeight = 300;
let context;
let playerWidth = 100;
let playerHeight = 100;
let playerX = 50;
let playerY = 200;
let playerImg;
let player = {
    x: playerX,
    y: playerY,
    width: playerWidth,
    height: playerHeight
};

//TODO แก้รูปภาพตรง src
playerImg = new Image();
playerImg.src = "kitty.png";

let gameOver = false;
let score = 0;
let time = 0;
let live = 3;

//TODO แก้รูปภาพสิ่งกรีดขวาง
let boxes = [
    "kitty4.png", // box1 image
    "policekitty.png", // Replace with another box image link
    "kitty7.png"
];
// Setting Object
let boxesArray = [];
let boxSpeed = -8; //TODO ความเร็วของกล่อง(สิ่งกรีดขวาง)

// Gravity, Velocity
let VelocityY = 0;
let Gravity = 0.25;

let Retry = document.getElementById("RetryButton");
let RetryDelay = false

console.log(player);
window.onload = function () {
    // Display
    board = document.getElementById("Board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Player
    playerImg.onload = function () {
        context.drawImage(playerImg, player.x, player.y, player.width, player.height);
    };

    // Request animation frame
    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    Retry.addEventListener("click", ()=>{
        if(RetryDelay){
        
        }else{
            RetryDelay = true
            setTimeout(() => {
                gameReset()
                RetryDelay=false
                }, 1000);
            }
        }   );

    
    createBoxWithRandomInterval();
};

// Function to create a box at a random time interval
function createBoxWithRandomInterval() {

    if (gameOver) {
        return;
    }

    createBox(); // Create a box

    // Generate a random time between 1 and 3 seconds (1000 to 3000 milliseconds)
    let randomTime = rnd(1000, 2500); //TODO Set เวลา 1000 คือ 1 วิ

    // Use setTimeout instead of setInterval to create boxes at random times
    setTimeout(createBoxWithRandomInterval, randomTime);
}

function rnd(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}

// Update Function
function update() {
    requestAnimationFrame(update); // Always update animation

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    VelocityY += Gravity;

    player.y = Math.min(player.y + VelocityY, playerY);
    context.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (let index = 0; index < boxesArray.length; index++) {
        let box = boxesArray[index];
        box.x += boxSpeed;
        context.drawImage(box.img, box.x, box.y, box.width, box.height);

        if (onCollision(player, box)) {
            gameOver = true;
            live -= 1;

            context.font = "normal bold 40px Arial"; //TODO Set font กรณีอยากเปลี่ยน Font
            context.textAlign = "center";
            context.fillText("GameOver!", boardWidth / 2, boardHeight / 2);
            context.fillText("Your Score : "+score,boardWidth/2 ,(boardHeight/2)+50);


            setTimeout(() => {
                Retry.style.display = "block";
            }, 500);
        }
    }
    score++;
    time += 0.01;
    context.font = "normal bold 30px Arial";
    context.textAlign = "left";
    context.fillText("Score : " + score, 200, 40); //TODO แก้ว่า Score อยู่ตรงไหน
    context.fillText("Time : " + time.toFixed(0), 20, 40);
    context.fillText("Live Remain : " + live, 20, 80);
    if (time >= 60) {
        gameOver = true;
        context.font = "normal bold 40px Arial"; //TODO แก้font + ลบComment
        context.textAlign = "center";
        context.fillText("You Won! With Score :" + score, boardWidth / 2, boardHeight / 2);
        
    }
}

function movePlayer(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "Space" && player.y === playerY) {
        VelocityY = -10;
    }
}

function createBox(e) {
    if (gameOver) {
        return;
    }

    let randomType = rnd(0, boxes.length);
    let boxImg = new Image(), boxWidth, boxHeight, boxSpeed,boxX = 1000,boxY;

    //TODO set width height Y
    if (randomType === 0) {
        boxImg.src = boxes[0];
        boxWidth = 100;
        boxHeight = 100;
        boxSpeed = -3; // Default speed
        boxY = 205;
    } else if (randomType === 1) {
        boxImg.src = boxes[1];
        boxWidth = 100;
        boxHeight = 100;
        boxSpeed = -4;
        boxY = 202;
    } else {
        boxImg.src = boxes[2];
        boxWidth = 90;
        boxHeight = 90;
        boxSpeed = -3;
        boxY = 210;
    }

    let box = {
        img: boxImg,
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
        speed: boxSpeed
    };

    boxesArray.push(box);

    if (boxesArray.length > 5) {
        boxesArray.shift();
    }
}

function onCollision(obj1, obj2) {
    return obj1.x < (obj2.x + obj2.width) && (obj1.x + obj1.width) > obj2.x // Crash in X move
        && obj1.y < (obj2.y + obj2.height) && (obj1.y + obj1.height) > obj2.y; // Crash in Y move
}

function gameReset() {
    if (!gameOver) {
        return;
    }

    
    if (live > 0) {
        setTimeout(() => {
            gameOver = false;
            Retry.style.display = "block"; // Hide the Retry button
            score = 0;
            time = 0;
            boxesArray = [];
            VelocityY = 0; // Reset gravity effect
            player.y = playerY; // Reset player position

            createBoxWithRandomInterval(); // Restart creating boxes
        }, 500);
        
    }
}

function refreshPage() {
    location.reload(); // This reloads the current page
}