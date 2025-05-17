/* 

revised as of 10/16/24

updated for website
 - added letter-key operation for keyboard
 - added buttons for mouse or touch
 - changed entry exit cells
 - added solution 

 BE CAREFUL WITH X AND Y COORDINATES
 X - HORIZONTAL LEFT TO RIGHT (j)
 Y - VERTICAL TOP TO BOTTOM (i)
 
*/



//  Variables etc....

let cell = [];
let pathCellIndx = [];
let cPi = [];let cPj=[];
let xCor=[];let yCor=[];
let xCntr=[]; let yCntr=[];
let pCelli=[]; pCellj=[]; 


let nCols,nRows,nColsInit;
let nColsMin,nColsMax,nRowsMin,nRowsMax;
let loc;
let base, hite;
let iRandom, iMove;
let cCi, cCj; // shorthand for currentCell i and j index
let pCi, pCj; // shorthand for perviousCell i and j index
let cPindex; // counter for current cell path
let numInactiveCells;
let pntUp; //point up - true, point down - false
let inActiveCellsLeft, rollDice;
let iOpt;
let inDoor, outDoor;
    
let originX, originY;
let xLeftUpCornerMaze, yLeftUpCornerMaze;
let jTopIn,jBottomOut;
let lineWidth;
let xp1,xp2,xp3,xp4,yp1,yp2,yp3,yp4;


let iDrawMaze,iBuildMaze,iSolveMaze,iDrawPath,iSaveMaze;
let iFindSolution,iSolution,iShowSolution,iHideSolution,iSolved;
let iSolStart,jSolStart,iStepped,iStopSolution;
let solStepCnt, dFacing, dFacingEntered;
let isSealed;
let iDrawSolution;
let lCstat,rCstat,uCstat,dCstat;
let nOpenC, nPathC, nWallC;
let dice;
let mReleased;

    
 // stuff for the buttons
let refreshX, refreshY, refreshBoxh, refreshBoxw;
let reSaveX, reSaveY, reSaveBoxh, reSaveBoxw;
let onBtnRefresh,onBtnSave,onBtnSolve;
let mPressed;
let logic1,logi2,logic3;
let arrowL;
    
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
//  let c = createCanvas(650,650);
  background(255);
  dotColor = color(255,0,0);
  visitedDotColor = color(255,255,0);
  
  originX = .05*width; originY = .1*height;
  xLeftUpCornerMaze = originX; yLeftUpCornerMaze = originY;

    ss1 = "MAZE COMPLEXITY";  ss2 = "SIMPLE";  ss3 = "COMPLEX";

// declare slider and buttons objects
    sizeBar = new ScrollBar(700,565,150,35,1);
    refreshButton = new Button(720, 505, 130, 50, 255, 255, 0,false,'    NEW MAZE ');
    solveButton = new Button( 720.,130.,130.,50., 0, 200,0, false,'   SOLVE MAZE ');
    saveButton = new Button(720, 40, 130, 50, 255, 204, 255, false,'   SAVE MAZE');

    uPButton = new Button(750., 200., 75., 75., 153, 204, 255,false, '   Up(w)');
    dNButton = new Button(750.,360.,75., 75., 153, 204, 255,false, '   Down(s)');
    leftButton = new Button(675, 280, 75, 75, 153, 204, 255,false, '   Left(a)');
    rightButton = new Button(825, 280, 75, 75, 153, 204, 255,false, '   Right(d)');

  nColsMin = 17; nColsMax = 111;  // always need to be odd numbers

  iBuildMaze = true; iDrawMaze = true; iSolveMaze = false; 
  iDrawPath = false; iSaveMaze = false;
  iFindSolution = false; iDrawSolution = false; iHideSolution =  true;
  iShowSolution = false;
  iSolved = false;

  iStepUp=false; iStepDwn=false; iStepRgt=false; iStepLft=false;

}  
// end of function setup 

//*****************************************************

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
      {iBuildMaze = true; mReleased = false; }

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
        iFindSolution = false;}       

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

    // end of function draw       
}
//*****************************************************
  
