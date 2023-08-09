var colorSpace;
var selectedFillColor = new Array(0);
var selectedStrokeColor = new Array(0);
var selectedPos = new Array(0);

DipsColorInfoTexts();

//typname == textFrame or PathItem
function DipsColorInfoTexts() {
    colorSpace = CheckColorSpace();

    GetSelectionObjColor();
    CheckColorLayerExistence();
    SetColorInfo();
}

function CheckColorSpace() {
    if(activeDocument.documentColorSpace == "DocumentColorSpace.RGB") return ("RGB");
    else if(activeDocument.documentColorSpace == "DocumentColorSpace.CMYK") return ("CMYK");
}

function GetSelectionObjColor() {
    var selectionItems = activeDocument.selection;
    
    if(selectionItems.length > 0) {
        for(var i = 0; i < selectionItems.length; i++) {
            if(selectionItems[i].typename == "TextFrame") {    
                var obj = selectionItems[i].textRange.characters[0];
                
                //FillCheck
                var objColor = obj.fillColor;
                if(colorSpace == "RGB") {
                    if(objColor.red == undefined) selectedFillColor.push( "none" );
                    else selectedFillColor.push( objColor.red + "," + objColor.green + "," + objColor.blue );
                }
                else if(colorSpace == "CMYK") {
                    if(objColor.cyan == undefined) selectedFillColor.push( "none" );
                    else selectedFillColor.push( Math.round(objColor.cyan) + "," + Math.round(objColor.magenta) + "," + Math.round(objColor.yellow) + "," + Math.round(objColor.black) );
                }

                //StrokeCheck
                var objStroke = obj.strokeColor;
                if(colorSpace == "RGB") {
                    if(objStroke.red == undefined) selectedStrokeColor.push( "none" );
                    else selectedStrokeColor.push( objStroke.red + "," + objStroke.green + "," + objStroke.blue );
                }
                else if(colorSpace == "CMYK") {
                    if(objStroke.cyan == undefined) selectedStrokeColor.push( "none" );
                    else selectedStrokeColor.push( Math.round(objColor.cyan) + "," + Math.round(objColor.magenta) + "," + Math.round(objColor.yellow) + "," + Math.round(objColor.black)  );
                }

                selectedPos.push( [selectionItems[i].top, selectionItems[i].left] );
            }
            else if(selectionItems[i].typename == "PathItem") {
                var obj = selectionItems[i];
                
                //FillCheck
                if(obj.filled) {
                    var objColor = obj.fillColor;
                    if(colorSpace == "RGB") selectedFillColor.push( objColor.red + "," + objColor.green + "," + objColor.blue );
                    else if(colorSpace == "CMYK") selectedFillColor.push( Math.round(objColor.cyan) + "," + Math.round(objColor.magenta) + "," + Math.round(objColor.yellow) + "," + Math.round(objColor.black)  );

                }
                else {
                    selectedFillColor.push( "none" );
                }

                //StrokeCheck
                if(obj.stroked) {
                    var objStroke = obj.strokeColor;
                    if(colorSpace == "RGB") selectedStrokeColor.push( objStroke.red + "," + objStroke.green + "," + objStroke.blue );
                    else if(colorSpace == "CMYK") selectedStrokeColor.push( Math.round(objColor.cyan) + "," + Math.round(objColor.magenta) + "," + Math.round(objColor.yellow) + "," + Math.round(objColor.black)  );
                }
                else {
                    selectedStrokeColor.push( "none" );
                }

                selectedPos.push( [selectionItems[i].top, selectionItems[i].left] );
            }
        }
    }
}

function CheckColorLayerExistence() {
    var layers = activeDocument.layers;

    for(var i = 0; i < layers.length; i++){
        if(layers[i].name == "ColorInfo") {
            activeDocument.activeLayer = layers[i];
            break;
        }
        else {
            layers.add().name = "ColorInfo";
            break;
        }
    }
}

function SetColorInfo(){

    for(var i = 0; i < selectedFillColor.length; i++) {
        var text = activeDocument.textFrames.add();
        if(colorSpace == "RGB") text.contents = "Fill(RGB):" + selectedFillColor[i];
        else if(colorSpace == "CMYK") text.contents = "Fill(CMYK):" + selectedFillColor[i];
        text.top = selectedPos[i][0]+40;
        text.left = selectedPos[i][1];

        var text = activeDocument.textFrames.add();
        if(colorSpace == "RGB") text.contents = "Stroke(RGB):" + selectedStrokeColor[i];
        else if(colorSpace == "CMYK") text.contents = "Stroke(CMYK):" + selectedStrokeColor[i];
        text.top = selectedPos[i][0]+20;
        text.left = selectedPos[i][1];
    }
}