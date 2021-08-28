var bottomDockPanel = 100;
var topDockPanel = 30;
var screenwidth = window.innerWidth;
var screenheight = window.innerHeight;
var canvas;
//Camera
var cameraPos;
let sf = 1, tx = 0, ty = 0;
//Editor stuff
var gameobjects = []; 
var textures = [];
var selectedObj;
var playerTex;
var propWindow = document.getElementById("objectProperties");
//Touch controls
var lastCenter = null;
var lastDist = 0;
//Snapping
var snap = document.getElementById('snapping');
var snapSize = document.getElementById('snapsize');
var showGridCheckbox = document.getElementById('showgrid');
//Loading
var loaded = 0;
var totalLoad = 18;
var loading = true;
//Context menu
var objectContext = document.getElementById("objContext");
var emptyContext = document.getElementById("emptyContext");
var clipboard;

function loadImageCallback(index, filename) {
    loadImage(filename, function(img){
        textures[index] = img;
        loaded++;

        if(loaded == totalLoad){
            loading = false;
        }
    });
}

function loadImagePlayer(filename) {
    loadImage(filename, imgLoaded);

    function imgLoaded(img){
        playerTex = img;
        loaded++;
        
        if(loaded == totalLoad){
            loading = false;
        }
    }
}

function setup(){
    canvas = createCanvas(screenwidth, screenheight);
    canvas.drop(loadFile);
    cameraPos = {x: round(width / 2) - 16, y: round(height / 2) - 24};
    gameobjects = [];
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    //gameobjects = [new GameObject(1344,96,96,96,2, 2),new GameObject(512,-128,128,192,2, 2),new GameObject(1280,160,64,32,2, 2),new GameObject(-32,32,256,32,0, 0),new GameObject(-480,-96,560,32,0, 0),new GameObject(224,-32,128,32,0, 0),new GameObject(224,0,128,64,0, 1),new GameObject(-480,64,1312,352,0, 1),new GameObject(832,96,64,320,0, 1),new GameObject(352,32,128,32,0, 0),new GameObject(480,96,64,32,0, 0),new GameObject(896,160,64,256,0, 1),new GameObject(544,32,288,32,0, 0),new GameObject(512,-160,128,32,0, 0),new GameObject(640,-64,128,32,0, 0),new GameObject(832,64,32,32,0, 0),new GameObject(864,96,32,32,0, 0),new GameObject(896,128,32,32,0, 0),new GameObject(928,160,32,32,0, 0),new GameObject(960,192,480,32,0, 0),new GameObject(960,224,480,192,0, 1),new GameObject(480,64,64,32,1, 3),new GameObject(480,32,64,32,1, 4),new GameObject(640,-32,128,64,2, 2),new GameObject(-32,-64,96,96,2, 2),new GameObject(64,-32,32,64,2, 2),new GameObject(96,0,32,32,2, 2),new GameObject(280,-72,16,16,3, 6),new GameObject(408,-8,16,16,3, 6),new GameObject(696,-104,16,16,3, 6),new GameObject(568,-200,16,16,3, 6),new GameObject(1160,152,16,16,3, 6),new GameObject(1384,152,16,16,3, 6),new GameObject(-480,-64,448,128,0, 1),new GameObject(1440,96,384,320,0, 1),new GameObject(1344,64,480,32,0, 0),new GameObject(1312,128,32,32,2, 2),new GameObject(1088,-128,32,128,0, 1),new GameObject(1152,-96,32,32,4, 3),new GameObject(1120,-96,96,96,1, 3),new GameObject(1120,-128,128,32,0, 1),new GameObject(1216,-96,32,96,0, 1),new GameObject(320,-64,32,32,3, 9),new GameObject(224,-64,32,32,3, 9),new GameObject(320,-96,32,32,3, 9),new GameObject(320,-128,32,32,3, 9),new GameObject(288,-128,32,32,3, 9),new GameObject(256,-128,32,32,3, 9),new GameObject(224,-128,32,32,3, 9),new GameObject(224,-96,32,32,3, 9)];
    ellipseMode(CENTER);
    loadImagePlayer("./textures/player.png");
    loadImageCallback(0, "./textures/grass.png");
    loadImageCallback(1, "./textures/dirt.png");
    loadImageCallback(2, "./textures/dirt_bg.png");
    loadImageCallback(3, "./textures/lava.png");
    loadImageCallback(4, "./textures/lava_top.png");
    loadImageCallback(5, "./textures/spike.png");
    loadImageCallback(6, "./textures/coin.png");
    loadImageCallback(7, "./textures/sandbrick.png");
    loadImageCallback(8, "./textures/sandbrick_bg.png");
    loadImageCallback(9, "./textures/bricks.png");
    loadImageCallback(10, "./textures/bricks_bg.png");
    loadImageCallback(11, "./textures/metal.png");
    loadImageCallback(12, "./textures/platform_0.png");
    loadImageCallback(13, "./textures/platform_1.png");
    loadImageCallback(14, "./textures/platform_2.png");
    loadImageCallback(15, "./textures/log.png");
    loadImageCallback(16, "./textures/beam.png");
    noSmooth();
}