function buildMaze () {
  background(255);

  iBuildMaze = true; iDrawMaze = true; iSolveMaze = false; 
  iDrawPath = false; iSaveMaze = false;
  iFindSolution = false; iDrawSolution = false; iHideSolution =  true;
  iShowSolution = false;
  iSolved = false;

    facSize=(sizeBar.getPos()-913)/150;

    nColsMin = 23;

    nCols = int(float(nColsMin) + facSize*float(nColsMax-nColsMin));
    nCols = (int(nCols/2))*2+1; // make sure this is an odd number
    nRows=int((nCols/1.7)/2)*2; // make sure this is an even number

// console.log(facSize,nCols);

    base = .95*height/nRows;
    hite = .866*base;
    
    // Set locations of entrance and exit

    jTopIn = int(random(2,nCols-2));
    if (jTopIn % 2 !== 0) {jTopIn = jTopIn +1;}
    jBottomOut = int(random(2,nCols-2));
     if (jBottomOut % 2 !== 0) {jBottomOut = jBottomOut +1;}   

 //   youSize = 11.5 - .1*nCols;
 //   if (youSize < 3){youSize=3};

    dotSize = 0.5*base;

    // define the cell objects
    for(let i=0; i<nRows; i++){ 
        cell[i]=[];//each row starting at top row
        for (let j=0; j<nCols; j++) { // across the columns
            if((i % 2)==0 && (j % 2)==0){pntUp = true;}
            if((i % 2)==0 && (j % 2)!=0){pntUp = false;}
            if((i % 2)!=0 && (j % 2)!=0){pntUp = true;}
            if((i % 2)!=0 && (j % 2)==0){pntUp = false;}
                let g1 = float(originX+(j*(base/2.)));
                let g2 = float(originY+i*hite);

           cell[i][j] = new Cell(g1,g2,base,pntUp,true,true,true,false,false,false,
            false,false,false);            
        }
    }

// cell markers for solution 
  for (let i = 0; i < nRows; i++) {
      pathCellIndx[i]=[];
    for (let j = 0; j < nCols; j++) {
      pathCellIndx[i][j] = new Path(cell[i][j].xCntr,cell[i][j].yCntr,false,dotSize);
    }
  }
    
    for(let i=0; i<nRows; i++){ //each row
        for (let j=0; j<nCols; j++) { // across the columns
            // block out all edge triangles and make them inactive i.e. can't be eliminated when opening the maze
            if(i==0 ||i==nRows-1 || j==0 || j==nCols-1)
            {cell[i][j].drawBoarder(); cell[i][j].inM = true;}
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
        
        
        if(cell[cCi][cCj].pntUp) { // cell points up
            
            if(!cell[cCi][cCj-1].inM||!cell[cCi+1][cCj].inM||!cell[cCi][cCj+1].inM)
            {rollDice=true;}
            
            else { // no inactive cells available for a move
                cCi=cPi[cPindex-1];
                cCj=cPj[cPindex-1];
                cPindex=cPindex-1;
            }
            
            while(rollDice) { // roll the dice to find a door to open
                iMove=int(random(1.,4.));
                
                if(iMove == 1 && !cell[cCi+1][cCj].inM) { // cell up and left - wall 1
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall1 = false;  // current cell
                    cell[cCi+1][cCj].wall1 = false; // neighboor and next cell
                    cCi=cCi+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 2 && !cell[cCi][cCj+1].inM) {  // cell above - wall 2
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall2 = false;  // current cell
                    cell[cCi][cCj+1].wall3 = false; // neighboor and next cell
                    cCj=cCj+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 3 && !cell[cCi][cCj-1].inM) { // cell up and right - wall 3
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall3 = false;  // current cell
                    cell[cCi][cCj-1].wall2 = false; // neighboor and next cell
                    cCj=cCj-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
            } // end of rollDice while loop
        } // end of point up cell segment
        
        if(!cell[cCi][cCj].pntUp && numInactiveCells >0) { // cell points down
            
            if(!cell[cCi][cCj-1].inM||!cell[cCi-1][cCj].inM||!cell[cCi][cCj+1].inM)
            {rollDice=true;}
            
            else { // no inactive cells available for a move
                cCi=cPi[cPindex-1];
                cCj=cPj[cPindex-1];
                cPindex=cPindex-1;
            }
            
            while(rollDice) { // roll the dice to find a door to open
                
                iMove=int(random(1.,4.));
                
                if(iMove == 1 && !cell[cCi-1][cCj].inM) { // cell up and left - wall 1
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall1 = false;  // current cell
                    cell[cCi-1][cCj].wall1 = false; // neighboor and next cell
                    cCi=cCi-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 2 && !cell[cCi][cCj+1].inM) {  // cell above - wall 2
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall2 = false;  // current cell
                    cell[cCi][cCj+1].wall3 = false; // neighboor and next cell
                    cCj=cCj+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 3 && !cell[cCi][cCj-1].inM) { // cell up and right - wall 3
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall3 = false;  // current cell
                    cell[cCi][cCj-1].wall2 = false; // neighboor and next cell
                    cCj=cCj-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
            } // end of rollDice while loop
        }

    }    // end wall breakout process - the maze is complete
    
    iBuildMaze = false;
    iSolveMaze = false;
    iDrawMaze = true;
    
    iYou=0; jYou=jTopIn; // set your starting position
    iSolStart = iYou; jSolStart = jYou; //Solution starts at your starting point 
// remove the walls on the door cells

    cell[0][jTopIn].wall1 = false;
    cell[1][jTopIn].wall1 = false;
    cell[nRows-1][jBottomOut].wall1 = false;
    cell[nRows-2][jBottomOut].wall1 = false;   

    // position door arrows

        //   originX = .05*width; originY = .1*height;  (horizontal)
        //   xLeftUpCornerMaze = originX; yLeftUpCornerMaze = originY; (vertical)  

    let xTopDoor = int(cell[0][jTopIn].xCntr); 
    let yTopDoor = int(originY - 30);

    let xBottomDoor = int(cell[0][jBottomOut].xCntr);
    let yBottomDoor = int(originY + hite*(nRows-1));

    arrowIn = new Arrow(xTopDoor,yTopDoor,3);
    arrowOut = new Arrow(xBottomDoor,yBottomDoor+hite/2,3); 

  // end of function buildMaze  

}

//-----------------------------------------------------------------------------

function solveMaze(){
    // build a path to move through the maze
    
        
        // try to move up in an down pointing cell - check to see if there is a wall
        if(iStepUp == true && cell[iYou][jYou].pntUp == false)
        {if (cell[iYou][jYou].wall1 == true)
        {iStepUp=false;}
        else{iYou=iYou-1; pathCellIndx[iYou][jYou].inPath=true; iStepUp = false;}
        }
        // try to move up in an up pointing cell - Nope
        if(iStepUp == true && cell[iYou][jYou].pntUp == true)
        {iStepUp=false;}
        
        // try to move down in an up pointing cell - check to see if there is a wall
        if(iStepDwn == true && cell[iYou][jYou].pntUp == true)
        {if (cell[iYou][jYou].wall1 == true )
        {iStepDwn=false;}
        else{iYou=iYou+1; pathCellIndx[iYou][jYou].inPath=true; iStepDwn = false;}
        }
        // try to move down in an down pointing cell - Nope
        if(iStepDwn == true && cell[iYou][jYou].pntUp == false)
        {iStepDwn=false;}

        // try to move right in either type of cell - check to see if there is a wall
        if(iStepRgt == true)
        {if (cell[iYou][jYou].wall2 == true)
        {iStepRgt=false;}
        else{jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStepRgt = false;}
        }

        // try to move left in either type cell - check to see if there is a wall
        if(iStepLft == true)
        {if (cell[iYou][jYou].wall3 == true)
        {iStepLft=false;}
        else{jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStepLft = false;}
        }

    // end of function solveMaze
}   

//--------------------------------------------------------------
function drawMaze(){
    // draw the completed maze
    
    fill(255,255,255); noStroke();
    rect(0,0.,.725*width,height);
    
    if(nCols > 50){lineWidth = 1;}
        else{lineWidth=2;}
    
    for(let i=1; i<nRows-1; i++){ //each row
        for (let j=1; j<nCols-1; j++) { // across the columns
            cell[i][j].displayCell(lineWidth);
        }
    }
    // left border
    for(let i=0; i<nRows-1; i++){
     cell[i][0].drawBoarder();}

     // right boarder
    for(let i=1; i<nRows; i++){
     cell[i][nCols-1].drawBoarder();}

     // top boarder
     for(let j=2; j< nCols; j=j+2){
        cell[0][j].drawBoarder();}
 
     // bottom boarder
     for(let j=0; j<= nCols-3; j=j+2){
        cell[nRows-1][j].drawBoarder();}
  
    // position the entrance and exit doors

    fill(255,255,255);rectMode(CENTER); noStroke();
    rect(cell[0][jTopIn].xCntr+2,cell[0][jTopIn].yCntr,base+2,hite+6);
    rect(cell[nRows-1][jBottomOut].xCntr-2,cell[nRows-1][jBottomOut].yCntr,base+2,hite+6);
    rectMode(CORNER);
 
    // add arrows:
    arrowIn.displayArrow();
    arrowOut.displayArrow();

    iDrawMaze=true;
   
    // end of function drawMaze
}


//--------------------------------------------------------------
function drawPath(){
    // draw the path through the maze
    
    
    // mark you staring point in the maze
    pathCellIndx[0][jTopIn].inPath=true;
    fill(0,200,0);
    noStroke();
    ellipse(pathCellIndx[0][jTopIn].xCntr,pathCellIndx[0][jTopIn].yCntr,0.7*dotSize,0.7*dotSize);
    
    // mark all cells visited so far!
    for(let i=1; i<nRows-1; i++){ //each row
        for (let j=1; j<nCols-1; j++) { // across the columns
            pathCellIndx[i][j].markCell();
        }
    }
    
    // display your current position in the maze
    fill(0,0,255);

    if(iYou == nRows-1 && jYou == jBottomOut){
        fill(0, 0, 255);
        ellipse(pathCellIndx[iYou][jYou].xCntr, pathCellIndx[iYou][jYou].yCntr,0.7*dotSize,0.6*dotSize); }
   else{
    fill(0,200,0);   
    ellipse(pathCellIndx[iYou][jYou].xCntr, pathCellIndx[iYou][jYou].yCntr,0.6*dotSize,0.6*dotSize); }
  
    // end of function drawPath
}

//--------------------------------------------------------------


function findSolution(){
    // define all walls in the initial maze as the starting configuration for the solution maze

    for(let i=0; i<= nRows-1; i++){ //each row
        for (let j=0; j<= nCols-1; j++) { // across the columns
            cell[i][j].swall1 = cell[i][j].wall1;
            cell[i][j].swall2 = cell[i][j].wall2;
            cell[i][j].swall3 = cell[i][j].wall3;                        
        }   
    }

    // goal is move through the maze and add walls to seal off dead ends

    // find the path that solves the maze 
    iSol = 1; jSol = jSolStart; // start in the maze directly below the entry cell on the top boarder

    // staring cell is always an up pointing cell
    cell[0][jSolStart].inSol = true;  // entry cell is always in the solution path 
    cell[0][jSolStart].swall1 = false; // can't move up into the point up entry cell
    cell[0][jSolStart].isSealed = false; 
    cell[1][jSolStart].swall1 = false; // top wall of the point down cell below starting cell
    cell[1][jSolStart].inSol = true;  //cell below starting cell is always in the solution
    cell[1][jSolStart].isSealed = false; // cell below the starting cell can't be sealed 

    solStepCnt = 0; 
    iStopSolution = false;

// Start a exhaustive search through maze and "seal" dead-end cells as you go

 //   starting from the cell below entrance - using the status of the cells around you
 //   decide which way to move.
 //   the up, down, left and right wall designation is relative to the point you are
 //   in the "maze" - not a direction you are facing/moving.

while(iStopSolution == false) {

// ****************
// NEXT SECTION - IN A UP POINTING CELL 
// *****************

    if(cell[iSol][jSol].pntUp == true){ // currently in an pointUp cell 

//  determine status of neighbor cells of the current pointUp cell
//   Cstat values: 0 - open, 1 - wall, 2 - open and inPath

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
    if(cell[iSol][jSol+1].swall3 == true){rCstat = 1;}
    if((cell[iSol][jSol+1].inSol == true) && (cell[iSol][jSol+1].swall3 == false)) {rCstat = 2;}

      // end of determine status of pointUp cell 

    iStepped = false;  //only 1 step per cycle through while loop is allowed

// determine how many walls surround you
    nWallC = 0;
    if(dCstat == 1){nWallC = nWallC +1;}
    if(lCstat == 1){nWallC = nWallC +1;}
    if(rCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(dCstat == 0){nOpenC = nOpenC +1;}
    if(lCstat == 0){nOpenC = nOpenC +1;}
    if(rCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (but inPath) cells surround you
    nPathC = 0;
    if(dCstat == 2){nPathC = nPathC +1;}
    if(lCstat == 2){nPathC = nPathC +1;}
    if(rCstat == 2){nPathC = nPathC +1;} 

    if(nWallC == 2){ // you are in a dead-end cell (2 walls) - find the one open wall

        if(iStepped == false && (dCstat == 0 || dCstat == 2)) // move down into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall1=true;
          iSol = iSol+1; jSol = jSol;  // move down
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (lCstat == 0 || lCstat == 2)) // move left into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall3=true;
          iSol = iSol; jSol = jSol-1;  // move left
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (rCstat == 0 || rCstat == 2)) // move right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall2=true;
          iSol = iSol; jSol = jSol+1;  // move right
          iStepped = true; solStepCnt = solStepCnt +1;
          }
        
    }


    if(nOpenC => 1 && iStepped == false){ // find an open (not-yet-in-solutiom) cell to move into

        if(dCstat == 0) // move down into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol;
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

        dice=int(random(0.,2.99));

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (dCstat == 2))// move down into an open cell (already in solution)
            {cell[iSol][jSol].inSol = true;
            iSol = iSol+1; jSol = jSol;
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 1:
            if((iStepped == false) && (lCstat == 2)) // move left into an open cell (already in solution)
            {cell[iSol][jSol].inSol = true;
            iSol = iSol; jSol = jSol-1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 2:
            if((iStepped == false) && (rCstat == 2)) // move right into an open cell (already in solution)
            {cell[iSol][jSol].inSol = true; 
            iSol = iSol; jSol = jSol+ 1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;
        }
    }
}

// ****************
// NEXT SECTION - IN A DOWN POINTING CELL
// *****************

if(cell[iSol][jSol].pntUp == false){ // currently in an point down cell     

//  determine status of neighbor cells of the current point down cell
//   Cstat values: 0 - open, 1 - wall, 2 - open and inPath

    // up Cell
    uCstat = 0; // assume up Cell is open unless
    if(cell[iSol-1][jSol].swall1 == true){uCstat = 1;}
    if((cell[iSol-1][jSol].inSol == true) && (cell[iSol-1][jSol].swall1 == false)){uCstat = 2;}
    // left Cell
    lCstat = 0; // assume left Cell is open unless
    if(cell[iSol][jSol-1].swall2 == true){lCstat = 1;}
    if((cell[iSol][jSol-1].inSol == true) && (cell[iSol][jSol-1].swall2 == false)) {lCstat = 2;}
    // right Cell
    rCstat = 0; // assume right Cell is open unless
    if(cell[iSol][jSol+1].swall3 == true){rCstat = 1;}
    if((cell[iSol][jSol+1].inSol == true) && (cell[iSol][jSol+1].swall3 == false)) {rCstat = 2;}

    // end of determine status of point DOWN cell 

    iStepped = false;  //only 1 step per cycle through while loop is allowed

// determine how many walls surround you
    nWallC = 0;
    if(uCstat == 1){nWallC = nWallC +1;}
    if(lCstat == 1){nWallC = nWallC +1;}
    if(rCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(uCstat == 0){nOpenC = nOpenC +1;}
    if(lCstat == 0){nOpenC = nOpenC +1;}
    if(rCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (but inPath) cells surround you
    nPathC = 0;
    if(uCstat == 2){nPathC = nPathC +1;}
    if(lCstat == 2){nPathC = nPathC +1;}
    if(rCstat == 2){nPathC = nPathC +1;} 

    if(nWallC == 2){ // you are in a dead-end cell (2 walls) - find the one open wall       

        if(iStepped == false && (uCstat == 0 || uCstat == 2)) // move up into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall1=true;
          iSol = iSol-1; jSol = jSol;  // move up
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (lCstat == 0 || lCstat == 2)) // move left into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall3=true;
          iSol = iSol; jSol = jSol-1;  // move left
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (rCstat == 0 || rCstat == 2)) // move right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall2=true;
          iSol = iSol; jSol = jSol+1;  // move right
          iStepped = true; solStepCnt = solStepCnt +1;
          }
    }


    if(nOpenC => 1 && iStepped == false){ // find an open (not-yet-in-solutiom) cell to move into

        if(uCstat == 0) // move up into an open cell
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

        dice=int(random(0.,2.99));

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (uCstat == 2))// move up into an open cell (already in solution)
            {cell[iSol][jSol].inSol = true;
            iSol = iSol-1; jSol = jSol;
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 1:
            if((iStepped == false) && (lCstat == 2)) // move left into an open cell (already in solution)
            { cell[iSol][jSol].inSol = true;
            iSol = iSol; jSol = jSol-1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 2:
            if((iStepped == false) && (rCstat == 2)) // move right into an open cell (already in solution)
            {cell[iSol][jSol].inSol = true;
            iSol = iSol; jSol = jSol+ 1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;
        }

    }

}
   // staring cell is always an up pointing cell
    cell[0][jSolStart].inSol = true;  // entry cell is always in the solution path 
    cell[0][jSolStart].swall1 = false; // can't move up into the point up entry cell
    cell[0][jSolStart].isSealed = false; 
    cell[1][jSolStart].swall1 = false; // top wall of the point down cell below starting cell
    cell[1][jSolStart].inSol = true;  //cell below starting cell is always in the solution
    cell[1][jSolStart].isSealed = false; // cell below the starting cell can't be sealed  


    if((iSol == nRows-2 && jSol == jBottomOut) || (solStepCnt > 50000)) {iStopSolution = true;}

} // end of solution search while

    iFindSolution =  false;

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
              ellipse(cell[i][j].xCntr,cell[i][j].yCntr,.3*base,.3*base);
           }                      
        }   
    }
    fill(0,255,0);
    noStroke();
    ellipse(cell[nRows-1][jBottomOut].xCntr,cell[nRows-1][jBottomOut].yCntr,.4*base,.4*base);
}

