/* 

revised as of 10/16/2024

updated for website
 - added letter-key operation for keyboard
 - added buttons for mouse or touch 
 - added an automated solution
 
*/

//  Variables etc....

let cell = [];
let pathCellIndx = [];
let cPi = [];let cPj=[];
let xCor=[];let yCor=[];
let xCoords=[]; let yCoords=[];
let xCntr=[]; let yCntr=[];
let pCelli=[]; pCellj=[]; 


let nCols,nRows;
let loc;
let iRandom, iMove;
let cCi, cCj; // shorthand for currentCell i and j index
let pCi, pCj; // shorthand for perviousCell i and j index
let cPindex; // counter for current cell path
let numInactiveCells; 
let inActiveCellsLeft, rollDice;
let iOpt;
let nColsMin, nColsMax;
let xLeftUpCornerMaze, yLeftUpCornerMaze;
let inDoor, outDoor;
let ragFac;
let xUL,yUL,xUR,yUR,xLL,yLL,xLR,yLR;
    
let originX, originY;
let size;
let side;
let mPressed;
let iDrawMaze,iBuildMaze,iSolveMaze,iDrawPath,iSaveMaze; 
let iSolution,iShowSolution,iHideSolution,iSolved;
let iSolStart,jSolStart,iStepped,iStopSolution;
let solStepCnt, dFacing, dFacingEntered;
let iFindSolution, iDrawSolution;
let lCstat,rCstat,uCstat,dCStat;
let nOpenC, nPathC, nWallC;
let dice;
let mReleased;
    
 // stuff for solving the maze   
  let iStepUp, iStepDwn, iStepRgt, iStepLft;
  let iYou,jYou;
  let dotSize;

// some text stuff

  let s1,s2,s3,s4,s5,s6,s7,s8;
  let bs1,bs2,bs3;
  let ss1,ss2,ss3;  

// <<<<<<<<<<< end of variables >>>>>>>>>
 
function setup() {  
  // size and center the maze based upon the number of cells
  createCanvas(900,680);

  background(255);
  dotColor = color(255,0,0);
  visitedDotColor = color(255,255,0);
  
  originX = .05*width; originY = .04*height;
  xLeftUpCornerMaze = originX; yLeftUpCornerMaze = originY;

 ss1 = "NEW MAZE COMPLEXITY";  ss2 = "SIMPLE";  ss3 = "COMPLEX";

// declare slider and buttons objects
    sizeBar = new ScrollBar(700,565,150,35,1);
    refreshButton = new Button(720, 505, 130, 50, 255, 255, 0,false,'    NEW MAZE ');
    solveButton = new Button( 720.,130.,130.,50., 0, 200,0, false,'   SOLVE MAZE ');
    saveButton = new Button(720, 40, 130, 50, 255, 204, 255, false,'   SAVE MAZE');

    uPButton = new Button(750., 200., 75., 75., 153, 204, 255,false, '   Up(w)');
    dNButton = new Button(750.,360.,75., 75., 153, 204, 255,false, '   Down(s)');
    leftButton = new Button(675, 280, 75, 75, 153, 204, 255,false, '   Left(a)');
    rightButton = new Button(825, 280, 75, 75, 153, 204, 255,false, '   Right(d)');



  nColsMin = 12;
  nRowsMin = nColsMin;

  iBuildMaze = true; iDrawMaze = true; iSolveMaze = false; 
  iDrawPath = false; iSaveMaze = false;
  iFindSolution = false; iDrawSolution = false; iHideSolution =  true;
  iShowSolution = false;
  iSolved = false;

  iStepUp=false; iStepDwn=false; iStepRgt=false; iStepLft=false;

}  // end of function setup ***********************