function draw(){
    background(84, 175, 227);

    if(loading){
        var w = width * 0.4;
        fill(60, 255, 60);
        rect(width / 2 - (w / 2), height * 0.6, w * loaded / totalLoad, 40, 15, 15, 15, 15);

        noFill();
        stroke(255);
        strokeWeight(3);
        rect(width / 2 - (w / 2), height * 0.6, w, 40, 15, 15, 15, 15);

        noStroke();
        fill(0);
        var time = millis();
        time /= 200;
        var NINES_PI = PI / 8;
        ellipse(width / 2 + 40, height / 2, 20 + 10 *              sin(time))                  //right
        ellipse(width / 2 + 28.284, height / 2 + 28.284, 20 + 10 * sin(time + (NINES_PI * 1))) //bottom right
        ellipse(width / 2, height / 2 + 40, 20 + 10 *              sin(time + (NINES_PI * 2))) //bottom
        ellipse(width / 2 - 28.284, height / 2 + 28.284, 20 + 10 * sin(time + (NINES_PI * 3))) //bottom left
        ellipse(width / 2 - 40, height / 2, 20 + 10 *              sin(time + (NINES_PI * 4))) //left
        ellipse(width / 2 - 28.284, height / 2 - 28.284, 20 + 10 * sin(time + (NINES_PI * 5))) //top left
        ellipse(width / 2, height / 2 - 40, 20 + 10 *              sin(time + (NINES_PI * 6))) //top
        ellipse(width / 2 + 28.284, height / 2 - 28.284, 20 + 10 * sin(time + (NINES_PI * 7))) //top right
        return;
    }

    scale(sf);
    translate(cameraPos.x, cameraPos.y)
    

    gameobjects.forEach(element => {
        element.render();
    });

    if(selectedObj){
        strokeWeight(1);
        stroke(50, 121, 213, 220)
        fill(50, 151, 253, 100);
        rect(selectedObj.x, selectedObj.y, selectedObj.w, selectedObj.h);

        //Draw resize nodes
        fill(255);
        strokeWeight(1);
        stroke(85);

        var halfW = selectedObj.w / 2;
        var halfH = selectedObj.h / 2;

        rect(selectedObj.x - 3, selectedObj.y + halfH - 3, 7, 7);
        rect(selectedObj.x + selectedObj.w - 3, selectedObj.y + halfH - 3, 7, 7);
        rect(selectedObj.x + halfW - 3, selectedObj.y - 3, 7, 7);
        rect(selectedObj.x + halfW - 3, selectedObj.y + selectedObj.h - 3, 7, 7);
        //
        UpdateObject();
        propWindow.style.display = "";
    }
    else {
        propWindow.style.display = "none";
    }

    image(playerTex, 3, 2, 26, 28);

    if(showGridCheckbox.checked && snapSize.value >= 1){
        resetMatrix();
        scale(sf);
        stroke(255, 60);
        strokeWeight(1);
        var startX = -snapSize.value + (cameraPos.x % snapSize.value);
        var startY = -snapSize.value + (cameraPos.y % snapSize.value);

        for (var y = 0; y < 2 + (height / snapSize.value / sf); ++y)
        {
            line(startX,
                startY + (y * snapSize.value),
                startX + ((2 + (width / snapSize.value / sf)) * snapSize.value),
                startY + (y * snapSize.value));
        }

        for (var x = 0; x < 2 + (width / snapSize.value / sf); ++x)
        {
            line(startX + (x * snapSize.value),
                startY,
                startX + (x * snapSize.value),
                startY + ((2 + (height / snapSize.value / sf)) * snapSize.value));
        }
    }

    if(clipboard) document.getElementById("pasteBtn").classList.remove("disabled");
    else document.getElementById("pasteBtn").classList.add("disabled");
}