/*
 // this would show the blocked out cells during the solution if you're interested

  for(let i=0; i<nRows-1; i++){ //each row
        for (let j=0; j<nCols-1; j++) { // across the columns
           if (cell[i][j].isSealed == true){
              fill(255,0,0);
              noStroke();
              ellipse(cell[i][j].xCntr,cell[i][j].yCntr,0.2*base,0.2*base);
           }                      
        }   
    }
*/ 

    // end of function drawSolution
}



//--------------------------------------------------------------

function keyPressed()  {
     if ((keyCode === UP_ARROW) && (iYou != 0)) {iStepUp = true;}
     if (keyCode === DOWN_ARROW) {iStepDwn = true;}
     if (keyCode === RIGHT_ARROW) {iStepRgt = true;}
     if (keyCode === LEFT_ARROW) {iStepLft = true;}

     if (key === '9') {iYou=0; jYou=jTopIn;}// return to starting position
 }
//------------------------------------------------------------------

function keyReleased()  {
     if (keyCode === UP_ARROW) {iStepUp = false;}
     if (keyCode === DOWN_ARROW) {iStepDwn = false;}
     if (keyCode === RIGHT_ARROW) {iStepRgt = false;}
     if (keyCode === LEFT_ARROW) {iStepRgt = false;}
}

