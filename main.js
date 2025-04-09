
/************************************************************
 * メイン画面
 ************************************************************/

var mainScene = new Phaser.Scene("mainScene");

var params = new URLSearchParams(window.location.search);

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
    y: -10,
    pass: false
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
var objShow = [];
var objBlack = [];
var objWhite = [];
var objMove = [];

var setting = 0;
var lastClickTime = 0;
var timedEvent = null;

mainScene.preload = function()
{
    this.load.image("board", "img/board.png");
    this.load.image("button", "img/button.png");
    this.load.image("message", "img/message.png");
    if(params.get("mode") == "p")
    {
        this.load.spritesheet("stone", "img/stone_p.png", { frameWidth: 20, frameHeight: 20 });
        this.load.spritesheet("cursor", "img/cursor_p.png", { frameWidth: 20, frameHeight: 20 });
    }
    else
    {
        this.load.spritesheet("stone", "img/stone.png", { frameWidth: 20, frameHeight: 20 });
        this.load.spritesheet("cursor", "img/cursor.png", { frameWidth: 20, frameHeight: 20 });
    }
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
    objMessage = this.add.image(160, 408, "message").setInteractive();
    
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
    
    objMessage.on("pointerdown", downMessage);
    
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
        objShow[i]  = this.add.sprite(i * 16 +  24, 460, "string");
        objBlack[i] = this.add.sprite(i * 16 + 112, 460, "string");
        objWhite[i] = this.add.sprite(i * 16 + 200, 460, "string");
    }
    
    for(var i = 0; i < 4; i++)
    {
        objMove[i] = this.add.sprite(i * 16 + 248, 460, "string");
    }
    
    setRecord();
    displayTurn();
}

mainScene.update = function()
{
    
}

var downButton1 = function()
{
    if(setting > 1) return;
    
    if(objButton1.message == "　　まった")
    {
        if(record.length > 1)
        {
            record.pop();
            setUndo();
        }
        displayTurn();
    }
    else if(objButton1.message == "　　コピー")
    {
        copySGF();
    }
    setAlpha(objButton1, 0.6);
}

var downButton2 = function()
{
    if(setting > 1) return;
    
    if(objButton2.message == "　　ぱ　す")
    {
        if(turn.color != 1)
        {
            setTurn(1, turn.x, turn.y, true);
        }
        else
        {
            setTurn(2, turn.x, turn.y, true);
        }
        setRecord();
        displayTurn();
    }
    else if(objButton2.message == "　　ペースト")
    {
        pasteSGF();
    }
    setAlpha(objButton2, 0.6);
}

var downMessage = function()
{
    if(setting > 1) return;
    
    var currentTime = mainScene.time.now;
    if(currentTime - lastClickTime < 300)
    {
        if(setting == 0)
        {
            settingON();
            setting = 1;
        }
        else if(setting == 1)
        {
            settingOFF();
            setting = 0;
        }
    }
    lastClickTime = currentTime;
}

var settingON = function()
{
    var map = getTerritoryMap();
    var score = { black: 0, white: 0 };
    for(var x = 0; x < board.length; x++)
    {
        for(var y = 0; y < board[x].length; y++)
        {
            if(board[x][y] == 0)
            {
                objStone[x][y].setFrame(map[x][y]);
                objStone[x][y].alpha = 0.2;
                if(map[x][y] == 1)
                {
                    score.black++;
                }
                else if(map[x][y] == 2)
                {
                    score.white++;
                }
            }
        }
    }
    
    score.black += prisoner.black;
    score.white += prisoner.white;
    
    setShow("　じ");
    
    if(score.black < 100)
    {
        setBlack(toFullWidth(String(score.black).padStart(2, "0")));
    }
    else
    {
        setBlack("＊＊");
    }
    if(score.white < 100)
    {
        setWhite(toFullWidth(String(score.white).padStart(2, "0")));
    }
    else
    {
        setWhite("＊＊");
    }
    
    setMessage("ＳＧＦのコピーとペーストです。");
    setButton1("　　コピー");
    setButton2("　　ペースト");
}

var settingOFF = function()
{
    for(var x = 0; x < board.length; x++)
    {
        for(var y = 0; y < board[x].length; y++)
        {
            if(board[x][y] == 0)
            {
                objStone[x][y].setFrame(0);
                objStone[x][y].alpha = 1;
            }
        }
    }
    displayTurn();
}

var upButton1 = function()
{
    if(setting > 1) return;
    setAlpha(objButton1, 1.0);
}

var upButton2 = function()
{
    if(setting > 1) return;
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
    if(setting > 0) return;
    
    var color = getColor();
    if(checkLegal(color, this.posX, this.posY))
    {
        setStone(color, this.posX, this.posY);
        setTurn(color, this.posX, this.posY);
        setRecord();
        displayTurn();
    }
    else
    {
        setMessage("ここにいしはおけません。");
    }
}

var setTurn = function(color, x, y, pass = false)
{
    turn.color = color;
    turn.x = x;
    turn.y = y;
    turn.pass = pass;
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
    objButton1.message = message;
}

var setButton2 = function(message)
{
    for(var i = 0; i < objButton2.text.length; i++)
    {
        objButton2.text[i].setFrame(getCharList().indexOf(message.charAt(i)));
    }
    objButton2.message = message;
}

