/*
 * Created by Jenya on 13.06.15.
 */
function onScreen (text) {
    document.getElementById("p1").innerHTML += "<br>" + text;
}

var textLoaded="";
var sourceData=[];
var casesSizes=[];
var casesTotals=[];
var casesOutputs=[];

function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) {
        textLoaded = fileLoadedEvent.target.result;
        divide(textLoaded);
        loadCases();
        searcher();
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

function loadLocalFile() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
            textLoaded = xmlhttp.responseText;
            divide(textLoaded);
            loadCases();
            searcher();
        }
    };
    xmlhttp.open("GET","sourse.txt",true);
    xmlhttp.send();
}

function divide (rawTaskText) {
    var noOfCases = parseInt(rawTaskText.substring(0,1));
    var place = 2;
    for (i=0; i<noOfCases; i++) {
        casesSizes[i]= parseInt(rawTaskText.substr(place,1));
        place += (casesSizes[i]*(casesSizes[i]+1)+2)
    }
}

function loadCases () {
    var readerPlace=4;
    for (caseNo = 0; caseNo<casesSizes.length; caseNo++) {
        casesTotals [caseNo] = 0;
        sourceData [caseNo] = new Array;
        for (posY=0; posY<casesSizes[caseNo]; posY++) {
            sourceData [caseNo][posY] = new Array;
            for (posX=0; posX<casesSizes[caseNo]; posX++){
                if (textLoaded.substr(readerPlace,1)=="#") {
                    sourceData [caseNo][posY][posX] = 1;
                    casesTotals[caseNo] = casesTotals[caseNo] + 1;
                } else {
                    sourceData [caseNo][posY][posX] = 0
                }
                readerPlace++;
            }
            readerPlace ++;
        }
        readerPlace+=2;
    }

    for (caseNo = 0; caseNo<casesSizes.length; caseNo++) {
        var printline;
        onScreen("caseNo:" + (caseNo+1));
        for (posY=0; posY<casesSizes[caseNo]; posY++) {
            printline = "";
            for (posX=0; posX<casesSizes[caseNo]; posX++){
                printline += sourceData[caseNo][posY][posX];
            }
            onScreen(printline);
        }
    }
}

function searcher () {
    function arrSum (casNo,startX,startY,endX,endY) {
        var arSum=0;
        for (y=startY; y<endY;y++) {
            for (x=startX; x<endX;x++) {
                arSum += sourceData[casNo][y][x];
            }
        }
        return arSum
    }

    var endCaseSearch;
    for (caseNo = 0; caseNo < casesSizes.length; caseNo++) {
        endCaseSearch = false;
        for (posY = 0; posY < casesSizes[caseNo]; posY++) {
            for (posX = 0; posX < casesSizes[caseNo]; posX++) {
                if (sourceData[caseNo][posY][posX] === 1) {
                    var startX=posX; startY=posY; sqSize = 2;
                    if (sourceData[caseNo][posY][posX + 1] === 1) {
                        for (pY = posY, pX = posX + 2; pX <= (casesSizes[caseNo] - posX); pX++) {
                            if (sourceData[caseNo][pY][pX] === 1) {
                                sqSize ++;
                            }
                        }
                        var total = 0;
                        total = arrSum(caseNo,startX,startY,startX+sqSize,startY+sqSize);
                        if (total === (sqSize * sqSize)) {
                            if (casesTotals[caseNo] === total) {
                                endCaseSearch = true;
                                casesOutputs[caseNo]="YES";
                                break;
                            } else {
                                endCaseSearch = true;
                                casesOutputs[caseNo]="NO";
                                break;
                            }
                        } else {
                            endCaseSearch = true;
                            casesOutputs[caseNo]="NO";
                            break
                        }
                    } else {
                        endCaseSearch = true;
                        casesOutputs[caseNo]="NO";
                        break;
                    }
                }
                if (endCaseSearch) {
                    break
                }
            }
            if (endCaseSearch) {
                break
            }
        }
    }

    for (i=0; i<casesOutputs.length; i++) {
        onScreen("Case #" + (i + 1) + ": " + casesOutputs[i])
    }
}

loadLocalFile();