var mouseStartPos = {x: 0, y: 0};
var movetmp = {x: 0, y: 0};
var sizetmp = {w: 0, h: 0};

function mousePressed() {
    if(detectGUI()) return;
    objectContext.style.display = "none";
    emptyContext.style.display = "none";


    if(canResize == -1){
        selectedObj = null;
        gameobjects.forEach(element => {
            if(element.contains(mouseX / sf - cameraPos.x, mouseY / sf - cameraPos.y)) {
                selectedObj = element;
            }
        });
    }
    if(selectedObj){
        movetmp = {x:selectedObj.x, y:selectedObj.y};
        sizetmp = {w:selectedObj.w, h:selectedObj.h};
        UpdateProperties();
    }
    
    
    mouseStartPos.x = mouseX / sf;
    mouseStartPos.y = mouseY / sf;
}

function detectGUI() {
    if(mouseButton === RIGHT) return true;
    if(mouseY < 0) return true;

    //Do not press when clicking on properties box
    if(selectedObj){
        var texSel = document.getElementById("objectTextureSelect-box-scroll");
        
        propx = propWindow.offsetLeft;
        propy = propWindow.offsetTop;
        propw = propWindow.offsetWidth;
        proph = propWindow.offsetHeight;

        if(propx <= mouseX && mouseX <= propx + propw &&
            propy <= mouseY + 40 && mouseY + 40 <= propy + proph) {
            return true;
        }

        if(texSel.style.display == "block"){
            var rect = texSel.getBoundingClientRect();
            if(rect.x <= mouseX && mouseX <= rect.x + rect.width &&
                rect.y <= mouseY && mouseY <= rect.y + rect.height) {
                return true;
            }
        }
    }

    if(emptyContext.style.display == "") {
        var rect = emptyContext.getBoundingClientRect();
        if(rect.x <= mouseX && mouseX <= rect.x + rect.width &&
            rect.y <= (mouseY + 40) && (mouseY + 40) <= rect.y + rect.height) {
            return true;
        }
    }

    if(objContext.style.display == "") {
        var rect = objContext.getBoundingClientRect();

        if(rect.x <= mouseX && mouseX <= rect.x + rect.width &&
            rect.y <= (mouseY + 40) && (mouseY + 40) <= rect.y + rect.height) {
            return true;
        }
    }

    var ret = false;
    document.getElementsByClassName("show").forEach(el => {
        var rect = el.getBoundingClientRect();

        if(rect.x <= mouseX && mouseX <= rect.x + rect.width &&
            rect.y <= (mouseY + 40) && (mouseY + 40) <= rect.y + rect.height) {
            ret =  true;
        }
    });

    return ret;
}

