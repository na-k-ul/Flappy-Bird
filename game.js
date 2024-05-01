const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1132;
canvas.height = 400;
var start = false;
var framecount = 0;
var score = 0;
var bestscore = 0;
var obssize = [];
var obsloc = [];

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render();
    requestAnimationFrame(animate);
}

function lostwords(){
    document.getElementById('texts').innerHTML = "You Lost. Press R to restart. Your score: " + score;
    bestscore = Math.max(score, bestscore);
    document.getElementById('best-score').innerHTML = "Best Score: " + bestscore;
}

function startwords(){
    document.getElementById('texts').innerHTML = "Hit Spacebar to Jump";
    document.getElementById('best-score').innerHTML = "Best Score: " + bestscore;
}

class Obstacles{
    constructor(game){
        this.game = game;
        this.height = canvas.height;
        this.y;
        this.obstacle_width = 20;
        this.update();
        ctx.fillStyle = '#222831';
    }
    update(){
        setInterval(e => {
            if(start){
                this.random = Math.floor(Math.random() * 120);
                this.top = 50 + this.random;
                obssize.push(this.top);
                obsloc.push(canvas.width);
            }
        }, 1500);
    }
    draw(y){
        for(var i=0; i<obssize.length; i++){
            obsloc[i] -= y;

            ctx.fillRect(obsloc[i], 0, this.obstacle_width, obssize[i]);  
            ctx.fillRect(obsloc[i], obssize[i] + 180, this.obstacle_width, 220 - obssize[i]);
        }
    }
    checkloss(){
        for(var i=0; i<obsloc.length; i++){
            if(((this.game.player.x + this.game.player.width >= obsloc[i] && this.game.player.x + (this.game.player.width/4) < obsloc[i] + this.obstacle_width) && (this.game.player.y <= obssize[i] || this.game.player.y + this.game.player.height > obssize[i] + 180 )) || ((this.game.player.x + (this.game.player.width/4) >= obsloc[i] && this.game.player.x < obsloc[i] + this.obstacle_width) && (this.game.player.y + (this.game.player.height/2) <= obssize[i] || this.game.player.y + this.game.player.height - 10 > obssize[i] + 180 ))) {
                this.game.z = 0;
                this.game.y = 0;
                this.game.player.speedY = 0;
                lostwords();
            }
        }
    }
    scorecount(){
        for(var i=0; i<obsloc.length; i++){
            if(obsloc[i] + this.obstacle_width < this.game.player.x){
                score = i + 1;
            }else{
                break;
            }
        }
        document.getElementById('texts').innerHTML = "Score: " + score;
        bestscore = Math.max(score, bestscore);
        document.getElementById('best-score').innerHTML = "Best Score: " + bestscore;
    }
}

class Player{
    constructor(game){
        this.game = game;
        this.x = 200;
        this.y = 200;
        this.width = 84;
        this.height = 69;
        this.speedY = this.game.gravity;
        this.jump = false;
        this.img_up = document.getElementById('image-bird-up');
        this.img_down = document.getElementById('image-bird-down');
        this.img_dead = document.getElementById('image-bird-dead');
    }
    update(){
        if(this.y < canvas.height - this.height & start){
            this.y += this.game.gravity * this.speedY;
            this.speedY += 0.50;
        }
        if(this.y < 0){
            this.jump = false;
        }
        if(this.jump){
            this.speedY = -15;
        }
    }
    checkloss(){
        if(this.y >= canvas.height - this.height){
            this.game.z = 0;
            this.game.y = 0;
            this.speedY = 0;
            start = false;
            lostwords();
        }
    }
    draw(){
        if(this.jump & this.game.z){
            ctx.drawImage(this.img_down, this.x, this.y, this.width, this.height);
        }
        else if(this.game.z === 0){
            ctx.drawImage(this.img_dead, this.x, this.y, this.width, this.height);
            framecount = 0;
        }
        else{
            ctx.drawImage(this.img_up, this.x, this.y, this.width, this.height);
            framecount = 0;
        }
        
    }
}

class Background{
    constructor(game){
        this.game = game;
        this.bg = document.getElementById('image-back');
        this.go = document.getElementById('image-gameover');
        this.width = canvas.width;
        this.height = canvas.height;
        this.x = 0;
        this.x2 = this.width;
    }
    update(z){
        if(this.x2 == 0){
            this.x = 0;
            this.x2 = this.width;
        }
        this.x -= z;
        this.x2 -= z;
    }
    draw(){
        ctx.drawImage(this.bg, this.x, 0, this.width, this.height);
        ctx.drawImage(this.bg, this.x2, 0, this.width, this.height);
        if(this.game.z === 0){
            ctx.filter = 'blur(20px)';
            ctx.drawImage(this.bg, this.x, 0, this.width, this.height);
            ctx.drawImage(this.bg, this.x2, 0, this.width, this.height);
            ctx.filter ='none';
            ctx.drawImage(this.go, 0, 0, this.width, this.height);
        }
    }
}

class Game{
    constructor(canvas, context){
        this.canvas = canvas;
        this.ctx = context;
        this.gravity = 0.13;
        this.player = new Player(this);
        this.background = new Background(this);
        this.obstacles = new Obstacles(this);
        this.y = 1;
        this.z = 1;
    }
    render(){
        this.background.update(this.z);
        this.background.draw();
        this.player.update();
        this.player.draw();
        this.player.checkloss();
        if(start){
            this.obstacles.draw(this.y);
            this.obstacles.scorecount();
        } 
        this.obstacles.checkloss();
    }
}

window.addEventListener('keydown', function(e){
    if(e.code === 'KeyR'){
        game.player.y = 200;
        start = false;
        game.player.speedY = game.gravity;
        game.z = 1;
        game.y = 1;
        obssize = [];
        obsloc = [];
        score = 0;
        startwords();
    }
});

window.addEventListener('keydown', function(e){
    if(e.code === 'Space'){
        if(start === false){
            start = true;
            game.player.jump = true;
        }
        else{
            game.player.jump = true;
        }
    }
});

window.addEventListener('keyup', function(e){
    if(e.code === 'Space')
        game.player.jump = false;
});


const game = new Game(canvas, ctx);
animate();  
