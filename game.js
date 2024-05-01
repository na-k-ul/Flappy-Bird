const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1132;
canvas.height = 400;
var start = false;

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render();
    requestAnimationFrame(animate);
}

class Player{
    constructor(game){
        this.game = game;
        this.x = 200;
        this.y = 100;
        this.height = 70;
        this.width = 70;
        this.speedY = this.game.gravity;
        this.jump = false;
        this.img = document.getElementById('ima');
    }
    update(){
        if(this.y < canvas.height - this.height & start){
            document.getElementById('canvas1').classList.remove('hide');
            document.getElementById('begin').classList.add('hide');
            this.y += this.game.gravity * this.speedY;
            this.speedY += 0.50;
        }
        if(this.y < 0){
            this.jump = false;
        }
        if(this.jump){
            this.speedY = -20;
        }
    }
    checkloss(){
        if(this.y >= canvas.height - this.height){
            this.game.background.update(0);
            this.game.background.draw();
            setTimeout(e => {
                document.getElementById('canvas1').classList.add('hide');
                document.getElementById('begin').classList.remove('hide');
                this.y = 100;
                start = false;
                this.speedY = this.game.gravity;
            }, 2000);
            
        }
    }
    draw(){
        //ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.drawImage(this.img, this.x, this.y, 84,69);
    }
}

class Background{
    constructor(game){
        this.game = game;
        this.bg = document.getElementById('image-back');
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
    }
}

class Game{
    constructor(canvas, context){
        this.canvas = canvas;
        this.ctx = context;
        this.gravity = 0.13;
        this.player = new Player(this);
        this.background = new Background(this);
    }
    render(){
        this.background.update(1);
        this.background.draw();
        this.player.update();
        this.player.checkloss();
        this.player.draw();
    }
}

window.addEventListener('keydown', function(e){
    if(e.code === 'Space'){
        if(start === false){
            start = true;
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

function startGame(){
    start = true;
}