function touchMoved() {
    var touch1 = touches[0];
    var touch2 = touches[1];

    if (touch1 && touch2) {
        var p1 = {
            x: touch1.x,
            y: touch1.y,
        };
        var p2 = {
            x: touch2.x,
            y: touch2.y,
        };

        if (!lastCenter) {
            lastCenter = getCenter(p1, p2);
            return;
        }
        var newCenter = getCenter(p1, p2);

        var dist = getDistance(p1, p2);

        if (!lastDist) {
            lastDist = dist;
        }

        // local coordinates of center point
        var pointTo = {
            x: (newCenter.x - cameraPos.x) / sf,
            y: (newCenter.y - cameraPos.y) / sf,
        };

        applyScale(dist / lastDist);

        // calculate new position of the stage
        var dx = newCenter.x - lastCenter.x;
        var dy = newCenter.y - lastCenter.y;

        var newPos = {
            x: newCenter.x - pointTo.x * sf + dx,
            y: newCenter.y - pointTo.y * sf + dy,
        };

        cameraPos = newPos;

        lastDist = dist;
        lastCenter = newCenter;
    }
    else {
        cursorMove();
    }
}

var canResize = -1;

function mouseMoved(fxn){
    if(selectedObj){

        var halfW = selectedObj.w / 2;
        var halfH = selectedObj.h / 2;
        var mX = mouseX / sf - cameraPos.x;
        var mY = mouseY / sf - cameraPos.y;

        var LnodeX = selectedObj.x - 3;
        var LnodeY = selectedObj.y + halfH - 3;
        var TnodeX = selectedObj.x + halfW - 3;
        var TnodeY = selectedObj.y - 3;
        var RnodeX = selectedObj.x + selectedObj.w - 3;
        var RnodeY = selectedObj.y + halfH - 3;
        var BnodeX = selectedObj.x + halfW - 3;
        var BnodeY = selectedObj.y + selectedObj.h - 3;
        
        var nodeW = 7;
        var nodeH = 7;

        if (LnodeX <= mX && mX <= LnodeX + nodeW &&
            LnodeY <= mY && mY <= LnodeY + nodeH) {
            cursor('ew-resize'); // Left
            canResize = 0;
        }
        else if (TnodeX <= mX && mX <= TnodeX + nodeW &&
                 TnodeY <= mY && mY <= TnodeY + nodeH) {
            cursor('ns-resize'); // Top
            canResize = 1;
        }
        else if (RnodeX <= mX && mX <= RnodeX + nodeW &&
                 RnodeY <= mY && mY <= RnodeY + nodeH) {
            cursor('ew-resize'); // Right
            canResize = 2;
        }
        else if (BnodeX <= mX && mX <= BnodeX + nodeW &&
                 BnodeY <= mY && mY <= BnodeY + nodeH) {
            cursor('ns-resize'); // Bottom
            canResize = 3;
        }
        else{
            canResize = -1;
            cursor(ARROW);
        }
    }
    else {
        cursor(ARROW);
    }
}

