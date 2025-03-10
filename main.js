
/************************************************************
 * メイン画面
 ************************************************************/

var mainScene = new Phaser.Scene("mainScene");

var board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
             [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

var turn = 0;

mainScene.preload = function()
{
    this.load.image("board", "img/board.png");
    this.load.image("button", "img/button.png");
    this.load.image("message", "img/message.png");
    this.load.spritesheet("stone", "img/stone.png", { frameWidth: 20, frameHeight: 20 });
    this.load.spritesheet("string", "img/string.png", { frameWidth: 16, frameHeight: 32 });
}

mainScene.create = function()
{
    this.add.image(160, 240, "board");
    
    var stone = [];
    for(var x = 0; x < board.length; x++)
    {
        stone[x] = [];
        for(var y = 0; y < board[x].length; y++)
        {
            stone[x][y] = this.add.sprite(x * 24 + 16, y * 24 + 16, "stone").setInteractive();
            stone[x][y].posX = x;
            stone[x][y].posY = y;
            
            
            
            
            stone[x][y].on("pointerdown", clickStone);
        }
    }
    
    
    var button1 = this.add.image(84, 340, "button").setInteractive();
    var button2 = this.add.image(236, 340, "button").setInteractive();
    var message = this.add.image(160, 420, "message");
    
    button1.alpha = 0.8;
    button2.alpha = 0.8;
    message.alpha = 0.8;
    
    button1.on("pointerdown", clickButton1);
    button2.on("pointerdown", clickButton2);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}

mainScene.update = function()
{
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}


var clickButton1 = function()
{
    
}

var clickButton2 = function()
{
    
}

var clickStone = function()
{
    if(board[this.posX][this.posY] == 0)
    {
        if(turn % 2 == 0)
        {
            board[this.posX][this.posY] = 1;
        }
        else
        {
            board[this.posX][this.posY] = 2;
        }
        this.setFrame(board[this.posX][this.posY]);
        turn++;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}














/************************************************************
 * コンフィグ
 ************************************************************/

var config =
{
    type: Phaser.AUTO,
    parent: "canvas",
    width: 320,
    height: 480,
    scale:
    {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    scene: [mainScene]
};

/************************************************************
 * ゲーム開始
 ************************************************************/

var game = new Phaser.Game(config);