var setShow = function(value)
{
    for(var i = 0; i < objShow.length; i++)
    {
        objShow[i].setFrame(getCharList().indexOf(value.charAt(i)));
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
        setTurn(turn.color, turn.x, turn.y);
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
    setButton1("　　まった");
    setButton2("　　ぱ　す");
    displayHama();
    displayMove();
}

var displayHama = function()
{
    setShow("ハマ");
    
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
}

var displayMove = function()
{
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

var copySGF = function()
{
    var sgf = "(;GM[1]SZ[13]";
    for(var i = 0; i < record.length; i++)
    {
        if(record[i].turn.color == 1)
        {
            if(record[i].turn.pass)
            {
                sgf += ";B[tt]";
            }
            else
            {
                sgf += ";B[" + toAlphabet(record[i].turn.x) + toAlphabet(record[i].turn.y) + "]";
            }
        }
        else if(record[i].turn.color == 2)
        {
            if(record[i].turn.pass)
            {
                sgf += ";W[tt]";
            }
            else
            {
                sgf += ";W[" + toAlphabet(record[i].turn.x) + toAlphabet(record[i].turn.y) + "]";
            }
        }
    }
    navigator.clipboard.writeText(sgf);
    setMessage("コピーしました。");
}

var pasteSGF = async function()
{
    var sgf = "";
    await navigator.clipboard.readText().then(text =>
    {
        sgf = text;
    }).catch(err =>
    {
        setMessage("ペーストにしっぱいしました。");
    });
    
    var { error, moves } = parseSGF(sgf);
    
    if(error)
    {
        setMessage("よみこみにしっぱいしました。");
        return;
    }
    
    if(moves.length == 0)
    {
        setMessage("ＳＧＦをコピーしてください。");
        return;
    }
    
    settingOFF();
    setting = 2;
    
    setAlpha(objButton1, 0.6);
    setAlpha(objButton2, 0.6);
    
    record.length = 1;
    setUndo();
    
    for(move of moves)
    {
        if(!move.pass)
        {
            if(checkLegal(move.color, move.x, move.y))
            {
                setStone(move.color, move.x, move.y);
                setTurn(move.color, move.x, move.y);
                setRecord();
            }
            else
            {
                move.pass = true;
            }
        }
        if(move.pass)
        {
            setTurn(move.color, turn.x, turn.y, true);
            setRecord();
        }
        displayTurn();
        await sleep(500);
    }
    
    setAlpha(objButton1, 1.0);
    setAlpha(objButton2, 1.0);
    
    setting = 0;
}

var parseSGF = function(sgf)
{
    var error = false;
    var moves = [];
    
    var match = null;
    
    var headerRegex = /(GM|SZ)\[([^\]]+)\]/g;
    while((match = headerRegex.exec(sgf)) != null)
    {
        if(match[1] == "GM")
        {
            if(match[2] != "1")
            {
                error = true;
                break;
            }
        }
        else if(match[1] == "SZ")
        {
            if(match[2] != "13")
            {
                error = true;
                break;
            }
        }
    }
    
    var color = 0;
    var x = 0;
    var y = 0;
    var pass = false;
    
    var moveRegex = /;([BW])\[([a-z]{2})\]/g;
    while((match = moveRegex.exec(sgf)) != null)
    {
        if(match[1] == "B")
        {
            color = 1;
        }
        else
        {
            color = 2;
        }
        if(match[2] == "tt")
        {
            pass = true;
        }
        else if(match[2] >= "aa" && match[2] <= "mm")
        {
            x = toNumber(match[2][0]);
            y = toNumber(match[2][1]);
            pass = false;
        }
        else
        {
            error = true;
            break;
        }
        moves.push({ color, x, y, pass });
    }
    
    return { error, moves };
}

var toAlphabet = function(value)
{
    return String.fromCharCode(97 + value);
}

var toNumber = function(value)
{
    return value.charCodeAt(0) - 97;
}

var sleep = function(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
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

var getTerritoryMap = function()
{
    var checkBoard = getCheckBoard();
    var territoryMap = [];
    for(var x = 0; x < board.length; x++)
    {
        territoryMap[x] = [];
        for(var y = 0; y < board[x].length; y++)
        {
            territoryMap[x][y] = 0;
        }
    }
    
    for(var x = 0; x < board.length; x++)
    {
        for(var y = 0; y < board[x].length; y++)
        {
            if(!checkBoard[x][y] && board[x][y] == 0)
            {
                var { territory, owner } = exploreTerritory(x, y, checkBoard);
                territory.forEach(([tx, ty]) =>
                {
                    territoryMap[tx][ty] = owner;
                });
            }
        }
    }
    return territoryMap;
}

var exploreTerritory = function(x, y, checkBoard)
{
    var stack = [[x, y]];
    var territory = [];
    var surroundingColors = new Set();
    
    while(stack.length > 0)
    {
        var [cx, cy] = stack.pop();
        if(checkBoard[cx][cy])
        {
            continue;
        }
        checkBoard[cx][cy] = true;
        territory.push([cx, cy]);
        
        for(var [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]])
        {
            var nx = cx + dx;
            var ny = cy + dy;
            if(nx >= 0 && nx < board.length && ny >= 0 && ny < board[nx].length)
            {
                if(!checkBoard[nx][ny])
                {
                    if(board[nx][ny] == 0)
                    {
                        stack.push([nx, ny]);
                    }
                    else
                    {
                        surroundingColors.add(board[nx][ny]);
                    }
                }
            }
        }
    }
    
    if(surroundingColors.size == 1)
    {
        return { territory, owner: [...surroundingColors][0] };
    }
    else
    {
        return { territory, owner: 0 };
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