function cursorMove(){
    if(detectGUI()) return;

    if(canResize != -1){
        if (snapping.checked && snapSize.value >= 1) {
            var tmpSnapSize = snapSize.value / (selectedObj.type == 3 ? 2 : 1);
            switch (canResize)
            {
                case 2:
                    sizetmp.w += mouseX / sf - mouseStartPos.x;
                    selectedObj.w = max(round(sizetmp.w / tmpSnapSize), 1) * tmpSnapSize;
                    break;
                case 3:
                    sizetmp.h += mouseY / sf - mouseStartPos.y;
                    selectedObj.h = max(round(sizetmp.h / tmpSnapSize), 1) * tmpSnapSize;
                    break;
                case 0:
                    movetmp.x += mouseX / sf - mouseStartPos.x;
                    sizetmp.w -= mouseX / sf - mouseStartPos.x;
                    selectedObj.w = max(round(sizetmp.w / tmpSnapSize), 1) * tmpSnapSize;
                    selectedObj.x = round(movetmp.x / tmpSnapSize) * tmpSnapSize;
                    break;
                case 1:
                    movetmp.y += mouseY / sf - mouseStartPos.y;
                    sizetmp.h -= mouseY / sf - mouseStartPos.y;
                    selectedObj.y = round(movetmp.y / tmpSnapSize) * tmpSnapSize;
                    selectedObj.h = max(round(sizetmp.h / tmpSnapSize), 1) * tmpSnapSize;
                    break;
            }
        }
        else
        {
            switch (canResize)
            {
                case 2:
                    selectedObj.w += mouseX / sf - mouseStartPos.x;
                    break;
                case 3:
                    selectedObj.h += mouseY / sf - mouseStartPos.y;
                    break;
                case 0:
                    selectedObj.x += mouseX / sf - mouseStartPos.x;
                    selectedObj.w -= mouseX / sf - mouseStartPos.x;
                    break;
                case 1:
                    selectedObj.y += mouseY / sf - mouseStartPos.y;
                    selectedObj.h -= mouseY / sf - mouseStartPos.y;
                    break;
            }

            selectedObj.w = max(selectedObj.w, 3);
            selectedObj.h = max(selectedObj.h, 3);
        }
        mouseStartPos.x = mouseX / sf;
        mouseStartPos.y = mouseY / sf;
        UpdateProperties();
        return;
    }

    if(selectedObj){
        var texSel = document.getElementById("objectTextureSelect-box-scroll");
        
        propx = propWindow.offsetLeft;
        propy = propWindow.offsetTop;
        propw = propWindow.offsetWidth;
        proph = propWindow.offsetHeight;

        if(propx <= mouseX && mouseX <= propx + propw &&
            propy <= mouseY + 40 && mouseY + 40 <= propy + proph) {
            return;
        }

        if(texSel.style.display == "block"){
            var rect = texSel.getBoundingClientRect();
            if(rect.x <= mouseX && mouseX <= rect.x + rect.width &&
                rect.y <= mouseY && mouseY <= rect.y + rect.height) {
                return;
            }
        }
    }


    if(selectedObj){
        if(snap.checked && snapSize.value >= 1){
            movetmp.x += mouseX / sf - mouseStartPos.x;
            movetmp.y += mouseY / sf - mouseStartPos.y;

            selectedObj.x = round(movetmp.x / snapSize.value) * snapSize.value;
            selectedObj.y = round(movetmp.y / snapSize.value) * snapSize.value;

            if(selectedObj.type == 3) // if coin - center it
            {
                selectedObj.x += 8;
                selectedObj.y += 8;
            }
        }
        else{
            selectedObj.x += mouseX / sf - mouseStartPos.x;
            selectedObj.y += mouseY / sf - mouseStartPos.y;
        }
    }
    else{
        cameraPos.x += mouseX / sf - mouseStartPos.x;
        cameraPos.y += mouseY / sf - mouseStartPos.y;
    }
    mouseStartPos.x = mouseX / sf;
    mouseStartPos.y = mouseY / sf;
    UpdateProperties();
}

function touchEnded() {
    lastDist = 0;
    lastCenter = null;
    UpdateProperties();
}

function UpdateObject() {
    if(selectedObj){
        var propPosX = document.getElementById("propPosX");
        var propPosY = document.getElementById("propPosY");
        var propPosW = document.getElementById("propPosW");
        var propPosH = document.getElementById("propPosH");
        var propType = document.getElementById("propType");

        selectedObj.x = parseFloat(propPosX.value);
        selectedObj.y = parseFloat(propPosY.value);
        selectedObj.w = parseFloat(propPosW.value);
        selectedObj.h = parseFloat(propPosH.value);

        selectedObj.texture = iconSelect.getSelectedIndex();
        selectedObj.type = propType.selectedIndex;
    }
}

function UpdateProperties() {
    if(selectedObj){
        var propPosX = document.getElementById("propPosX");
        var propPosY = document.getElementById("propPosY");
        var propPosW = document.getElementById("propPosW");
        var propPosH = document.getElementById("propPosH");
        var propType = document.getElementById("propType");

        propPosX.value = selectedObj.x;
        propPosY.value = selectedObj.y;
        propPosW.value = selectedObj.w;
        propPosH.value = selectedObj.h;

        iconSelect.setSelectedIndex(selectedObj.texture);
        propType.selectedIndex = selectedObj.type;
    }
}

function mouseDragged() {
    cursorMove();
}
  