function draw () {

    createCanvas(900,680);
    background(255);

    sizeBar.sbDisplay();
    sizeBar.sbUpdate();
    refreshButton.buttonDraw();
    saveButton.buttonDraw();
    solveButton.buttonDraw();
    uPButton.buttonDraw();
    dNButton.buttonDraw();
    leftButton.buttonDraw();
    rightButton.buttonDraw();

    if(refreshButton.buttonCheck() == true && mReleased == true) 
      {iBuildMaze = true; mReleased = false;}

    if(solveButton.buttonCheck() == true && mouseIsPressed == true) 
      {iSolveMaze = true; } 

    if(saveButton.buttonCheck() == true && mouseIsPressed == true) 
      {iSaveMaze = true;}    

    fill(0);textSize(13); 
    strokeWeight(1);stroke(0); 
    text(ss1, 700, 635);
    text(ss2, 700, 615);
    text(ss3, 790, 615);

    stroke(0,0,255); strokeWeight(15);
    line(680,110,890,110);
    line(680,490,890,490);
    stroke(0);
    
    if(iBuildMaze == true){
        buildMaze();
        iBuildMaze = false;
        findSolution();
        iFindSolution = false;
        iShowSolution = false;}

    if(iDrawMaze == true){
      drawMaze(); }
    
    if(iSolveMaze == true){
        solveMaze();
        drawPath();}

   if(iShowSolution == true){
        drawSolution();} 
       
    if(iSaveMaze == true){
        noStroke();
        fill(255);
        rect(670,0,250,680);
        saveCanvas('aMaze','jpg');
        let count;
        for(let ic=0;ic<100000;ic=ic+.0001) // need a short delay so only 1 copy of the maze is downloaded
          {count=count+ic;}
           iSaveMaze = false;}
}

  
function buildMaze () {
  background(255);

    nRows = nColsMin + int(((sizeBar.getPos()-913)/150)*55);
    nCols = nRows;

    size = int(.9*height/nRows);
    ragFac = 12 - int(nRows)/5;
    if(ragFac < 3){ragFac = 3};

    dotSize = .6*size;

    inDoor = int(random(1,nCols-1));
    outDoor = int(random(1,nCols-1));

     // compute positions of the upper left corner of all the undeformed square cells
    //  i is the horizontal row index, j is the vertical column index
    
    for(let j=0; j<= nCols; j++){ //the "x - horizontal" position varies for each column
        xCor[j] = originX + j * size;  
        }
    for (let i=0; i<= nRows; i++) { // the "y - vertical" position varies for each column
        yCor[i] = originY + i * size;
        }

   for(let i=0; i<=nRows; i++){ //initialize the 2D array (an array of arrays)!
      xCoords[i]=[]; yCoords[i]=[];
      for(let j=0; j<=nCols; j++){
        xCoords[i][j]=[]; yCoords[i][j];}
    }   

    for(let i=0; i<= nRows; i++){ //each row starting at top row
        for (let j=0; j<= nCols; j++) {
            xCoords[i][j]=xCor[i] + ragFac * random(-1.,1.);
            yCoords[i][j]=yCor[j] + ragFac * random(-1.,1.);
        }
    }

    // define the 4 corner points and create the cell objects

    for(let i=0; i<=nRows; i++){ //initialize the 2D array (an array of arrays)!
      cell[i]=[];
      for(let j=0; j<=nCols; j++){
        cell[i][j]=[];}
    }

    //generate the cell objects based upon the upper left corner position 
    // 
    // initialize all the square cell object parameters for a new maze
    for(let i=0; i<nRows; i++){ //each row starting at top row
        for (let j=0; j<nCols; j++) { // across the columns
            xUL=xCoords[i][j]; yUL=yCoords[i][j];
            xUR=xCoords[i+1][j]; yUR=yCoords[i+1][j];
            xLL=xCoords[i][j+1]; yLL=yCoords[i][j+1];
            xLR=xCoords[i+1][j+1]; yLR=yCoords[i+1][j+1];
            cell[j][i] = new Cell(xUL,yUL,xUR,yUR,xLR,yLR,xLL,yLL,true,true,true,true,false,true, true, true, true,false,false);
        }
    }
      
    // store all the deformed cell center locations for solution paths

    for(let i=0; i<nRows; i++){ //each row starting at top row
        pathCellIndx[i]=[];
        for (let j=0; j<nCols; j++) { // across the columns
            pathCellIndx[i][j] = new Path(cell[i][j].xCc, cell[i][j].yCc, false, dotSize);
        }
    }
    
    for(let i=0; i<nRows; i++){ //each row
        for (let j=0; j<nCols; j++) { // across the columns
            // block out all edge squares and make them inactive i.e. can't be eliminated when opening the maze
            if(i==0 ||i==nRows-1 || j==0 || j==nCols-1)
            {cell[i][j].inM = true;}
        }
    }
    
    numInactiveCells=(nRows)*(nCols)- 2*nCols-2*(nRows- 2); // all non-wall cells start as inactive
    
    // select an interior cell at random as the maze starting point
    cCj= int(random(3,float(nCols-3)));
    cCi= int(random(3,float(nRows-3)));
    cell[cCi][cCj].inM = true;
    numInactiveCells = numInactiveCells -1;
    inActiveCellsLeft = true; // variable is true as long as there are ininM cells
    
    // initialize path tracking paramater arrays
    
    cPi[0]=cCi; cPj[0]=cCj;
    cPi[1]=cCi; cPj[1]=cCj;
    cPindex = 1;
    
    // begin the depth first search algorithm to eliminate maze walls and create the maze
    
    while (numInactiveCells > 0 && cPindex>0) {
        
        if(!cell[cCi-1][cCj].inM||!cell[cCi][cCj+1].inM||!cell[cCi+1][cCj].inM||!cell[cCi][cCj-1].inM)
        {rollDice=true;}
        
        else { // no inactive cells available for a move
            cCi=cPi[cPindex-1];
            cCj=cPj[cPindex-1];
            cPindex=cPindex-1;
        }
        
        while(rollDice) { // roll the dice to find a door to open
            
            iMove=int(random(1.,4.99));
            
            if(iMove == 1 && !cell[cCi-1][cCj].inM) { // cell above - wall 1
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall1 = false;  // current cell
                cell[cCi-1][cCj].wall3 = false; // neighboor and next cell
                cCi = cCi-1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 2 && !cell[cCi][cCj+1].inM) {  // cell to the right - wall 2
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall2 = false;  // current cell
                cell[cCi][cCj+1].wall4 = false; // neighboor and next cell
                cCj=cCj+1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 3 && !cell[cCi+1][cCj].inM) { // cell below - wall 3
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall3 = false;  // current cell
                cell[cCi+1][cCj].wall1 = false; // neighboor and next cell
                cCi=cCi+1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice=false;}
            
            else if(iMove == 4 && !cell[cCi][cCj-1].inM) {  // cell to the left - wall 4
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall4 = false;  // current cell
                cell[cCi][cCj-1].wall2 = false; // neighboor and next cell
                cCj=cCj-1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice=false;}
        }

    }    // end wall breakout process - the maze is complete
    
    iBuildMaze = false;
    iSolveMaze = false;
    iDrawMaze = true;
    
    iYou=0; jYou=inDoor; // set your starting position 
    iSolStart = iYou; jSolStart = jYou; //Solution starts at your starting point 
    
    // remove the walls on the door cells
    cell[0][inDoor].wall1 = false;
    cell[0][inDoor].wall3 = false; 
    cell[1][inDoor].wall1 = false;
    cell[nRows-2][outDoor].wall3 = false;
    cell[nRows-1][outDoor].wall1 = false;

    // position door arrows

    let xInDoor = cell[0][inDoor].xCc;
    let yInDoor = cell[0][inDoor].yCc - (size/2) - 25;

    let xOutDoor = cell[nRows-2][outDoor].xCc;
    let yOutDoor = cell[nRows-2][outDoor].yCc + (size/2) + 5;

    arrowTop = new Arrow(xInDoor,yInDoor,2);
    arrowBottom = new Arrow(xOutDoor,yOutDoor+size,2); 
}
//-----------------------------------------------------------------------------

