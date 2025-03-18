
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

var kou =
{
    turn: 0,
    x: 0,
    y: 0
};

var prisoner =
{
    black: 0,
    white: 0
};

var objStone = [];
var objButton1 = [];
var objButton2 = [];
var objMessage = [];

var timedEvent = null;

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
        objStone[x] = [];
        for(var y = 0; y < board[x].length; y++)
        {
            objStone[x][y] = this.add.sprite(x * 24 + 16, y * 24 + 16, "stone").setInteractive();
            objStone[x][y].posX = x;
            objStone[x][y].posY = y;
            objStone[x][y].on("pointerdown", clickStone);
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
    
    
    for(var i = 0; i < 7; i++)
    {
        objButton1[i] = this.add.sprite(i * 16 +  40, 336, "string");
        objButton2[i] = this.add.sprite(i * 16 + 184, 336, "string");
    }
    
    var i = 0;
    for(var y = 0; y < 3; y++)
    {
        for(var x = 0; x < 17; x++)
        {
            objMessage[i] = this.add.sprite(x * 16 + 32, y * 26 + 390, "string");
            i++;
        }
    }
    
    setMessage("くろのばんです。");
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
    var color = getColor();
    if(checkLegal(color, this.posX, this.posY))
    {
        setStone(color, this.posX, this.posY);
        setRecord(color, this.posX, this.posY);
        
        if(color == 1)
        {
            setMessage("しろのばんです。");
        }
        else
        {
            setMessage("くろのばんです。");
        }
    }
    else
    {
        setMessage("ここにいしはおけません。");
    }
}


var setMessage = function(message)
{
    if(timedEvent != null)
    {
        timedEvent.remove(false);
    }
    
    for(var i = 0; i < objMessage.length; i++)
    {
        objMessage[i].setFrame(0);
    }
    
    var i = 0;
    timedEvent = mainScene.time.addEvent(
    {
        delay: 50,
        callback: () =>
        {
            objMessage[i].setFrame(getCharList().indexOf(message.charAt(i)));
            i++;
        },
        repeat: objMessage.length - 1
    });
}

var setButton1 = function(message)
{
    var i = 0;
    for(var x = 0; x < 7; x++)
    {
        objButton1[x].setFrame(getCharList().indexOf(message.charAt(i)));
        i++;
    }
}