function mouseReleased() {
    UpdateProperties();
    if(mouseButton === RIGHT) {
        emptyContext.style.display = "none";
        objectContext.style.display = "none";

        if(selectedObj && selectedObj.contains(mouseX / sf - cameraPos.x, mouseY / sf - cameraPos.y)){
            UpdateProperties();
            objectContext.style.left = mouseX;
            objectContext.style.top = mouseY + 40;
            objectContext.style.display = "";
        }
        else{
            emptyContext.style.left = mouseX;
            emptyContext.style.top = mouseY + 40;
            emptyContext.style.display = "";
        }
    }
}

function applyScale(s) {
    sf = sf * s;
    cameraPos.x = mouseX * (1-s) + cameraPos.x * s;
    cameraPos.y = mouseY * (1-s) + cameraPos.y * s;
}

window.addEventListener("wheel", function(e) {
    applyScale(e.deltaY < 0 ? 1.05 : 0.95);
} );

function keyPressed() {
    if (key == '-') {
        applyScale(0.95);
    } else if (key == '+') {
        applyScale(1.05);
    } 
}

function GameObject(x, y, w, h, type, texture) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
    this.texture = texture;

    this.render = function(){
        strokeWeight(0);
        var texW = textures[this.texture].width;
        var texH = textures[this.texture].height;

        for(var y = 0; y < this.h; y += texH){
            for(var x = 0; x < this.w; x += texW){
                if ((x + texW) > this.w || (y + texH) > this.h){
                    var resizeW = min(texW - ((x + texW) - this.w), texW);
                    var resizeH = min(texH - ((y + texH) - this.h), texH);

                    image(textures[this.texture], this.x + x, this.y + y, resizeW, resizeH, 0, 0, resizeW, resizeH);
                }
                else{
                    image(textures[this.texture], this.x + x, this.y + y);
                }
            }
        }
    };

    this.contains = function (x, y) {
        return this.x <= x && x <= this.x + this.w &&
               this.y <= y && y <= this.y + this.h;
    };

    this.clone = function(){
        return new GameObject(this.x, this.y, this.w, this.h, this.type, this.texture);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(";base64,") + 8;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for(i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}

function bytesToFloat(bytes){
    var buf = new ArrayBuffer(4);
    var view = new DataView(buf);

    bytes.forEach(function (b, i) {
        view.setUint8(i, b);
    });

    return view.getFloat32(0);
}

function loadFile(file){
    var buffer = convertDataURIToBinary(file.data);
    selectedObj = null;
    gameobjects = [];
    for (var i = buffer[0] + 1; i < buffer.length; i += 18)
    {
        var x = bytesToFloat( [buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]] );
        var y = bytesToFloat( [buffer[i + 4], buffer[i + 5], buffer[i + 6], buffer[i + 7]] );
        var w = bytesToFloat( [buffer[i + 8], buffer[i + 9], buffer[i + 10], buffer[i + 11]] );
        var h = bytesToFloat( [buffer[i + 12], buffer[i + 13], buffer[i + 14], buffer[i + 15]] );
        gameobjects.push(new GameObject(x, y, w, h, buffer[i + 16], buffer[i + 17]));
    }
}

function loadLevelSelector(file){
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function (evt) {
        var buffer = new Uint8Array(evt.target.result);
        selectedObj = null;
        gameobjects = [];
        for (var i = buffer[0] + 1; i < buffer.length; i += 18)
        {
            var x = bytesToFloat( [buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]] );
            var y = bytesToFloat( [buffer[i + 4], buffer[i + 5], buffer[i + 6], buffer[i + 7]] );
            var w = bytesToFloat( [buffer[i + 8], buffer[i + 9], buffer[i + 10], buffer[i + 11]] );
            var h = bytesToFloat( [buffer[i + 12], buffer[i + 13], buffer[i + 14], buffer[i + 15]] );
            gameobjects.push(new GameObject(x, y, w, h, buffer[i + 16], buffer[i + 17]));
        }
        document.getElementById("file-input").value = "";
    }
}

function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
}

function resetView() {
    cameraPos = {x: round(width / 2) - 16, y: round(height / 2) - 24};
    sf = 1;
    emptyContext.style.display = "none";
}