function solveMaze(){
    // build a path to move through the maze
    
    if(iStepUp == true)
        {if (cell[iYou][jYou].wall1 == true)
            {iStepUp=false;}
        else{iYou=iYou-1; pathCellIndx[iYou][jYou].inPath=true; iStepUp = false;}
    }
    
    if(iStepDwn == true)
        {if (cell[iYou][jYou].wall3 == true)
            {iStepDwn=false;}
        else{iYou=iYou+1; pathCellIndx[iYou][jYou].inPath=true; iStepDwn = false;}
    }
    
    if(iStepRgt == true)
        {if (cell[iYou][jYou].wall2 == true)
            {iStepRgt=false;}
        else{jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStepRgt = false;}
    }

    if(iStepLft == true)
        {if (cell[iYou][jYou].wall4 == true)
            {iStepLft=false;}
        else{jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStepLft = false;}
    }
    
    // end of function solveMaze
}   

//--------------------------------------------------------------
function drawMaze(){

 // draw and fill the boarder cells 
    for(let i=0; i<nRows; i++){ //down the rows
        for (let j=0; j<nCols; j++) { // across the columns    
          if(i==0 || i==nRows-1 || j==0 || j==nCols-1){

            if((i == 0 && j == inDoor) || (i == nRows-1 && j == outDoor))
                { ;} // do nothing
            else
                {cell[i][j].drawBoarder();} // fill a boarder cell
            }
        }
    }    

    // draw the completed maze - all cells within the boarders   
    for(let i=1; i<nRows-1; i++){ //each row
        for (let j=1; j<nCols-1; j++) { // across the columns
            cell[i][j].displayCell();
        }   
    }
   
    // draw maze doors
      cell[0][inDoor].drawDoor();
      cell[nRows-1][outDoor].drawDoor();
 
   // draw the arrows
      arrowTop.displayArrow();
      arrowBottom.displayArrow();
   
// end of function drawMaze
}