var setButton2 = function(message)
{
    var i = 0;
    for(var x = 0; x < 7; x++)
    {
        objButton2[x].setFrame(getCharList().indexOf(message.charAt(i)));
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

var getTurn = function()
{
    return record.length + 1;
}

var getColor = function()
{
    if(getTurn() % 2 != 0)
    {
        return 1;
    }
    else
    {
        return 2;
    }
}

var setRecord = function(color, x, y)
{
    record[record.length] =
    {
        color: color,
        x: x,
        y: y
    };
}

var checkLegal = function(color, x, y)
{
    if(board[x][y] != 0)
    {
        return false;
    }
    
    if(getTurn() > 1)
    {
        if(kou.x == x && kou.y == y && kou.turn == getTurn() - 1)
        {
            return false;
        }
    }
    
    if(checkSuicide(color, x, y))
    {
        return false;
    }
    
    return true;
}

var checkSuicide = function(color, x, y)
{
    board[x][y] = color;
    
    var checkBoard = getCheckBoard();
    
    if(doCheckRemoveStone(color, x, y, checkBoard))
    {
        var opponet = (color == 1 ? 2 : 1);
        
        if(x > 0)
        {
            if(board[x - 1][y] == opponet)
            {
                checkBoard = getCheckBoard();
                if(doCheckRemoveStone(opponet, x - 1, y, checkBoard))
                {
                    board[x][y] = 0;
                    return false;
                }
            }
        }
        if(y > 0)
        {
            if(board[x][y - 1] == opponet)
            {
                checkBoard = getCheckBoard();
                if(doCheckRemoveStone(opponet, x, y - 1, checkBoard))
                {
                    board[x][y] = 0;
                    return false;
                }
            }
        }
        if(x < board.length - 1)
        {
            if(board[x + 1][y] == opponet)
            {
                checkBoard = getCheckBoard();
                if(doCheckRemoveStone(opponet, x + 1, y, checkBoard))
                {
                    board[x][y] = 0;
                    return false;
                }
            }
        }
        if(y < board.length - 1)
        {
            if(board[x][y + 1] == opponet)
            {
                checkBoard = getCheckBoard();
                if(doCheckRemoveStone(opponet, x, y + 1, checkBoard))
                {
                    board[x][y] = 0;
                    return false;
                }
            }
        }
        board[x][y] = 0;
        return true;
    }
    else
    {
        board[x][y] = 0;
        return false;
    }
}

var setStone = function(color, x, y)
{
    setBoard(color, x, y);
    
    var isKou = true;
    if(x > 0)
    {
        if(board[x - 1, y] == color) isKou = false;
    }
    if(y > 0)
    {
        if(board[x, y - 1] == color) isKou = false;
    }
    if(x < board.length - 1)
    {
        if(board[x + 1, y] == color) isKou = false;
    }
    if(y < board[x].length - 1)
    {
        if(board[x, y + 1] == color) isKou = false;
    }
    
    var prisonerL = 0;
    var prisonerR = 0;
    var prisonerU = 0;
    var prisonerD = 0;
    if(x > 0)
    {
        prisonerL = removeStone(color, x - 1, y);
    }
    if(y > 0)
    {
        prisonerU = removeStone(color, x, y - 1);
    }
    if(x < board.length - 1)
    {
        prisonerR = removeStone(color, x + 1, y);
    }
    if(y < board[x].length - 1)
    {
        prisonerD = removeStone(color, x, y + 1);
    }
    
    var prisonerAll = prisonerL + prisonerR + prisonerU + prisonerD;
    if(isKou && prisonerAll == 1)
    {
        kou.turn = getTurn();
        if(prisonerL == 1)
        {
            kou.x = x - 1;
            kou.y = y;
        }
        else if(prisonerR == 1)
        {
            kou.x = x + 1;
            kou.y = y;
        }
        else if(prisonerU == 1)
        {
            kou.x = x;
            kou.y = y - 1;
        }
        else if(prisonerD == 1)
        {
            kou.x = x;
            kou.y = y + 1;
        }
    }
    
    if(prisonerAll > 0)
    {
        if(color = 1)
        {
            prisoner.black += prisonerAll;
        }
        else
        {
            prisoner.white += prisonerAll;
        }
    }
}

var setBoard = function(color, x, y)
{
    board[x][y] = color;
    objStone[x][y].setFrame(color);
}

var removeStone = function(color, x, y)
{
    if(board[x][y]  ==  0 || board[x][y] == color)
    {
        return 0;
    }
    
    var checkBoard = getCheckBoard();
    
    if(doCheckRemoveStone(board[x][y], x, y, checkBoard))
    {
        return doRemoveStone(board[x][y], x, y, 0);
    }
    return 0;
}

var getCheckBoard = function()
{
    var checkBoard = [];
    for(var x = 0; x < board.length; x++)
    {
        checkBoard[x] = [];
        for(var y = 0; y < board[x].length; y++)
        {
            checkBoard[x][y] = false;
        }
    }
    return checkBoard;
}

var doCheckRemoveStone = function(color, x, y, checkBoard)
{
    if(checkBoard[x][y])
    {
        return true;
    }
    
    checkBoard[x][y] = true;
    
    if(board[x][y] == 0)
    {
        return false;
    }
    
    if(board[x][y] == color)
    {
        if(x > 0)
        {
            if(!doCheckRemoveStone(color, x - 1, y, checkBoard))
            {
                return false;
            }
        }
        if(y > 0)
        {
            if(!doCheckRemoveStone(color, x, y - 1, checkBoard))
            {
                return false;
            }
        }
        if(x < board.length - 1)
        {
            if(!doCheckRemoveStone(color, x + 1, y, checkBoard))
            {
                return false;
            }
        }
        if(y < board[x].length - 1)
        {
            if(!doCheckRemoveStone(color, x, y + 1, checkBoard))
            {
                return false;
            }
        }
    }
    return true;
}

var doRemoveStone = function(color, x, y, prisonerCnt)
{
    if(board[x][y] == color)
    {
        prisonerCnt++;
        setBoard(0, x, y);
        
        if(x > 0)
        {
            prisonerCnt = doRemoveStone(color, x - 1, y, prisonerCnt);
        }
        if(y > 0)
        {
            prisonerCnt = doRemoveStone(color, x, y - 1, prisonerCnt);
        }
        if(x < board.length - 1)
        {
            prisonerCnt = doRemoveStone(color, x + 1, y, prisonerCnt);
        }
        if(y < board[x].length - 1)
        {
            prisonerCnt = doRemoveStone(color, x, y + 1, prisonerCnt);
        }
    }
    return prisonerCnt;
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
