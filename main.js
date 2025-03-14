
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

var record = [];
var turn = 0;

var spStone = [];
var spButton1 = [];
var spButton2 = [];
var spMessage = [];

mainScene.preload = function()
{
    this.load.image("board", "img/board.png");
    this.load.image("button", "img/button.png");
    this.load.image("message", "img/message.png");
    this.load.spritesheet("stone", "img/stone.png", { frameWidth: 20, frameHeight: 20 });
    this.load.spritesheet("string", "img/string.png", { frameWidth: 16, frameHeight: 24 });
}

mainScene.create = function()
{
    this.add.image(160, 240, "board");
    
    for(var x = 0; x < board.length; x++)
    {
        spStone[x] = [];
        for(var y = 0; y < board[x].length; y++)
        {
            spStone[x][y] = this.add.sprite(x * 24 + 16, y * 24 + 16, "stone").setInteractive();
            spStone[x][y].posX = x;
            spStone[x][y].posY = y;
            spStone[x][y].on("pointerdown", clickStone);
        }
    }
    
    var button1 = this.add.image( 90, 340, "button").setInteractive();
    var button2 = this.add.image(232, 340, "button").setInteractive();
    var message = this.add.image(160, 420, "message");
    
    button1.alpha = 0.8;
    button2.alpha = 0.8;
    message.alpha = 0.8;
    
    button1.on("pointerdown", clickButton1);
    button2.on("pointerdown", clickButton2);
    
    
    for(var x = 0; x < 7; x++)
    {
        spButton1[x] = this.add.sprite(x * 16 +  40, 336, "string");
        spButton2[x] = this.add.sprite(x * 16 + 184, 336, "string");
    }
    
    
    for(var x = 0; x < 17; x++)
    {
        spMessage[x] = [];
        for(var y = 0; y < 3; y++)
        {
            spMessage[x][y] = this.add.sprite(x * 16 + 32, y * 26 + 390, "string");
            spMessage[x][y].setFrame(0);
        }
    }
    
    setMessage("＊「どちらにしますか");
    setButton1("　　く　ろ");
    setButton2("　　し　ろ");
    
    
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
        
        record[turn] =
        {
            color: board[this.posX][this.posY],
            x: this.posX,
            y: this.posY
        };
        
        
        
        
        turn++;
    }
}

var setMessage = function(mes)
{
    var i = 0;
    for(var y = 0; y < 3; y++)
    {
        for(var x = 0; x < 17; x++)
        {
            spMessage[x][y].setFrame(getCharList().indexOf(mes.charAt(i)));
            i++;
        }
    }
}

var setButton1 = function(mes)
{
    var i = 0;
    for(var x = 0; x < 7; x++)
    {
        spButton1[x].setFrame(getCharList().indexOf(mes.charAt(i)));
        i++;
    }
}

var setButton2 = function(mes)
{
    var i = 0;
    for(var x = 0; x < 7; x++)
    {
        spButton2[x].setFrame(getCharList().indexOf(mes.charAt(i)));
        i++;
    }
}

var getCharList = function()
{
    return "　あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" +
           "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゃゅょっぁぃぅぇぉ" +
           "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
           "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴャュョッァィゥェォ" + 
           "＊「…！？♪ー。ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ１２３４５６７８９０＿";
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