//****************************************************************************

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

     if (key === '9') {iYou=1; jYou=jTopIn;}// return to starting position   
}

function mouseReleased() {

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

    return false;
}

// *********************************************************************
// *********************************************************************


class Cell {
  constructor(xCntr, yCntr, s, pntUp, wall1, wall2, wall3, inM, swall1,swall2,swall3,isSealed,inSol) 
  {
    this.xCntr = xCntr;
    this.yCntr = yCntr;
    this.s = s;
    this.pntUp = pntUp;
    this.wall1 = wall1;
    this.wall2 = wall2;
    this.wall3 = wall3;
    this.swall1 = swall1;
    this.swall2 = swall2;
    this.swall3 = swall3;

    this.inM = inM;
    this.inSol = inSol;
    this.isSealed = isSealed;

    this.fac = .433*this.s;

    this.x1 = this.xCntr - this.s/2; 
    this.x2 = this.xCntr + this.s/2; 
    this.x3 = this.xCntr;
        if(pntUp) { 
          this.y1 = this.yCntr + this.fac; 
          this.y2 = this.y1; 
          this.y3 = this.yCntr - this.fac;}
        else {
            this.y1 = this.yCntr - this.fac; 
            this.y2 = this.y1; 
            this.y3 = this.yCntr + this.fac;}

  }

  // method for drawing the cell walls
  displayCell() {
    stroke(0);
    strokeWeight(5); 
    if(nRows > 20){strokeWeight(3);}
    if(nRows > 40){strokeWeight(1);}

    if(this.wall1 == true){line(this.x1,this.y1,this.x2,this.y2);}
    if(this.wall2 == true){line(this.x2,this.y2,this.x3,this.y3);}
    if(this.wall3 == true){line(this.x3,this.y3,this.x1,this.y1);} 
  }

  drawBoarder() {
    fill(0,0,0);
    triangle(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3);
  }

  drawDoor(){
    noStroke();
    fill(255,255,255);
    rect(this.xCntr-(this.s/2)+2,this.yCntr-(this.s/2)-5,this.s-4,this.s+9);   
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
        {ellipse(this.xCntr,this.yCntr,0.6*this.dotSize,0.6*this.dotSize);}
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
 //   console.log(this.mOnBut);
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