//--------------------------------------------------------------
function drawPath(){
    // draw the path through the maze
    
    // mark your staring point in the maze
    pathCellIndx[0][inDoor].inPath = true;
    fill(0,200,0);
    noStroke(); 
    ellipse(pathCellIndx[0][inDoor].xCntr, pathCellIndx[0][inDoor].yCntr,dotSize,dotSize);   
    
    // mark all cells visited so far!
    for(let i=1; i<nRows-1; i++){ //each row
        for (let j=1; j<nCols-1; j++) { // across the columns
            pathCellIndx[j][i].markCell();
        }
    }
    
    // remove the walls on the door cells
    cell[0][inDoor].wall1 = false;
    cell[0][inDoor].wall3 = false; 
    cell[1][inDoor].wall1 = false;
    cell[nRows-2][outDoor].wall3 = false;
    cell[nRows-1][outDoor].wall1 = false;

    // display your current position in the maze
   
    if(iYou==nRows-1 && jYou == outDoor){
        fill(0, 0, 255);
        ellipse(pathCellIndx[iYou][jYou].xCntr, pathCellIndx[iYou][jYou].yCntr,0.4*size,0.4*size);}

    else{ 
        fill(0,200,0); 
        ellipse(pathCellIndx[iYou][jYou].xCntr, pathCellIndx[iYou][jYou].yCntr,0.5*size,0.5*size);
    }
    
    // end of function drawPath
}



