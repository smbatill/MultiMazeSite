/* 

revised as of 10/26/24

updated for website
 - added letter-key operation for keyboard
 - added buttons for mouse or touch
 - added solution 

*/


//  Variables etc....
let cell = [];
let cPi = []; let cPj = []; // shorthand for the array of cell indecies on the current cell path (needed to go "backwards")
let walls = []; let gap = [];       
let xCntr = []; yCntr = [];
let pathCellIndx = [];

    // stuff for building the maze
let originX, originY;
let xLeftUpCornerMaze, yLeftUpCornerMaze;
let jTopIn, jBotOut;
let nColsMin, nColsMax;
    
let nCols,nRows;
let loc;
let side,spacer;
let iRandom, iMove;
let cCi, cCj; // shorthand for currentCell i and j index
let pCi, pCj; // shorthand for perviousCell i and j index
    
let cPindex; // counter for current cell path
let numInactiveCells; // an ininM cell is one that is not yet connected to the maze path
let inActiveCellsLeft, rollDice;
let iOpt;
    
    // stuff for sizing and saving the maze

let iBuildMaze,iDrawMaze, iRefresh, iSaveMaze,iSolve1Maze,iSolve2Maze,iDrawPath;
let refreshX, refreshY, refreshBoxh, refreshBoxw;
let reSaveX, reSaveY, reSaveBoxh, reSaveBoxw;

    // stuff for solving the maze
    
let iStpUpLft, iStpUpRgt, iStpDwnLft, iStpDwnRgt, iStpUp,iStpDwn,iStpLft,iStpRgt;
let iYou,jYou;
let youSize;

let dotColor,mLineW;
let visitedDotColor;
let fac1,fac2,fac3;

    // stuff for finding the solution

let iFindSolution,iSolution,iShowSolution,iHideSolution,iSolved;
let iSolStart,jSolStart,iStepped,iStopSolution;
let solStepCnt;
let iDrawSolution;
let uCstat,urCstat,rCstat,drStat,dCstat,dlCstat,lCstat,ulStat;
let nOpenC, nPathC, nWallC;
let dice;

    
    // stuff for solve buttons
let uPButton,dNButton,rButton,lButton,uPRButton,dNRButton,uPLButton,dNLButton;
    
    // stuff for the refresh buttons
let refreshButton,saveButton,solve1Button,solve2Button;
    
let onBtnRefresh,onBtnSave,onBtnSolve1,onBtnSolve2;
let s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13;
let mPressed, mReleased;
    

// <<<<<<<<<<< end of variables >>>>>>>>>
 
function setup() { 

  // size and center the maze based upon the number of cells
    createCanvas(1024,770);
    background(255);
    
    originX = .075*width; originY = .06*height;
    
    xLeftUpCornerMaze = originX; yLeftUpCornerMaze = originY;
    
    nColsMin = 8; nColsMax = 40; //number of columns must be an even #

    ss1 = "MAZE COMPLEXITY";  ss2 = "SIMPLE";  ss3 = "COMPLEX"; 

 // declare slider and buttons objects

    sizeBar = new ScrollBar(820,565,150,35,1);
    refreshButton = new Button(820, 505, 130, 50, 255, 255, 0,false,'    NEW MAZE ');
    saveButton = new Button(820, 40, 130, 50, 255, 204, 255, false,'   SAVE MAZE'); 
 
    solve1Button = new Button(750.,150.,100.,50., 0, 200,0,false, '  SOLVE EASY'); 
    solve2Button = new Button(900.,150.,100.,50., 0, 200,0,false, ' SOLVE HARD'); 

    uPLButton = new Button(750, 210, 75, 70, 153, 204, 255, false, '  Up Lft(q)');
    lButton = new Button(750., 290., 75., 75., 153, 204, 255, false, '   Left(a)');
    dNLButton = new Button(750, 380, 75, 70, 153, 204, 255, false, ' Dwn Lft(q)');
    uPButton = new Button(840., 240., 75., 75., 153, 204, 255, false, '   Up(w)');
    dNButton = new Button(840.,350.,75., 75., 153, 204, 255,false, '  Down(x)');
    uPRButton = new Button(930, 210, 75, 70, 153, 204, 255, false, '  Up Rgt(e)');
    rButton = new Button(930., 290., 75., 75., 153, 204, 255, false, '   Right(d)');
    dNRButton = new Button(930, 380, 75, 70, 153, 204, 255, false, ' Dwn Rgt(c)');
    
    onBtnRefresh = false; onBtnSave = false; onBtnSolve1=false; onBtnSolve2=false;
    
    iBuildMaze = true; iDrawMaze = false; iSolve1Maze = false; iSolve2Maze = false;
    iDrawPath = false; iSaveMaze = false;
    
    iStpUpLft=false; iStpDwnLft=false; iStpUpRgt=false; iStpDwnRgt=false; iStpUp=false; 
    iStpDwn=false; iStpLft=false; iStpRgt=false;

}  // end of function setup ***********************