function createObject(iscontext = true) {
    var tmp = new GameObject(-cameraPos.x + (emptyContext.offsetLeft / sf) - 16, -cameraPos.y + (emptyContext.offsetTop - 40 / sf) - 16, 32, 32, 0, 0);
    if(!iscontext){
        tmp.x = -cameraPos.x + (width / 2 / sf) - 16;
        tmp.y = -cameraPos.y + (height / 2 / sf - 40) - 16;
    }
    gameobjects.push(tmp);
    selectedObj = tmp;
    UpdateProperties();

    emptyContext.style.display = "none";
}

function cutSelected() {
    if(selectedObj){
        clipboard = selectedObj.clone();
        gameobjects.splice(gameobjects.indexOf(selectedObj), 1);
        selectedObj = null;
    }
    objectContext.style.display = "none";
}

function copySelected() {
    if(selectedObj){
        clipboard = selectedObj.clone();
        selectedObj = null;
    }
    objectContext.style.display = "none";
}

function pasteCopied(iscontext = true) {
    if(!clipboard) return;
    var tmp = clipboard.clone();
    if(iscontext){
        tmp.x = -cameraPos.x + (emptyContext.offsetLeft / sf) - 16;
        tmp.y = -cameraPos.y + (emptyContext.offsetTop / sf) - 56;
    }
    else{
        tmp.x = -cameraPos.x + (width / 2 / sf) - 16;
        tmp.y = -cameraPos.y + (height / 2 / sf - 40) - 16;
    }
    gameobjects.push(tmp);
    selectedObj = tmp;
    UpdateProperties();
    emptyContext.style.display = "none";
}

function deleteObject() {
    if(selectedObj){
        gameobjects.splice(gameobjects.indexOf(selectedObj), 1);
        selectedObj = null;
    }
    objectContext.style.display = "none";
}

function setOrder(side){
    if(!selectedObj) return;
    arrMove(gameobjects, gameobjects.indexOf(selectedObj), side == 1 ? gameobjects.length - 1 : 0);
}

function moveOrder(side){
    if(!selectedObj) return;
    arrMove(gameobjects, gameobjects.indexOf(selectedObj), side == 1 ? gameobjects.indexOf(selectedObj) + 1 : gameobjects.indexOf(selectedObj) - 1);
}

function arrMove(input, from, to) {
    let numberOfDeletedElm = 1;
    const elm = input.splice(from, numberOfDeletedElm)[0];
    numberOfDeletedElm = 0;
    input.splice(to, numberOfDeletedElm, elm);
}

function savePrompt() {
    var byteNumbers = [];
    byteNumbers.push(0);

    gameobjects.forEach(el => {
        var farr = new Float32Array(4);
        farr[0] = el.x;
        farr[1] = el.y;
        farr[2] = el.w;
        farr[3] = el.h;
        var barr = new Int8Array(farr.buffer);

        byteNumbers.push(barr[3]);byteNumbers.push(barr[2]);byteNumbers.push(barr[1]);byteNumbers.push(barr[0]);
        byteNumbers.push(barr[7]);byteNumbers.push(barr[6]);byteNumbers.push(barr[5]);byteNumbers.push(barr[4]);
        byteNumbers.push(barr[11]);byteNumbers.push(barr[10]);byteNumbers.push(barr[9]);byteNumbers.push(barr[8]);
        byteNumbers.push(barr[15]);byteNumbers.push(barr[14]);byteNumbers.push(barr[13]);byteNumbers.push(barr[12]);

        byteNumbers.push(el.type);
        byteNumbers.push(el.texture);
    });

    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], {type: "application/octet-stream"});
    var fileName = "level.lvl";
    saveAs(blob, fileName);
}

function saveAs(blob, fileName) {
    var url = window.URL.createObjectURL(blob);
    var anchorElem = document.createElement("a");
    anchorElem.style = "display: none";
    anchorElem.href = url;
    anchorElem.download = fileName;
    document.body.appendChild(anchorElem);
    anchorElem.click();
    document.body.removeChild(anchorElem);
    setTimeout(function() {
        window.URL.revokeObjectURL(url);
    }, 1000);
}