//--------------------------------------------------------------
function findSolution(){
    // define all walls in the initial maze as the starting configuration for the solution maze

    for(let i=0; i<nRows-1; i++){ //each row
        for (let j=0; j<nCols-1; j++) { // across the columns
            cell[i][j].swall1 = cell[i][j].wall1;
            cell[i][j].swall2 = cell[i][j].wall2;
            cell[i][j].swall3 = cell[i][j].wall3;
            cell[i][j].swall4 = cell[i][j].wall4;                        
        }   
    }

    // goal is move through the maze and add walls

    // find the path that solves the maze 
    iSol = 1; jSol = jSolStart; // start in entry cell


    cell[iSol][jSol].inSol = true;  // starting cell always in the solution path 
    cell[iSol][jSol].swall1 = true; // close the top first step cell wall1
    cell[0][jSol].swall3 = true; // close the top  entry cell wall3
    cell[iSol][jSolStart].iSealed = false; // and it can't be sealed   
    cell[0][jSol].iSealed = true;
    cell[0][jSol].wall3 = true;
    solStepCnt = 0; 
    iStopSolution = false;

// Start a exhaustive search through maze and "seal" dead-end cells as you go

while(iStopSolution == false){

/*  determine status of neighbor cells of the current cell
    Cstat values: 0 - open, 1 - wall, 2 - inPath
*/
    // up Cell
    uCstat = 0; // assume up Cell is open unless
    if(cell[iSol-1][jSol].swall3 == true){uCstat = 1;}
    if((cell[iSol-1][jSol].inSol == true) && (cell[iSol-1][jSol].swall3 == false)){uCstat = 2;}
    // down Cell
    dCstat = 0; // assume down Cell is open unless
    if(cell[iSol+1][jSol].swall1 == true){dCstat = 1;}
    if((cell[iSol+1][jSol].inSol == true) && (cell[iSol+1][jSol].swall1 == false)){dCstat = 2;}
    // left Cell
    lCstat = 0; // assume left Cell is open unless
    if(cell[iSol][jSol-1].swall2 == true){lCstat = 1;}
    if((cell[iSol][jSol-1].inSol == true) && (cell[iSol][jSol-1].swall2 == false)) {lCstat = 2;}
    // right Cell
    rCstat = 0; // assume right Cell is open unless
    if(cell[iSol][jSol+1].swall4 == true){rCstat = 1;}
    if((cell[iSol][jSol+1].inSol == true) && (cell[iSol][jSol+1].swall4 == false)) {rCstat = 2;}

/*
    starting from the cell below entrance - using the status of the cells around you
    decide which way to move.
    the up, down, left and right wall designation is relative to the point you are
    in the "maze" - not the direction you are facing/moving.
*/
    iStepped = false;  //only 1 step per cycle through while loop

    cell[1][jSolStart].inSol = true;  // starting cell always in the solution path
    cell[1][jSolStart].isSealed = false; // and never sealed

// determine how many walls surround you
    nWallC = 0;
    if(uCstat == 1){nWallC = nWallC +1;}
    if(dCstat == 1){nWallC = nWallC +1;}
    if(lCstat == 1){nWallC = nWallC +1;}
    if(rCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(uCstat == 0){nOpenC = nOpenC +1;}
    if(dCstat == 0){nOpenC = nOpenC +1;}
    if(lCstat == 0){nOpenC = nOpenC +1;}
    if(rCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (inPath) cells surround you
    nPathC = 0;
    if(uCstat == 2){nPathC = nPathC +1;}
    if(dCstat == 2){nPathC = nPathC +1;}
    if(lCstat == 2){nPathC = nPathC +1;}
    if(rCstat == 2){nPathC = nPathC +1;} 

    if(nWallC == 3){ // you are in a dead-end cell (3 walls) - find the one open wall

        if(iStepped == false && (dCstat == 0 || dCstat == 2)) // move down into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall1=true;
          cell[iSol][jSol].swall2=true;
          cell[iSol][jSol].swall3=true;
          cell[iSol][jSol].swall4=true;
          iSol = iSol+1; jSol = jSol;  // move down
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (uCstat == 0 || uCstat == 2)) // move up into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;     
          cell[iSol][jSol].swall1=true;
          cell[iSol][jSol].swall2=true;
          cell[iSol][jSol].swall3=true;
          cell[iSol][jSol].swall4=true;
          iSol = iSol-1; jSol = jSol;  //move up
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (lCstat == 0 || lCstat == 2)) // move left into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall1=true;
          cell[iSol][jSol].swall2=true;
          cell[iSol][jSol].swall3=true;
          cell[iSol][jSol].swall4=true;
          iSol = iSol; jSol = jSol-1;  // move left
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (rCstat == 0 || rCstat == 2)) // move right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall1=true;
          cell[iSol][jSol].swall2=true;
          cell[iSol][jSol].swall3=true;
          cell[iSol][jSol].swall4=true;
          iSol = iSol; jSol = jSol+1;  // move right
          iStepped = true; solStepCnt = solStepCnt +1;
          }
        
        cell[1][jSolStart].isSealed = false; // enty cell can't be sealed or modified  
        cell[1][jSolStart].swall2 = cell[1][jSolStart].wall2;
        cell[1][jSolStart].swall3 = cell[1][jSolStart].wall3;
        cell[1][jSolStart].swall4 = cell[1][jSolStart].wall4;
    }


    if(nOpenC => 1 && iStepped == false){ // find an open (not-yet-in-solutiom) cell to move into

        if(dCstat == 0) // move down into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol;
          cell[iSol][jSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;
           }
        if((iStepped == false) && (uCstat == 0)) // move up into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol-1; jSol = jSol; 
          cell[iSol][jSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;
           }
        if((iStepped == false) && (lCstat == 0)) // move left into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol; jSol = jSol-1;
          cell[iSol][jSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
           }
        if((iStepped == false) && (rCstat == 0)) // move right into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol; jSol = jSol+1;
          cell[iSol][jSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
          }

    }

    if((nPathC => 1) && (iStepped == false)){ // find a "random" open (in-solutiom) cell to move into

        dice=int(random(0.,3.99));

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (dCstat == 2))// move down into an open cell (already in solution)
            {iSol = iSol+1; jSol = jSol;
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 1:
            if((iStepped == false) && (uCstat == 2)) // move up into an open cell (already in solution)
            { iSol = iSol-1; jSol = jSol; 
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 2:
            if((iStepped == false) && (lCstat == 2)) // move left into an open cell (already in solution)
            { iSol = iSol; jSol = jSol-1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 3:
            if((iStepped == false) && (rCstat == 2)) // move right into an open cell (already in solution)
            {iSol = iSol; jSol = jSol+ 1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;
    }

    }

        cell[1][jSolStart].inSol = true;  // starting cell always in the solution path
        cell[1][jSolStart].isSealed = false; // enty cell can't be sealed or modified  
        cell[1][jSolStart].swall2 = cell[1][jSolStart].wall2;
        cell[1][jSolStart].swall3 = cell[1][jSolStart].wall3;
        cell[1][jSolStart].swall4 = cell[1][jSolStart].wall4;

        if((iSol == nRows-2 && jSol == outDoor) || (solStepCnt > 10000)) {iStopSolution = true;}

    } // end of solution search while

    // end of function findSolution
}