function draw () {

    background(255); //refresh the background

    sizeBar.sbDisplay();
    sizeBar.sbUpdate();

    refreshButton.buttonDraw();
    saveButton.buttonDraw();
    solve1Button.buttonDraw();
    solve2Button.buttonDraw();


    uPButton.buttonDraw();
    dNButton.buttonDraw();
    lButton.buttonDraw();
    rButton.buttonDraw();
    uPLButton.buttonDraw();
    dNLButton.buttonDraw();
    uPRButton.buttonDraw();
    dNRButton.buttonDraw();


    if(refreshButton.buttonCheck() == true && mReleased == true) 
      {iBuildMaze = true; mReleased = false;}

    if(solve1Button.buttonCheck() == true && mouseIsPressed == true) 
      {iSolve1Maze = true; iSolve2Maze = false;} 

    if(solve2Button.buttonCheck() == true && mouseIsPressed == true) 
      {iSolve2Maze = true; iSolve1Maze = false;} 

    if(saveButton.buttonCheck() == true && mouseIsPressed == true) 
      {iSaveMaze = true;} 
 
    fill(0);textSize(13); 
    strokeWeight(1);stroke(0);
    fill(0); 
    text(ss1, 830, 635);
    text(ss2, 800, 615);
    text(ss3, 930, 615);

    stroke(0,0,255); strokeWeight(15);
    line(770,110,1005,110);
    line(770,490,1005,490);
    stroke(0);

    
    if(iBuildMaze == true){      
        // set the size of the maze using the slider
        nCols = nColsMin + int(((sizeBar.getPos()-1070)/150)*(nColsMax-nColsMin));
        nRows = nCols;        
        side = .84*height/nRows;
        spacer = side;
        
        buildMaze();
        iBuildMaze = false;

        jTopIn = int(random(2.,nCols-2.));
        jBotOut = int(random(2.,nCols-2.));
        fac1 = originX+jTopIn*spacer;
        fac2 = originX+jBotOut*spacer;
        fac3 = originY+nRows*spacer;;
        arrowTop= new Arrow(0,fac1, .02*height+20, 20, 4);
        arrowBot= new Arrow(1,fac2, fac3+10,20, 4);
        iYou=1; jYou=jTopIn; // start you at the entrance

        findSolution();
        iFindSolution = false;
        iShowSolution = false; // don't show solution until "7" is clicked
    }
    
    if(iDrawMaze == true){
        drawMaze(jTopIn,jBotOut);
        arrowTop.displayArrow();
        arrowBot.displayArrow();
    }

    if(iSolve1Maze == true){
        solve1Maze();
        pathCellIndx[1][jTopIn].inPath=true;
        drawPath();
    }   
   
    if(iShowSolution == true){
        drawSolution();
    } 

    if(iSolve2Maze == true){
        solve2Maze();
        pathCellIndx[1][jTopIn].inPath=true;
        drawPath();
    } 

    if(iSaveMaze == true){
        noStroke();
        fill(255);
        rect(745,0,280,770);
        saveCanvas('aMaze','jpg');
        let count;
        for(let ic=0;ic<100000;ic=ic+.0001) // need a short delay so only 1 copy of the maze is downloaded
          {count=count+ic;}
           iSaveMaze = false;}  
}
// end of function draw() *************************

  
function buildMaze () {

    // initialize all the cell object parameters
    
    for(let i=0; i<=7;i++){walls[i]=true;}

    for(let i=0; i<nRows; i++){ //each row starting at top row
        cell[i]=[];
        for (let j=0; j<nCols; j++) { // across the columns
            cell[i][j]= new Cell(originX+j*side,(originY+side/2)+i*side,side,true,true,true,true,
                true,true,true,true,false,true,true,true,true,true,true,true,true,false,false);
        }
    }

    // initialize all the cell center locations for solution paths
    for(let i=0; i<nRows; i++){ //each row starting at top row
        pathCellIndx[i]=[];
        for (let j=0; j<nCols; j++) { // across the columns
            pathCellIndx[i][j] = new Path(cell[i][j].xCntr,cell[i][j].yCntr,false,nRows);
        }
    }
    
    // block out all edge cells and make them inactive i.e. can't be eliminated when opening the maze
    for(let i=0; i<nRows; i++){ //each row
        for (let j=0; j<nCols; j++) { // across the columns
            if(i==0 ||i==nRows-1 || j==0 || j==nCols-1)
            {cell[i][j].drawBorder(); cell[i][j].inM = true;}
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
      
          // cell[][].inM = true(1) if it has become part of maze (at least one wall gone)
        // gap[] = true(1) if the neighbor cell is available to add to the maze
        
        gap[0]=!cell[cCi][cCj-1].inM;  // cell left of current cell
        gap[1]=!cell[cCi-1][cCj-1].inM; // cell left and above current cell
        gap[2]=!cell[cCi-1][cCj].inM;  // cell above current cell
        gap[3]=!cell[cCi-1][cCj+1].inM;  // cell above and right of current cell
        gap[4]=!cell[cCi][cCj+1].inM;  // cell to the right of the current cell
        gap[5]=!cell[cCi+1][cCj+1].inM; // cell below and to the right of the current cell
        gap[6]=!cell[cCi+1][cCj].inM;  // cell below the current cell
        gap[7]=!cell[cCi+1][cCj-1].inM; // cell below and left of current cell
        
        if(gap[0]||gap[1]||gap[2]||gap[3]||gap[4]||gap[5]||gap[6]||gap[7])
        {   rollDice=true;
            // at least one inactive cell is available for a move
        }
        
        else { // no inactive cells available for a move, so go back along path
            cCi=cPi[cPindex-1];
            cCj=cPj[cPindex-1];
            cPindex=cPindex-1;
        }
        
        while(rollDice) { // roll the dice to find a door to open
            
            iMove=int(random(0.,8.));
            
            if(iMove == 0 && gap[0]) { // cell left - wall 0
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall0 = false;  // current cell
                cell[cCi][cCj-1].wall4 = false; // neighboor and next cell
                cCj = cCj-1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 1 && gap[1]) { // cell above-left - wall 1
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall1 = false;  // current cell
                cell[cCi-1][cCj-1].wall5 = false; // neighboor and next cell
                cCi = cCi-1;;cCj=cCj-1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 2 && gap[2]) { // cell above - wall 2
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall2 = false;  // current cell
                cell[cCi-1][cCj].wall6 = false; // neighboor and next cell
                cCi = cCi-1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 3 && gap[3]) { // cell above-right - wall 3
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall3 = false;  // current cell
                cell[cCi-1][cCj+1].wall7 = false; // neighboor and next cell
                cCi = cCi-1;cCj=cCj+1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 4 && gap[4]) { // cell right - wall 4
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall4 = false;  // current cell
                cell[cCi][cCj+1].wall0 = false; // neighboor and next cell
                cCj=cCj+1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 5 && gap[5]) { // cell below-right - wall 5
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall5 = false;  // current cell
                cell[cCi+1][cCj+1].wall1 = false; // neighboor and next cell
                cCi = cCi+1;cCj=cCj+1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 6 && gap[6]) { // cell below - wall 6
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall6 = false;  // current cell
                cell[cCi+1][cCj].wall2 = false; // neighboor and next cell
                cCi = cCi+1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 7 && gap[7]) { // cell below-left - wall 7
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall7 = false;  // current cell
                cell[cCi+1][cCj-1].wall3 = false; // neighboor and next cell
                cCi = cCi+1;cCj=cCj-1;
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
        }
    }
    
    // end of number of nInactiveCells while loop
    
    iDrawMaze=true;
    iSolve2Maze=false;
    iSolve1Maze=false;

    // end of buildMaze
}

//-----------------------------------------------------------------------------


//   EASY SOLUTION ALGORITHM

function solve1Maze(){  
    // build a path to move through the maze
       // try to move UP LEFT - check to see if there is a wall
        if(iStpUpLft == true && cell[iYou][jYou].wall1 == false){
            iYou=iYou-1; jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpUpLft = false;}
        
        // try to move down DOWN LEFT - check to see if there is a wall
        if(iStpDwnLft == true && cell[iYou][jYou].wall7 == false){
            iYou=iYou+1; jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpDwnLft = false;}
        
        // try to move UP RIGHT - check to see if there is a wall
        if(iStpUpRgt == true && cell[iYou][jYou].wall3 == false){
            iYou=iYou-1; jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpUpRgt = false;}
        
        // try to move down DOWN RIGHT - check to see if there is a wall
        if(iStpDwnRgt == true && cell[iYou][jYou].wall5 == false){
            iYou=iYou+1; jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpDwnRgt = false;}
        
        // try to move UP  - check to see if there is a wall or a path to move up
        if(iStpUp == true && (cell[iYou][jYou].wall2 == false 
            || (cell[iYou][jYou].wall1 == false && cell[iYou-1][jYou].wall7 == false)
            || (cell[iYou][jYou].wall3 == false && cell[iYou-1][jYou].wall5 == false)))
                {iYou=iYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpUp = false;}

        // try to move DOWN  - check to see if there is a wall or a path to move up
        if(iStpDwn == true && (cell[iYou][jYou].wall6 == false 
            || (cell[iYou][jYou].wall7 == false && cell[iYou+1][jYou].wall1 == false)
            || (cell[iYou][jYou].wall5 == false && cell[iYou+1][jYou].wall3 == false)))
                {iYou=iYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpDwn = false;}

        // try to move LEFT  - check to see if there is a wall or a path to move up
        if(iStpLft == true && (cell[iYou][jYou].wall0 == false 
            || (cell[iYou][jYou].wall7 == false && cell[iYou][jYou-1].wall5 == false)
            || (cell[iYou][jYou].wall1 == false && cell[iYou][jYou-1].wall3 == false)))
                {jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpLft = false;}

        // try to move RIGHT  - check to see if there is a wall or a path to move up
        if(iStpRgt == true && (cell[iYou][jYou].wall4 == false 
            || (cell[iYou][jYou].wall3 == false && cell[iYou][jYou+1].wall1 == false)
            || (cell[iYou][jYou].wall5 == false && cell[iYou][jYou+1].wall7 == false)))
                {jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpRgt = false;}


    // clear all incorrect key/button indicators
    iStpRgt=false; iStpLft=false; iStpDwn=false; iStpUp=false; iStpDwnRgt=false;
    iStpUpRgt=false; iStpDwnLft=false; iStpUpLft=false;

    // end of function solveMaze
}   

// DIFFICULT SOLUTION ALGORITHM 

function solve2Maze(){
    // build a path to move through the maze
       // try to move UP LEFT - check to see if there is a wall
        if(iStpUpLft == true && cell[iYou][jYou].wall1 == false){
            iYou=iYou-1; jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpUpLft = false;}
        
        // try to move down DOWN LEFT - check to see if there is a wall
        if(iStpDwnLft == true && cell[iYou][jYou].wall7 == false){
            iYou=iYou+1; jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpDwnLft = false;}
        
        // try to move UP RIGHT - check to see if there is a wall
        if(iStpUpRgt == true && cell[iYou][jYou].wall3 == false){
            iYou=iYou-1; jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpUpRgt = false;}
        
        // try to move down DOWN RIGHT - check to see if there is a wall
        if(iStpDwnRgt == true && cell[iYou][jYou].wall5 == false){
            iYou=iYou+1; jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpDwnRgt = false;}
        
        // try to move UP  - check to see if there is a wall
        if(iStpUp == true && cell[iYou][jYou].wall2 == false){
            iYou=iYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpUp = false;}
        
        // try to move DOWN  - check to see if there is a wall
        if(iStpDwn == true && cell[iYou][jYou].wall6 == false){
            iYou=iYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpDwn = false;}
    
        // try to move LEFT  - check to see if there is a wall
        if(iStpLft == true && cell[iYou][jYou].wall0 == false){
            jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpLft = false;}
    
        // try to move RIGHT  - check to see if there is a wall
        if(iStpRgt == true && cell[iYou][jYou].wall4 == false){
            jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpRgt = false;}

    // clear all incorrect key/button indicators
    iStpRgt=false; iStpLft=false; iStpDwn=false; iStpUp=false; iStpDwnRgt=false;
    iStpUpRgt=false; iStpDwnLft=false; iStpUpLft=false;

    // end of function solveMaze
}   


//--------------------------------------------------------------
function drawMaze(){
// draw the completed maze
    stroke(0);
    strokeWeight(3);
    if(nRows<=20){mLineW=3;}
    if(nRows>20 && nRows <=30){mLineW=2;}
    if(nRows > 30){mLineW = 1;}
    

    for(let i=0; i<nRows; i++){ //each row
        for (let j=0; j<nCols; j++) { // across the columns
            cell[i][j].displayCell(mLineW);
            // block out all edge cells and make them inactive i.e. can't be eliminated when opening the maze
            if(i==0 ||i==nRows-1 || j==0 || j==nCols-1)
            {cell[i][j].drawBorder();}
        }
    }
    
    // add entrance and exit
    fill(255,255,255);
    noStroke();
    let d=side/(1.+2*cos(45));
    rect(cell[0][jTopIn].xCntr-(d/2), cell[0][0].yCntr-side, d, 2*side);
    rect(cell[nRows-1][jBotOut].xCntr-(d/2), cell[nRows-1][0].yCntr-side, d, 3*side);

    // end of function drawMaze
}


//--------------------------------------------------------------
function drawPath(){
    // draw the path through the maze
     
    // mark you staring point in the maze
    pathCellIndx[1][jTopIn].inPath=true;
    
    // mark all cells visited so far!
    for(let i=1; i<nRows-1; i++){ //each row
        for (let j=1; j<nCols-1; j++) { // across the columns
            pathCellIndx[i][j].markCell();
        }
    }
    
    // display your current position in the maze
    fill(34,139,34);
    if(jYou == jBotOut && iYou == nRows-2){fill(0, 0, 255);}
    youSize=side/3;
    if(youSize<2.){youSize = 2.;}
    ellipse(pathCellIndx[iYou][jYou].xCntr, pathCellIndx[iYou][jYou].yCntr,youSize,youSize);

    // end of function drawPath
}

//--------------------------------------------------------------
function findSolution(){
    // define all walls in the initial maze as the starting configuration for the solution maze

    for(let i=0; i<nRows-1; i++){ //each row
        for (let j=0; j<nCols-1; j++) { // across the columns
            cell[i][j].swall0 = cell[i][j].wall0; 
            cell[i][j].swall1 = cell[i][j].wall1;
            cell[i][j].swall2 = cell[i][j].wall2;
            cell[i][j].swall3 = cell[i][j].wall3;
            cell[i][j].swall4 = cell[i][j].wall4;
            cell[i][j].swall5 = cell[i][j].wall5;
            cell[i][j].swall6 = cell[i][j].wall6;
            cell[i][j].swall7 = cell[i][j].wall7;                                  
        }   
    }

    // goal is move through the maze and add walls to seal off dead ends

    // find the path that solves the maze 
    iSol = 1; jSol = jTopIn; // start in the maze directly below the entry cell on the top boarder


    cell[iSol][jSol].inSol = true;  // starting cell is always in the solution path 
    cell[iSol][jSol].swall1 = true; // close the starting cell wall1(top)
    cell[0][jSol].swall6 = true; // close the top boarder  entry cell wall6
    cell[iSol][jTopIn].isSealed = false; // and the starting cell can't be sealed   
    cell[0][jSol].isSealed = true; // seal the top boarder entry cell
    solStepCnt = 0; 
    iStopSolution = false;

// Start a exhaustive search through maze and "seal" dead-end cells as you go



while(iStopSolution == false) {

//

    iStepped = false;

//  determine status of neighbor cells of the current cell
//    Cstat values: 0 - open, 1 - wall, 2 - open and inPath

    // up Cell
    uCstat = 0; // assume up Cell is open unless
    if (iSol == 0){uCstat = 1;}  // you are in the top row 
    else{
        if(cell[iSol-1][jSol].swall6 == true){uCstat = 1;}
        if((cell[iSol-1][jSol].inSol == true) && (cell[iSol-1][jSol].swall6 == false)){uCstat = 2;}
    }   

    // up-left Cell
    ulCstat = 0; // assume up-left Cell is open unless
    if(cell[iSol-1][jSol-1].swall5 == true){ulCstat = 1;}
    if((cell[iSol-1][jSol-1].inSol == true) && (cell[iSol-1][jSol-1].swall5 == false)){ulCstat = 2;}

     // up-right Cell
    urCstat = 0; // assume up-right Cell is open unless
    if(cell[iSol-1][jSol+1].swall7 == true){urCstat = 1;}
    if((cell[iSol-1][jSol+1].inSol == true) && (cell[iSol-1][jSol+1].swall7 == false)){urCstat = 2;}
    
    // left Cell
    lCstat = 0; // assume left Cell is open unless
    if(cell[iSol][jSol-1].swall4 == true){lCstat = 1;}
    if((cell[iSol][jSol-1].inSol == true) && (cell[iSol][jSol-1].swall4 == false)) {lCstat = 2;}
 
    // right Cell
    rCstat = 0; // assume right Cell is open unless
    if(cell[iSol][jSol+1].swall0 == true){rCstat = 1;}
    if((cell[iSol][jSol+1].inSol == true) && (cell[iSol][jSol+1].swall0 == false)) {rCstat = 2;}
 
    // down Cell
    dCstat = 0; // assume down Cell is open unless
    if(cell[iSol+1][jSol].swall2 == true){dCstat = 1;}
    if((cell[iSol+1][jSol].inSol == true) && (cell[iSol+1][jSol].swall2 == false)){dCstat = 2;}
 
    // down-left Cell
    dlCstat = 0; // assume down-left Cell is open unless
    if(cell[iSol+1][jSol-1].swall3 == true){dlCstat = 1;}
    if((cell[iSol+1][jSol-1].inSol == true) && (cell[iSol+1][jSol-1].swall3 == false)){dlCstat = 2;}

    // down-right Cell
    drCstat = 0; // assume down-right Cell is open unless
    if(cell[iSol+1][jSol+1].swall1 == true){drCstat = 1;}
    if((cell[iSol+1][jSol+1].inSol == true) && (cell[iSol+1][jSol+1].swall1 == false)){drCstat = 2;}


//  console.log('u-',uCstat,'ul-',ulCstat,'ur-',urCstat);
//   console.log('l-',lCstat,'r-',rCstat);   
//   console.log('d-',dCstat,'dl-',dlCstat,'dr-',drCstat);

//    starting from the cell below entrance - using the status of the cells around you
//    decide which way to move.
//    the up, up-left,up-right, left, right down, down-left or down-right 
//    the wall directions ar relative to the point you are at
//    in the "maze" - not the direction you are facing/moving.

    iStepped = false;  //only 1 step per cycle through while loop is allowed

// determine how many walls surround you
    nWallC = 0;
    if(uCstat == 1){nWallC = nWallC +1;}
    if(ulCstat == 1){nWallC = nWallC +1;}
    if(urCstat == 1){nWallC = nWallC +1;}
    if(lCstat == 1){nWallC = nWallC +1;} 
    if(rCstat == 1){nWallC = nWallC +1;}
    if(dCstat == 1){nWallC = nWallC +1;}
    if(dlCstat == 1){nWallC = nWallC +1;}
    if(drCstat == 1){nWallC = nWallC +1;}

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(uCstat == 0){nOpenC = nOpenC +1;}
    if(ulCstat == 0){nOpenC = nOpenC +1;}
    if(urCstat == 0){nOpenC = nOpenC +1;}
    if(lCstat == 0){nOpenC = nOpenC +1;} 
    if(rCstat == 0){nOpenC = nOpenC +1;}
    if(dCstat == 0){nOpenC = nOpenC +1;}
    if(dlCstat == 0){nOpenC = nOpenC +1;}
    if(drCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (inPath) cells surround you
    nPathC = 0;
    if(uCstat == 2){nPathC = nPathC +1;}
    if(ulCstat == 2){nPathC = nPathC +1;}
    if(urCstat == 2){nPathC = nPathC +1;}
    if(lCstat == 2){nPathC = nPathC +1;} 
    if(rCstat == 2){nPathC = nPathC +1;}
    if(dCstat == 2){nPathC = nPathC +1;}
    if(dlCstat == 2){nPathC = nPathC +1;}
    if(drCstat == 2){nPathC = nPathC +1;} 

// console.log('nW-',nWallC,'nO-',nOpenC,'nP-',nPathC);


    if(nWallC == 7){ // you are in a dead-end cell (7 walls) - find the one open wall

        if(iStepped == false && (uCstat == 0 || uCstat == 2)) // move up into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall2=true;
          iSol = iSol-1; jSol = jSol;  // move up
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (ulCstat == 0 || ulCstat == 2)) // move up-left into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall1=true;
          iSol = iSol-1; jSol = jSol-1;  //move up-left
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (urCstat == 0 || urCstat == 2)) // move up-right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall3=true;
          iSol = iSol-1; jSol = jSol+1;  // move up-right
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (lCstat == 0 || lCstat == 2)) // move left into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall0=true;
          iSol = iSol; jSol = jSol-1;  // move left
          iStepped = true; solStepCnt = solStepCnt +1;
          }
        
        if(iStepped == false && (rCstat == 0 || rCstat == 2)) // move right into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall4=true;
          iSol = iSol; jSol = jSol+1;  // move right
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (dlCstat == 0 || dlCstat == 2)) // move down-left into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall7=true;
          iSol = iSol+1; jSol = jSol-1;  //down-left
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (drCstat == 0 || drCstat == 2)) // move down-right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall5=true;
          iSol = iSol+1; jSol = jSol+1;  // move down-right
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if(iStepped == false && (dCstat == 0 || dCstat == 2)) // move down into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall6=true;
          iSol = iSol+1; jSol = jSol;  // move down
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

        if((iStepped == false) && (ulCstat == 0)) // move up-left into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol-1; jSol = jSol-1; 
          cell[iSol][jSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if((iStepped == false) && (urCstat == 0)) // move up-right into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol-1; jSol = jSol+1;
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

        if((iStepped == false) && (dlCstat == 0)) // move down-left into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol-1; 
          cell[iSol][jSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if((iStepped == false) && (drCstat == 0)) // move down-right into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol+1;
          cell[iSol][jSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
           }

        if((iStepped == false) && (dCstat == 0)) // move down into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol;
          cell[iSol][jSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
          }

    } 

    if((nPathC => 1) && (iStepped == false)){ // find a "random" open (in-solutiom) cell to move into

        dice=int(random(0.,7.99));  // an integer between 0 and 7

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (uCstat == 2))// move up into an open cell (already in solution)
            {iSol = iSol-1; jSol = jSol;
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 1:
            if((iStepped == false) && (ulCstat == 2)) // move up-left into an open cell (already in solution)
            { iSol = iSol-1; jSol = jSol-1; 
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 2:
            if((iStepped == false) && (urCstat == 2)) // move up-right into an open cell (already in solution)
            { iSol = iSol-1; jSol = jSol+1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 3:
            if((iStepped == false) && (lCstat == 2)) // move left into an open cell (already in solution)
            { iSol = iSol; jSol = jSol-1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;
    
        case 4:
         if((iStepped == false) && (rCstat == 2))// move right into an open cell (already in solution)
            {iSol = iSol; jSol = jSol+1;
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 5:
            if((iStepped == false) && (dlCstat == 2)) // move down-left into an open cell (already in solution)
            { iSol = iSol+1; jSol = jSol-1; 
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 6:
            if((iStepped == false) && (drCstat == 2)) // move down-right into an open cell (already in solution)
            { iSol = iSol+1; jSol = jSol+1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 7:
            if((iStepped == false) && (dCstat == 2)) // move down into an open cell (already in solution)
            {iSol = iSol+1; jSol = jSol;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

    }

    }

// console.log('end findSolution (i,j) ',iSol,jSol);

     //   iStopSolution = true;

        
        cell[0][jTopIn].inSol = true;  // top wall entry cell always in the solution path
        cell[0][jTopIn].isSealed = false; // top wall entry cell can't be sealed or modified
        cell[0][jTopIn].swall2 = true; // top wall entry cell top wall is always there - no escape
        cell[0][jTopIn].swall6 = false; // top wall entry cell bottom wall is always open        
        cell[1][jTopIn].inSol = true;  // starting cell always in the solution path
        cell[1][jTopIn].isSealed = false; // starting cell can't be sealed or modified
        cell[1][jTopIn].swall2 = true; // starting cell top wall is always open

        if((iSol == nRows-2 && jSol == jBotOut) || (solStepCnt > 5000)) {iStopSolution = true;}

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
              ellipse(cell[i][j].xCntr,cell[i][j].yCntr,.4*side,.4*side);
           }                      
        }   
    }
    fill(0,255,0);
    noStroke();
    ellipse(cell[iSol][jSol].xCntr,cell[iSol][jSol].yCntr,.6*side,.6*side);
}

 // this would show the blocked out cells during the solution if you're interested
/*
  for(let i=0; i<nRows-1; i++){ //each row
        for (let j=0; j<nCols-1; j++) { // across the columns
           if (cell[i][j].isSealed == true){
              fill(255,0,0);
              noStroke();
              ellipse(cell[i][j].xCntr,cell[i][j].yCntr,.2*side,.2*side);
           }                      
        }   
    }
 */

    // end of function drawSolution
}


//--------------------------------------------------------------
function keyTyped(){

    if (key == '1') 
    {iBuildMaze = true;}
    
    if (key == '2') 
    {iSaveMaze = true;}
    
    if (key == '3') 
    {iSolveMaze = true;}

    if (key === '6')
    {iFindSolution = true;}

    if (key === '7')
    {iShowSolution = true; iHideSolution = false;}

    if (key === '8')
    {iHideSolution = true; iShowSolution = false;}

    if (key == 'q')
    {iStpUpLft = true;}
    
    if (key == 'a')
    {iStpLft = true;}
    
    if (key == 'z')
    {iStpDwnLft = true;}
    
    if (key == 'e')
    {iStpUpRgt = true;}
    
    if (key == 'd')
    {iStpRgt = true;}
    
    if (key == 'c')
    {iStpDwnRgt = true;}
    
    if (key == 'w')
    {iStpUp = true;}
    
    if (key == 'x')
    {iStpDwn = true;}
    
    // an escape hatch - try again
    if(key == '9') 
    {iYou=1;jYou=jTopIn;}      
}

// end of keyPressed

//--------------------------------------------------------------
function mouseReleased(){
    
    onBtnRefresh = refreshButton.buttonCheck();
    if(onBtnRefresh === true)
    {mReleased = true;}
    
    onBtnSave = saveButton.buttonCheck();
    if(onBtnSave === true)
    {iSaveMaze = true;}
    
    onBtnSolve1 = solve1Button.buttonCheck();
    if(onBtnSolve1 === true)
    {iSolve1Maze = true;
    }
    
    onBtnSolve2 = solve2Button.buttonCheck();
    if(onBtnSolve2 === true)
    {iSolve2Maze = true;
    }


    if(uPButton.buttonCheck() == true){iStpUp = true; mPressed = false;}
    if(dNButton.buttonCheck() == true){iStpDwn = true; mPressed = false;}
    
    if(lButton.buttonCheck() == true){iStpLft = true; mPressed = false;}
    if(rButton.buttonCheck() == true){iStpRgt = true; mPressed = false;}
    
    if(uPLButton.buttonCheck() == true){iStpUpLft = true; mPressed = false;}
    if(dNLButton.buttonCheck() == true){iStpDwnLft = true; mPressed = false;}
    if(uPRButton.buttonCheck() == true){iStpUpRgt = true; mPressed = false;}
    if(dNRButton.buttonCheck() == true){iStpDwnRgt = true; mPressed = false;}
    
    return false;
}
// end of function mosusePresed


//****************************************************************************
//****************************************************************************

class Cell {

constructor(xCntr, yCntr, side, wall0, wall1, wall2, wall3,wall4, wall5, wall6, wall7, inM,
      swall0, swall1, swall2, swall3, swall4, swall5, swall6, swall7, inSol, isSealed) {
    
    this.xCntr = xCntr; 
    this.yCntr = yCntr; 
    this.side = side;
    this.wall0 = wall0;  
    this.wall1 = wall1;  
    this.wall2 = wall2;  
    this.wall3 = wall3;  
    this.wall4 = wall4;
    this.wall5 = wall5;  
    this.wall6 = wall6;  
    this.wall7 = wall7;
    this.swall0 = swall0;    
    this.swall1 = swall1;
    this.swall2 = swall2;
    this.swall3 = swall3;
    this.swall4 = swall4;
    this.swall5 = swall5;
    this.swall6 = swall6;
    this.swall7 = swall7;      
    this.inM = inM;
    this.inSol = inSol;
    this.isSealed = isSealed;
    
    let fac=(this.side/(1.+2.*cos(45))/2.);
    
    this.x0 = this.xCntr - this.side/2; 
    this.y0 = this.yCntr + fac;
    this.x1 = this.xCntr - this.side/2; 
    this.y1 = this.yCntr - fac;
    this.x2 = this.xCntr - fac; 
    this.y2 = this.yCntr - this.side/2;
    this.x3 = this.xCntr + fac; 
    this.y3 = this.yCntr - this.side/2;
    this.x4 = this.xCntr + this.side/2; 
    this.y4 = this.yCntr - fac;
    this.x5 = this.xCntr + this.side/2; 
    this.y5 = this.yCntr + fac;
    this.x6 = this.xCntr + fac; 
    this.y6 = this.yCntr + this.side/2;
    this.x7 = this.xCntr - fac; 
    this.y7 = this.yCntr + this.side/2;
}
//Methods

displayCell(lineW) {

    this.lineW = lineW;
    strokeWeight(this.lineW);
    stroke(0);

    if(this.wall0 == true){line(this.x0,this.y0,this.x1,this.y1);}
    if(this.wall1 == true){line(this.x1,this.y1,this.x2,this.y2);}
    if(this.wall2 == true){line(this.x2,this.y2,this.x3,this.y3);}
    if(this.wall3 == true){line(this.x3,this.y3,this.x4,this.y4);}
    if(this.wall4 == true){line(this.x4,this.y4,this.x5,this.y5);}
    if(this.wall5 == true){line(this.x5,this.y5,this.x6,this.y6);}
    if(this.wall6 == true){line(this.x6,this.y6,this.x7,this.y7);}
    if(this.wall7 == true){line(this.x7,this.y7,this.x0,this.y0);}

}

drawBorder() {
    // black out boarder cells
    fill(0);

    beginShape();
    noStroke;
    vertex(this.x0,this.y0);
    vertex(this.x1,this.y1);
    vertex(this.x2,this.y2);
    vertex(this.x3,this.y3);
    vertex(this.x4,this.y4);
    vertex(this.x5,this.y5);
    vertex(this.x6,this.y6);
    vertex(this.x7,this.y7);
    endShape();
}
    // end of Cell

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
        {ellipse(this.xCntr,this.yCntr,side/4,side/4);}
    }

}

//**********************************************************

class Arrow {
  constructor(aPos,xEnd, yEnd, aLength,wLine){
    this.xEnd = xEnd;
    this.yEnd = yEnd;
    this.wLine = wLine;
    this.aLength = aLength;
    this.aPos = aPos;
  }

  displayArrow() {
    fill(0);
    stroke(0); strokeWeight(this.wLine);

    if(this.aPos == 0){ // top arrow
        this.p1x=this.xEnd; this.p1y=this.yEnd-this.aLength;
        this.p2x=this.xEnd; this.p2y=this.yEnd;
        this.p3x=this.p1x-2*this.wLine; this.p3y=this.p2y-0.5*this.aLength;
        this.p4x=this.p1x+2*this.wLine; this.p4y=this.p2y-0.5*this.aLength;
        line(this.p1x,this.p1y,this.p2x,this.p2y);
        triangle(this.p2x,this.p2y,this.p3x,this.p3y,this.p4x,this.p4y);
    }

    if(this.aPos == 1){ // bottom arrow
        this.p1x=this.xEnd; this.p1y=this.yEnd;
        this.p2x=this.xEnd; this.p2y=this.yEnd+this.aLength;
        this.p3x=this.xEnd-2*this.wLine; this.p3y=this.p2y-0.5*this.aLength;
        this.p4x=this.xEnd+2*this.wLine; this.p4y=this.p2y-0.5*this.aLength;
        line(this.p1x,this.p1y,this.p2x,this.p2y);
        triangle(this.p2x,this.p2y,this.p3x,this.p3y,this.p4x,this.p4y);   
    }
  }
}


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
    rect(this.xpos,this.ypos,this.bw,this.bh);

    fill(0);textSize(13); 
    text(this.nam, this.xpos + (.01*this.bw), this.ypos + (.75*this.bh));
 }

}

//*****************************************
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
