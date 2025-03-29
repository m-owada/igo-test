
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

var turn =
{
    color: 0,
    x: -10,
    y: -10
};

var kou =
{
    move: 0,
    x: 0,
    y: 0
};

var prisoner =
{
    black: 0,
    white: 0
};

var record = [];

var objStone = [];
var objCursor = null;
var objButton1 = null;
var objButton2 = null;
var objMessage = null;
var objBlack = [];
var objWhite = [];
var objMove = [];

var timedEvent = null;

mainScene.preload = function()
{
    this.load.image("board", "img/board.png");
    this.load.image("button", "img/button.png");
    this.load.image("message", "img/message.png");
    this.load.spritesheet("stone", "img/stone.png", { frameWidth: 20, frameHeight: 20 });
    this.load.spritesheet("cursor", "img/cursor.png", { frameWidth: 20, frameHeight: 20 });
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
    
    this.anims.create(
    {
        key: "cursor",
        frames: this.anims.generateFrameNumbers("cursor", { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });
    
    objCursor = this.add.sprite(turn.x, turn.y, "cursor");
    objCursor.anims.play("cursor");
    
    objButton1 = this.add.image( 90, 340, "button").setInteractive();
    objButton2 = this.add.image(232, 340, "button").setInteractive();
    objMessage = this.add.image(160, 408, "message");
    
    objButton1.on("pointerdown", downButton1);
    objButton2.on("pointerdown", downButton2);
    objButton1.on("pointerup", upButton1);
    objButton2.on("pointerup", upButton2);
    objButton1.on("pointerout", upButton1);
    objButton2.on("pointerout", upButton2);
    
    objButton1.text = [];
    objButton2.text = [];
    for(var i = 0; i < 7; i++)
    {
        objButton1.text[i] = this.add.sprite(i * 16 +  40, 336, "string");
        objButton2.text[i] = this.add.sprite(i * 16 + 184, 336, "string");
    }
    
    objMessage.text = [];
    var i = 0;
    for(var y = 0; y < 2; y++)
    {
        for(var x = 0; x < 17; x++)
        {
            objMessage.text[i] = this.add.sprite(x * 16 + 32, y * 26 + 390, "string");
            i++;
        }
    }
    
    for(var i = 0; i < 2; i++)
    {
        objBlack[i] = this.add.sprite(i * 16 + 112, 460, "string");
        objWhite[i] = this.add.sprite(i * 16 + 200, 460, "string");
    }
    
    for(var i = 0; i < 4; i++)
    {
        objMove[i] = this.add.sprite(i * 16 + 248, 460, "string");
    }
    
    setRecord();
    
    setButton1("　　まった");
    setButton2("　　ぱ　す");
    displayTurn();
}

mainScene.update = function()
{
    
}

var downButton1 = function()
{
    if(record.length > 1)
    {
        record.pop();
        setUndo();
    }
    displayTurn();
    setAlpha(objButton1, 0.6);
}

var downButton2 = function()
{
    if(turn.color != 1)
    {
        turn.color = 1;
    }
    else
    {
        turn.color = 2;
    }
    setRecord();
    displayTurn();
    setAlpha(objButton2, 0.6);
}

var upButton1 = function()
{
    setAlpha(objButton1, 1.0);
}

var upButton2 = function()
{
    setAlpha(objButton2, 1.0);
}

var setAlpha = function(object, alpha)
{
    object.alpha = alpha;
    for(var i = 0; i < object.text.length; i++)
    {
        object.text[i].alpha = alpha;
    }
}

var clickStone = function()
{
    var color = getColor();
    if(checkLegal(color, this.posX, this.posY))
    {
        setStone(color, this.posX, this.posY);
        setCursor(color, this.posX, this.posY);
        setRecord();
        displayTurn();
    }
    else
    {
        setMessage("ここにいしはおけません。");
    }
}

var setCursor = function(color, x, y)
{
    turn.color = color;
    turn.x = x;
    turn.y = y;
    objCursor.x = turn.x * 24 + 16;
    objCursor.y = turn.y * 24 + 16;
}

var setMessage = function(message)
{
    if(timedEvent != null)
    {
        timedEvent.remove(false);
    }
    
    for(var i = 0; i < objMessage.text.length; i++)
    {
        objMessage.text[i].setFrame(0);
    }
    
    var i = 0;
    timedEvent = mainScene.time.addEvent(
    {
        delay: 50,
        callback: () =>
        {
            objMessage.text[i].setFrame(getCharList().indexOf(message.charAt(i)));
            i++;
        },
        repeat: objMessage.text.length - 1
    });
}

var setButton1 = function(message)
{
    for(var i = 0; i < objButton1.text.length; i++)
    {
        objButton1.text[i].setFrame(getCharList().indexOf(message.charAt(i)));
    }
}

var setButton2 = function(message)
{
    for(var i = 0; i < objButton2.text.length; i++)
    {
        objButton2.text[i].setFrame(getCharList().indexOf(message.charAt(i)));
    }
}

var setBlack = function(value)
{
    for(var i = 0; i < objBlack.length; i++)
    {
        objBlack[i].setFrame(getCharList().indexOf(value.charAt(i)));
    }
}

var setWhite = function(value)
{
    for(var i = 0; i < objWhite.length; i++)
    {
        objWhite[i].setFrame(getCharList().indexOf(value.charAt(i)));
    }
}

var setMove = function(value)
{
    for(var i = 0; i < objMove.length; i++)
    {
        objMove[i].setFrame(getCharList().indexOf(value.charAt(i)));
    }
}

var getCharList = function()
{
    return "　あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" +
           "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゃゅょっぁぃぅぇぉ" +
           "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
           "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴャュョッァィゥェォ" + 
           "＊「：…！？♪ー。ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ１２３４５６７８９０＿";
}

var getMove = function()
{
    return record.length - 1;
}

var getColor = function()
{
    if(record[record.length - 1].turn.color != 1)
    {
        return 1;
    }
    else
    {
        return 2;
    }
}

var setRecord = function()
{
    record[record.length] =
    {
        board   : structuredClone(board),
        turn    : structuredClone(turn),
        kou     : structuredClone(kou),
        prisoner: structuredClone(prisoner)
    }
}

var setUndo = function()
{
    if(record.length > 0)
    {
        board = structuredClone(record[record.length - 1].board);
        for(var x = 0; x < board.length; x++)
        {
            for(var y = 0; y < board[x].length; y++)
            {
                setBoard(board[x][y], x, y);
            }
        }
        turn = structuredClone(record[record.length - 1].turn);
        setCursor(turn.color, turn.x, turn.y);
        kou = structuredClone(record[record.length - 1].kou);
        prisoner = structuredClone(record[record.length - 1].prisoner);
    }
}

var displayTurn = function()
{
    if(getColor() == 1)
    {
        setMessage("くろのばんです。");
    }
    else
    {
        setMessage("しろのばんです。");
    }
    
    if(prisoner.black < 100)
    {
        setBlack(toFullWidth(String(prisoner.black).padStart(2, "0")));
    }
    else
    {
        setBlack("＊＊");
    }
    
    if(prisoner.white < 100)
    {
        setWhite(toFullWidth(String(prisoner.white).padStart(2, "0")));
    }
    else
    {
        setWhite("＊＊");
    }
    
    if(getMove() == 0)
    {
        setMove("ーーーー");
    }
    else if(getMove() < 1000)
    {
        setMove(toFullWidth(String(getMove()).padStart(3, "0")) + "て");
    }
    else
    {
        setMove("＊＊＊て");
    }
}

var toFullWidth = function(str)
{
    return String(str).replace(/[!-~]/g, (s) =>
    {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
}

var checkLegal = function(color, x, y)
{
    if(board[x][y] != 0)
    {
        return false;
    }
    
    if(checkSuicide(color, x, y))
    {
        return false;
    }
    
    if(getMove() > 1)
    {
        if(kou.x == x && kou.y == y && kou.move == getMove() - 1)
        {
            if(!checkSnapback(color, x, y))
            {
                return false;
            }
        }
    }
    
    return true;
}

var checkSuicide = function(color, x, y)
{
    board[x][y] = color;
    
    if(doCheckRemoveStone(color, x, y))
    {
        var opponet = (color == 1 ? 2 : 1);
        
        if(x > 0)
        {
            if(board[x - 1][y] == opponet)
            {
                if(doCheckRemoveStone(opponet, x - 1, y))
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
                if(doCheckRemoveStone(opponet, x, y - 1))
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
                if(doCheckRemoveStone(opponet, x + 1, y))
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
                if(doCheckRemoveStone(opponet, x, y + 1))
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

var checkSnapback = function(color, x, y)
{
    var isSnapback = false;
    board[x][y] = color;
    
    var prisonerCnt = 0;
    if(x > 0)
    {
        prisonerCnt += removeStone(color, x - 1, y);
    }
    if(y > 0)
    {
        prisonerCnt += removeStone(color, x, y - 1);
    }
    if(x < board.length - 1)
    {
        prisonerCnt += removeStone(color, x + 1, y);
    }
    if(y < board[x].length - 1)
    {
        prisonerCnt += removeStone(color, x, y + 1);
    }
    if(prisonerCnt > 1)
    {
        isSnapback = true;
    }
    
    setUndo();
    return isSnapback;
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
        kou.move = getMove();
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
        if(color == 1)
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
    
    if(doCheckRemoveStone(board[x][y], x, y))
    {
        return doRemoveStone(board[x][y], x, y);
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

var doCheckRemoveStone = function(color, x, y, checkBoard = getCheckBoard())
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

var doRemoveStone = function(color, x, y, prisonerCnt = 0)
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

var evalBoard = function()
{
    var blackBoard = [];
    var whiteBoard = [];
    var totalBoard = [];
    
    for(var x = 0; x < board.length; x++)
    {
        blackBoard[x] = [];
        whiteBoard[x] = [];
        totalBoard[x] = [];
        for(var y = 0; y < board[x].length; y++)
        {
            blackBoard[x][y] = 0;
            whiteBoard[x][y] = 0;
            totalBoard[x][y] = 0;
        }
    }
    
    for(var x = 0; x < board.length; x++)
    {
        for(var y = 0; y < board[x].length; y++)
        {
            if(board[x][y] == 1)
            {
                checkTerritory(blackBoard, x, y);
            }
            else if(board[x][y] == 2)
            {
                checkTerritory(whiteBoard, x, y);
            }
        }
    }
    
    var value = 0;
    for(var x = 0; x < board.length; x++)
    {
        for(var y = 0; y < board[x].length; y++)
        {
            if(board[x][y] == 1)
            {
                totalBoard[x][y] = 1;
            }
            else if(board[x][y] == 2)
            {
                totalBoard[x][y] = 2;
            }
            else
            {
                if(blackBoard[x][y] > whiteBoard[x][y])
                {
                    totalBoard[x][y] = 1;
                    value++;
                }
                else if(blackBoard[x][y] < whiteBoard[x][y])
                {
                    totalBoard[x][y] = 2;
                    value--;
                }
            }
        }
    }
    return value;
}

var checkTerritory = function(paraBoard, x, y)
{
    setValue(paraBoard, x - 3, y);
    setValue(paraBoard, x - 2, y - 1);
    setValue(paraBoard, x - 2, y);
    setValue(paraBoard, x - 2, y + 1);
    setValue(paraBoard, x - 1, y - 2);
    setValue(paraBoard, x - 1, y - 1);
    setValue(paraBoard, x - 1, y);
    setValue(paraBoard, x - 1, y + 1);
    setValue(paraBoard, x - 1, y + 2);
    setValue(paraBoard, x, y - 3);
    setValue(paraBoard, x, y - 2);
    setValue(paraBoard, x, y - 1);
    setValue(paraBoard, x, y);
    setValue(paraBoard, x, y + 1);
    setValue(paraBoard, x, y + 2);
    setValue(paraBoard, x, y + 3);
    setValue(paraBoard, x + 1, y - 2);
    setValue(paraBoard, x + 1, y - 1);
    setValue(paraBoard, x + 1, y);
    setValue(paraBoard, x + 1, y + 1);
    setValue(paraBoard, x + 1, y + 2);
    setValue(paraBoard, x + 2, y - 1);
    setValue(paraBoard, x + 2, y);
    setValue(paraBoard, x + 2, y + 1);
    setValue(paraBoard, x + 3, y);
}

var setValue = function(paraBoard, x, y)
{
    if(x > 0 && x < paraBoard.length - 1 && y > 0 && y < paraBoard[x].length - 1)
    {
        paraBoard[x][y] += 1;
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