//--------------------------------------------------------------
function drawSolution(){

    // draw the path that solves the maze

    if(iShowSolution == true){

    for(let i=0; i<nRows-1; i++){ //each row
        for (let j=0; j<nCols-1; j++) { // across the columns
           if (cell[i][j].inSol == true){
              fill(0,0,255);
              noStroke();
              ellipse(cell[i][j].xCntr,cell[i][j].yCntr,0.5*size,0.5*size);
           }                      
        }   
    }
    fill(255,0,0);
    noStroke();
    ellipse(cell[iSol][jSol].xCntr,cell[iSol][jSol].yCntr,0.6*size,0.6*size);
}

    // this would show the blocked out cells during the solution if you're interested
/*
   for(let i=0; i<nRows-1; i++){ //each row
        for (let j=0; j<nCols-1; j++) { // across the columns
           if (cell[i][j].isSealed == true){
              fill(0);
              noStroke();
              ellipse(cell[i][j].xCntr+5,cell[i][j].yCntr+5,10,10);
           }                      
        }   
    }
*/


    // end of function drawSolution
}



function keyPressed()  {
     if ((keyCode === UP_ARROW) && (iYou != 0)) {iStepUp = true;}
     if (keyCode === DOWN_ARROW) {iStepDwn = true;}
     if (keyCode === RIGHT_ARROW) {iStepRgt = true;}
     if (keyCode === LEFT_ARROW) {iStepLft = true;}

     if (key === '9') {iYou=0; jYou=inDoor;}// return to starting position   
}

function keyReleased()  {
     if (keyCode === UP_ARROW) {iStepUp = false;}
     if (keyCode === DOWN_ARROW) {iStepDwn = false;}
     if (keyCode === RIGHT_ARROW) {iStepRgt = false;}
     if (keyCode === LEFT_ARROW) {iStepRgt = false;}
}

function keyTyped()  {
    if (key === '1') 
    {iBuildMaze = true;}
    
    if (key === '2') 
    {iSolveMaze = true;}

    if (key === '3') 
    {iSaveMaze = true;}

    if (key === '6')
    {iFindSolution = true;}

    if (key === '7')
    {iShowSolution = true; iHideSolution = false;}

    if (key === '8')
    {iHideSolution = true; iShowSolution = false;}

    if (key === 'a')
    {iStepLft = true;}
    
    if (key === 'd')
    {iStepRgt = true;}
    
    if (key === 'w' && (iYou != 0))
    {iStepUp = true;}
    
    if (key === 's')
    {iStepDwn = true;}

    if (key === '9') {iYou=1; jYou=inDoor;}// return to starting position 

    return false;
}

function mousePressed() {
    mPressed = true;

    onBtnRefresh = refreshButton.buttonCheck();
    if(onBtnRefresh == true)
    {mReleased = true;}
    
    onBtnSave = saveButton.buttonCheck();
    if(onBtnSave == true)
    {iSaveMaze = true;}

    onBtnSolve = solveButton.buttonCheck();
    if(onBtnSolve == true)
    {iSolveMaze = true;
    }
    
    if(uPButton.buttonCheck() == true && (iYou != 0)){iStepUp = true; mPressed = false;}
    if(dNButton.buttonCheck() == true){iStepDwn = true; mPressed = false;}
    if(leftButton.buttonCheck() == true){iStepLft = true; mPressed = false;}
    if(rightButton.buttonCheck() == true){iStepRgt = true; mPressed = false;}
}


//****************************************************************************
//****************************************************************************

class Cell {
  constructor(x1,y1,x2,y2,x3,y3,x4,y4,wall1,wall2,wall3,wall4,inM,swall1,swall2,swall3,swall4,isSealed,inSol) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
    this.x3 = x3; this.y3 = y3;
    this.x4 = x4; this.y4 = y4;
  
    this.wall1 = wall1;
    this.wall2 = wall2;
    this.wall3 = wall3;
    this.wall4 = wall4;
    this.swall1 = swall1;
    this.swall2 = swall2;
    this.swall3 = swall3;
    this.swall4 = swall4;

    this.inM = inM;
    this.inSol = inSol;
    this.isSealed = isSealed;   
    let xCc,yCc;

// compute the geometric center of the deformed cell 
    let xUL=this.x1;
    let yUL=this.y1;
    let xUR=this.x2; 
    let yUR=this.y2;
    let xLR=this.x3; 
    let yLR=this.y3;
    let xLL=this.x4;
    let yLL=this.y4;
    let a1 = (yUL-yLR)/(xUL-xLR);
    let b1 = yUL-a1*xUL;
    let a2 = (yLL-yUR)/(xLL-xUR);
    let b2 = yLL-a2*xLL;
    this.xCc = (b2-b1)/(a1-a2);
    this.yCc = a1*this.xCc + b1;
    this.xCntr = this.xCc;
    this.yCntr = this.yCc;
  }

  // method for drawing the cell walls
  displayCell() {

    stroke(0);
    strokeWeight(5); 
    if(nRows > 20){strokeWeight(3);}
    if(nRows > 40){strokeWeight(1);}

        if(this.wall1 == true){line(this.x1,this.y1,this.x2,this.y2);}
        if(this.wall2 == true){line(this.x2,this.y2,this.x3,this.y3);}
        if(this.wall3 == true){line(this.x3,this.y3,this.x4,this.y4);}
        if(this.wall4 == true){line(this.x4,this.y4,this.x1,this.y1);}
  }

  drawBoarder() {
    fill(0,0,0);noStroke();
    beginShape();
    vertex(this.x1,this.y1);
    vertex(this.x2,this.y2);
    vertex(this.x3,this.y3);
    vertex(this.x4,this.y4);
    endShape(CLOSE);
  }

  drawDoor(){
    stroke(255);
    fill(255,255,255);
 //   noStroke();
    beginShape();
    vertex(this.x1,this.y1);
    vertex(this.x2,this.y2);
    vertex(this.x3,this.y3);
    vertex(this.x4,this.y4);
    endShape(CLOSE);
  }

}

//**********************************************************

class Path {
    constructor(cx, cy, inP, dotS){
        this.xCntr = cx;
        this.yCntr = cy;
        this.inPath = inP;
        this.dotSize = dotS;
    }

    markCell() {
        fill(255,0,0);
        noStroke();
        if(this.inPath == true)
        {ellipse(this.xCntr,this.yCntr,0.5*this.dotSize,0.5*this.dotSize);}
    }

}

//**********************************************************

class Arrow {
  constructor(xEnd, yEnd, wLine){
    this.xEnd = xEnd;
    this.yEnd = yEnd;
    this.wLine = wLine;
  }

  displayArrow() {

    fill(0,0,0);
    stroke(0); strokeWeight(this.wLine);
    line(this.xEnd,this.yEnd,this.xEnd,this.yEnd+20);

    this.p2x=this.xEnd-2*this.wLine; this.p2y=this.yEnd+15;
    this.p3x=this.xEnd+2*this.wLine; this.p3y=this.yEnd+15;


    triangle(this.xEnd,this.yEnd+20,this.p2x,this.p2y,this.p3x,this.p3y);
  }
}

//**********************************************************


class  Button{
    constructor(bx,by,bw,bh,c1,c2,c3,mOnBut,nam){
    this.bw = bw;
    this.bh = bh;
    this.xpos = bx;   
    this.ypos = by;
    this.rCol = c1;
    this.gCol = c2;
    this.bCol = c3;
    this.mOnBut = mOnBut;
    this.nam = nam; 
}

 buttonCheck(){
    if((mouseX>this.xpos) && (mouseX<this.xpos+this.bw) && (mouseY>this.ypos) && (mouseY<this.ypos+this.bh))
        {this.mOnBut = true;}
    else {this.mOnBut = false;}
    return (this.mOnBut);
 }

 buttonDraw(){
    noStroke(); fill(this.rCol,this.gCol,this.bCol);
    rect(this.xpos,this.ypos,this.bw,this.bh,15);

    fill(0);textSize(13); 
    text(this.nam, this.xpos + (.01*this.bw), this.ypos + (.75*this.bh));
 }

}

//*****************************************
 class ScrollBar {
  constructor(xp, yp, sw, sh, l){
    this.swidth = sw;
    this.sheight = sh;
    this.widthtoheight = sw - sh;
    this.ratio = sw / this.widthtoheight;

    this.xpos = xp;   
    this.ypos = yp;
//    this.spos = this.xpos + this.swidth/2 - this.sheight/2;  // use this line  to initially center the slider in the slider bar
    this.spos = this.xpos;  // use this line to initially position the slider at the left edge of the slider bar
    this.newspos = this.spos;
    this.sposMin = this.xpos;
    this.sposMax = this.xpos + this.swidth - this.sheight;
    this.loose = l;
    this.over;
    this.locked;
    this.loose;
  }

  sbUpdate() {
    if (mouseX > this.xpos && mouseX < this.xpos+this.swidth &&
       mouseY > this.ypos && mouseY < this.ypos+this.sheight) 
    {this.over = true;} 
    else {this.over = false;}

    if (mouseIsPressed && this.over) {
      this.locked = true; 
    }
    if (!mouseIsPressed) {
      this.locked = false; 
    }
    if (this.locked) {
      this.newspos = min(max((mouseX-(this.sheight/2)),this.sposMin),this.sposMax);
    }
    if (abs(this.newspos - this.spos) > 1) {
      this.spos = this.spos + (this.newspos-this.spos)/this.loose;
    }
  }

  sbDisplay() {
    noStroke();
    fill(239);
    rect(this.xpos, this.ypos, this.swidth, this.sheight);
    if (this.over || this.locked) {
      fill(0, 0, 0);
    } else {
      fill(102, 102, 102);
    }
    rect(this.spos, this.ypos, this.sheight, this.sheight);
  }

  getPos() {

    // Convert spos to be values between
    // 0 and the total width of the scrollbar
    return this.spos*this.ratio;
  }
}
