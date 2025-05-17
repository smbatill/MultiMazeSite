/* 

revised as of 10/16/24

updated for website
 - added letter-key operation for keyboard
 - added buttons for mouse or touch
 - solution  

*/


//  Variables etc....

let cell = [];
let pathCellIndx = [];
let cPi = [];let cPj=[];
let xCor=[];let yCor=[];
let xCntr=[]; let yCntr=[];
let pCelli=[]; pCellj=[]; 


let nCols,nRows;
let hexX,hexY;
let loc;
let base, hite;
let iRandom, iMove;
let cCi, cCj; // shorthand for currentCell i and j index
let pCi, pCj; // shorthand for perviousCell i and j index
let cPindex; // counter for current cell path
let numInactiveCells; 
let inActiveCellsLeft, rollDice;
let iOpt;
let originX, originY;
let nColsMin, nColsMax;
let xLeftUpCornerMaze, yLeftUpCornerMaze;
let jTopIn,jBotOut;let inDoor;
let fac1, fac2, fac3, fac4;
let dotSize;
let arrowLen;
let bColor; 
    
// stuff for sizing and saving the maze

let iBuildMaze,iDrawMaze, iRefresh, iSaveMaze, iSolveMaze,iDrawPath;
let iFindSolution;
let refreshX, refreshY, refreshBoxh, refreshBoxw;
let reSaveX, reSaveY, reSaveBoxh, reSaveBoxw;
    
    
// stuff for solving the maze
let iStpUpLft, iStpUpRgt, iStpDwnLft, iStpDwnRgt, iStpUp,iStpDwn;
let iYou,jYou;

// stuff for finding the solution
let iSolStart,jSolStart,iStepped,iStopSolution;
let solStepCnt, dFacing, dFacingEntered;
let iDrawSolution, iShowSolution;
let uCstat,ulCstat,urCstat,dCstat,dlCstat,drCstat;
let isSealed, inSol;
let iSol, jSol;
let nOpenC, nPathC, nWallC;
let dice;
let mReleased;

// some text and control stuff
let onBtnRefresh,onBtnSave,onBtnSolve;
let s1,s2,s3,s4,s5,s6,s7,s8,s9,s10;
let mPressed, kPressed, kReleased;
let count; 

// <<<<<<<<<<< end of variables >>>>>>>>>
 
function setup() {  
  // size and center the maze based upon the number of cells
  createCanvas(1024,770);

  background(255);
  dotColor = color(255,0,0);
  visitedDotColor = color(255,255,0);
  
  originX = .07*width; originY = .07*height;    
  xLeftUpCornerMaze = originX; yLeftUpCornerMaze = originY;
    
  nColsMin = 10; nColsMax = 52; //number of columns must be an even # (10 -  58)
    
    ss1 = "MAZE COMPLEXITY";  ss2 = "SIMPLE";  ss3 = "COMPLEX"; 

 // declare slider and buttons objects

    sizeBar = new ScrollBar(820,565,150,35,1);
    refreshButton = new Button(820, 505, 130, 50, 255, 255, 0,false,'    NEW MAZE ');
    solveButton = new Button( 820.,130.,130.,50., 0, 200,0, false,'   SOLVE MAZE ');
    saveButton = new Button(820, 40, 130, 50, 255, 204, 255, false,'   SAVE MAZE');   
 
    uPLButton = new Button(770, 240, 75, 75, 153, 204, 255,false, ' Up Left(q)');
    uPButton = new Button(850., 230., 75., 75., 153, 204, 255,false, '   Up(w)');
    uPRButton = new Button(930, 240, 75, 75, 153, 204, 255,false, 'Up Right(e)');
 
    dNLButton = new Button(770, 350, 75, 75, 153, 204, 255,false, ' Dwn Left(a)');
    dNButton = new Button(850.,360.,75., 75., 153, 204, 255,false, '   Down(s)');
    dNRButton = new Button(930, 350, 75, 75, 153, 204, 255,false, 'Dwn Right(d)');

    onBtnRefresh = false; onBtnSave = false;
    
    iBuildMaze = true; iDrawMaze = false; iSolveMaze = false; iDrawPath = false; iSaveMaze = false;
    
    iStpUpLft=false; iStpDwnLft=false; iStpUpRgt=false; iStpDwnRgt=false; iStpUp=false; iStpDwn=false;

    iFindSolution = false; iShowSolution = false; iHideSolution =  true;
    
}  // end of function setup ***********************



function draw () {

    createCanvas(1024,770);
    background(255);
//   fill(255); noStroke();
//    rect(0, 0, 1023,769);

    sizeBar.sbDisplay();
    sizeBar.sbUpdate();
    refreshButton.buttonDraw();
    saveButton.buttonDraw();
    solveButton.buttonDraw();
    uPButton.buttonDraw();
    dNButton.buttonDraw();
    uPLButton.buttonDraw();
    dNLButton.buttonDraw();
    uPRButton.buttonDraw();
    dNRButton.buttonDraw(); 

    if(refreshButton.buttonCheck() == true && mReleased == true) 
      {iBuildMaze = true; mReleased = false; }

    if(solveButton.buttonCheck() == true && mouseIsPressed == true) 
      {iSolveMaze = true; } 

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
        buildMaze();     
        iBuildMaze = false;
        findSolution();           
 //       iFindSolution = false; 
    }

    if(iDrawMaze == true){
        drawMaze(jTopIn,jBotOut);
        arrowTop.displayArrow();
        arrowBot.displayArrow();
    }
    
    if(iSolveMaze == true){
        solveMaze();
        pathCellIndx[0][jTopIn].inPath=true;
        drawPath();
    }
 
    if(iShowSolution == true){
        drawSolution();
    } 

    if(iSaveMaze == true){  
        noStroke();
        fill(255);
        rect(760,0,265,770);
        saveCanvas('aMaze','jpg');
        let count = 0;
        for(let ic=0;ic<100000;ic=ic+.0001) // need a short delay so only 1 copy of the maze is downloaded
          {count=count+ic;}
        iSaveMaze = false;
    }

}
// end of function draw() *************************

  
function buildMaze () {
  background(255);

//  console.log('begin buildMaze');


  // reset starting conditions for a new maze

  iBuildMaze = true; iDrawMaze = true; iSolveMaze = false; 
  iDrawPath = false; iSaveMaze = false;
  iFindSolution = false; iDrawSolution = false; iHideSolution =  true;
  iShowSolution = false;
  iSolved = false;

    iStpUpLft=false; iStpDwnLft=false; iStpUpRgt=false; iStpDwnRgt=false; iStpUp=false; iStpDwn=false;

      // set the maze size based on slider postion
    
    nCols = int(nColsMin + ((sizeBar.getPos()-1063)/150)*(nColsMax-nColsMin));

    if(nCols %2 != 0) {nCols=nCols+1;}  // need an even number of columns
    base=0.63*width/(1.5*float(nCols));
    hite=1.732*base;
    nRows = int(0.8*height/hite);

    dotSize = base;

 //   console.log('nCols- ',nCols,' nRows- ',nRows);
    
    // initialize all the hexangle object parameters
    
    for(let i=0; i < nRows; i++){ //each row starting at top row
        cell[i]=[];
        for (let j=0; j < nCols; j++) { // across the columns
            hexX=originX+j*(1.5*base);
            if((j % 2)==0) {hexY=originY+i*hite;}
            if((j % 2)!=0) {hexY=originY+(i*hite+hite/2);}
            cell[i][j] = new Cell(hexX,hexY,base,true,true,true,true,true,true,false,
                                   false,false,false,false,false,false,false,false);
        }
    }
    
    // initialize all the cell center locations for solution paths
    for(let i=0; i < nRows; i++){ //each row starting at top row
        pathCellIndx[i]=[];
        for (let j=0; j<nCols; j++) { // across the columns
            pathCellIndx[i][j] = new Path(cell[i][j].xCntr,cell[i][j].yCntr,false,dotSize);
        }
    }
       
    // block out all edge hexangles and make them inactive i.e. can't be eliminated when opening the maze
    // they also cannot be part of the "solution"
    for(let i=0; i <= nRows-1; i++){ //each row
        for (let j=0; j <= nCols-1; j++) { // across the columns
            if(i==0 || i==nRows-1 || j==0 || j==nCols-1){
 //               cell[i][j].drawBorder(); 
                cell[i][j].inM = true;
                cell[i][j].isSealed = true;
                cell[i][j].inSol = false;
            }
        }
    }

    // now some fine details

        jTopIn = int(random(2.,nCols-2.));
        if ((jTopIn % 2) == 0){jTopIn = jTopIn +1;} // always enter in an Odd cell
        jBotOut = int(random(2.,nCols-2.));
        if ((jBotOut % 2) == 0){jBotOut = jBotOut +1;} // always exit in an Odd cell        
        fac1 = originX+jTopIn*(1.5*base);
        fac2 = originX+jBotOut*(1.5*base);
        fac3 = originY;
        fac4 = originY+nRows*hite;
        arrowLen = 0.04*height;
 
        // top(0)or bottom(1),x position, y position, length, headwidth/length
        arrowTop = new Arrow(0,fac1, fac3, arrowLen, 2); 
        arrowBot = new Arrow(1,fac2, fac4, arrowLen, 2);
        iYou=1; jYou=jTopIn; // start you at the entrance

        // position door arrows
        let xInDoor = cell[0][jTopIn].xCntr;
        let yInDoor = cell[0][jTopIn].yCntr - (hite/2) - 25;

        let xOutDoor = cell[nRows-2][jBotOut].xCntr;
        let yOutDoor = cell[nRows-2][jBotOut].yCntr + (hite/2) + 5;


 // START CONTRUCTING THE MAZE   
    
    // all non-wall cells start as inactive
    numInactiveCells=(nRows)*(nCols)- 2*nCols-2*(nRows- 2);
    
    // select an interior cell at random as the maze starting point
    cCj= int(random(3,float(nCols-3)));
    cCi= int(random(3,float(nRows-3)));
    cell[cCi][cCj].inM = true;
    numInactiveCells = numInactiveCells -1;
    inActiveCellsLeft = true; // variable is true as long as there are ininM cells
    
    // initialize build path tracking paramater arrays
    cPi[0]=cCi; cPj[0]=cCj;
    cPi[1]=cCi; cPj[1]=cCj;
    cPindex = 1;
    
    // begin the depth first search algorithm to eliminate maze walls and create the maze
    
    while (numInactiveCells > 0 && cPindex > 0) {
        
        if((cCj % 2)==0) { // cell column number is "even"
            
            if(!cell[cCi-1][cCj-1].inM||!cell[cCi-1][cCj].inM||!cell[cCi-1][cCj+1].inM||!cell[cCi][cCj+1].inM||!cell[cCi+1][cCj].inM||!cell[cCi][cCj-1].inM)
            {rollDice=true;}
            
            else { // no inactive cells available for a move
                cCi=cPi[cPindex-1];
                cCj=cPj[cPindex-1];
                cPindex=cPindex-1;
            }
            
            while(rollDice) { // roll the dice to find a door to open
                
                iMove=int(random(1.,7.));
                
                if(iMove == 1 && !cell[cCi-1][cCj-1].inM) { // cell up and left - wall 1
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall1 = false;  // current cell
                    cell[cCi-1][cCj-1].wall4 = false; // neighboor and next cell
                    cCi = cCi-1;cCj=cCj-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 2 && !cell[cCi-1][cCj].inM) {  // cell above - wall 2
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall2 = false;  // current cell
                    cell[cCi-1][cCj].wall5 = false; // neighboor and next cell
                    cCi=cCi-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 3 && !cell[cCi-1][cCj+1].inM) { // cell up and right - wall 3
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall3 = false;  // current cell
                    cell[cCi-1][cCj+1].wall6 = false; // neighboor and next cell
                    cCi=cCi-1;cCj=cCj+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
                else if(iMove == 4 && !cell[cCi][cCj+1].inM) {  // cell down and right - wall 4
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall4 = false;  // current cell
                    cell[cCi][cCj+1].wall1 = false; // neighboor and next cell
                    cCj=cCj+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
                else if(iMove == 5 && !cell[cCi+1][cCj].inM) {  // cell below - wall 5
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall5 = false;  // current cell
                    cell[cCi+1][cCj].wall2 = false; // neighboor and next cell
                    cCi=cCi+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
                else if(iMove == 6 && !cell[cCi][cCj-1].inM) {  // cell below left - wall 6
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall6 = false;  // current cell
                    cell[cCi][cCj-1].wall3 = false; // neighboor and next cell
                    cCj=cCj-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
            } // end of rollDice while loop
        } // end of even numbered column if segment
        
        if((cCj % 2)!=0) { // cell column number is "odd"
            
            if(!cell[cCi][cCj-1].inM||!cell[cCi-1][cCj].inM||!cell[cCi][cCj+1].inM||!cell[cCi+1][cCj+1].inM||!cell[cCi+1][cCj].inM||!cell[cCi+1][cCj-1].inM)
            {rollDice=true;}
            
            else { // no inactive cells available for a move
                cCi=cPi[cPindex-1];
                cCj=cPj[cPindex-1];
                cPindex=cPindex-1;
            }
            
            while(rollDice) { // roll the dice to find a door to open
                iMove=int(random(1.,7.));
                
                if(iMove == 1 && !cell[cCi][cCj-1].inM) { // cell up and left - wall 1
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall1 = false;  // current cell
                    cell[cCi][cCj-1].wall4 = false; // neighboor and next cell
                    cCj=cCj-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 2 && !cell[cCi-1][cCj].inM) {  // cell above - wall 2
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall2 = false;  // current cell
                    cell[cCi-1][cCj].wall5 = false; // neighboor and next cell
                    cCi=cCi-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 3 && !cell[cCi][cCj+1].inM) { // cell up and right - wall 3
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall3 = false;  // current cell
                    cell[cCi][cCj+1].wall6 = false; // neighboor and next cell
                    cCj=cCj+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
                else if(iMove == 4 && !cell[cCi+1][cCj+1].inM) {  // cell down and right - wall 4
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall4 = false;  // current cell
                    cell[cCi+1][cCj+1].wall1 = false; // neighboor and next cell
                    cCi = cCi+1; cCj=cCj+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
                else if(iMove == 5 && !cell[cCi+1][cCj].inM) {  // cell below - wall 5
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall5 = false;  // current cell
                    cell[cCi+1][cCj].wall2 = false; // neighboor and next cell
                    cCi=cCi+1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
                else if(iMove == 6 && !cell[cCi+1][cCj-1].inM) {  // cell below left - wall 6
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall6 = false;  // current cell
                    cell[cCi+1][cCj-1].wall3 = false; // neighboor and next cell
                    cCi=cCi+1;cCj=cCj-1;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
            } // end of rollDice while loop
        } // end of even numbered column if segment
        
    } // end of number of nInactiveCells while loop

    // remove the walls on the entry/exit door cells
    cell[0][jTopIn].wall5 = false; 
    cell[1][jTopIn].wall2 = false;
    cell[nRows-2][jBotOut].wall5 = false;
    cell[nRows-1][jBotOut].wall2 = false;

    
    iBuildMaze = false;
    iDrawMaze = true; 

//     console.log('end of buildMaze');   

    // end of buildMaze
}
//-----------------------------------------------------------------------------

function solveMaze(){
   // build a path to move through the maze
    
    if((jYou % 2)!=0) { // cell column number is "odd"
        
        // try to move UP LEFT - check to see if there is a wall
        if(iStpUpLft == true && cell[iYou][jYou].wall1 == true)
        {iStpUpLft = false; }
        if(iStpUpLft == true && cell[iYou][jYou].wall1 == false)
        {jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpUpLft = false;}
        
        // try to move down DOWN LEFT - check to see if there is a wall
        if(iStpDwnLft == true && cell[iYou][jYou].wall6 == true)
        {iStpDwnLft = false;}
        if(iStpDwnLft == true && cell[iYou][jYou].wall6 == false){
            iYou=iYou+1; jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpDwnLft = false;}
        
        // try to move UP RIGHT - check to see if there is a wall
        if(iStpUpRgt == true && cell[iYou][jYou].wall3 == true)
        {iStpUpRgt = false;}
        if(iStpUpRgt == true && cell[iYou][jYou].wall3 == false){
            jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpUpRgt = false;}
        
        // try to move down DOWN RIGHT - check to see if there is a wall
        if(iStpDwnRgt == true && cell[iYou][jYou].wall4 == true)
        {iStpDwnRgt = false;}
        if(iStpDwnRgt == true && cell[iYou][jYou].wall4 == false){
            iYou=iYou+1; jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpDwnRgt = false;}
        
        // try to move UP  - check to see if there is a wall
        if(iStpUp == true && cell[iYou][jYou].wall2 == true)
        {iStpUp = false;}
        if(iStpUp == true && cell[iYou][jYou].wall2 == false){
            iYou=iYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpUp = false;}
        
        // try to move DOWN  - check to see if there is a wall
        if(iStpDwn == true && cell[iYou][jYou].wall5 == true)
        {iStpDwn = false;}
        if(iStpDwn == true && cell[iYou][jYou].wall5 == false){
            iYou=iYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpDwn = false;}
    }
    
    else{ // then cCj must be even
        
        // try to move UP LEFT - check to see if there is a wall
        if(iStpUpLft == true && cell[iYou][jYou].wall1 == true)
        {iStpUpLft = false; }
        if(iStpUpLft == true && cell[iYou][jYou].wall1 == false){
            iYou=iYou-1; jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpUpLft = false;}
        
        // try to move down DOWN LEFT - check to see if there is a wall
        if(iStpDwnLft == true && cell[iYou][jYou].wall6 == true)
        {iStpDwnLft = false;}
        if(iStpDwnLft == true && cell[iYou][jYou].wall6 == false){
            jYou=jYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpDwnLft = false;}
        
        // try to move UP RIGHT - check to see if there is a wall
        if(iStpUpRgt == true && cell[iYou][jYou].wall3 == true)
        {iStpUpRgt = false;}
        if(iStpUpRgt == true && cell[iYou][jYou].wall3 == false){
            iYou=iYou-1; jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpUpRgt = false;}
        
        // try to move down DOWN RIGHT - check to see if there is a wall
        if(iStpDwnRgt == true && cell[iYou][jYou].wall4 == true)
        {iStpDwnRgt = false;}
        if(iStpDwnRgt == true && cell[iYou][jYou].wall4 == false){
            jYou=jYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpDwnRgt = false;}
        
        // try to move UP  - check to see if there is a wall
        if(iStpUp == true && cell[iYou][jYou].wall2 == true)
        {iStpUp = false;}
        if(iStpUp == true && cell[iYou][jYou].wall2 == false){
            iYou=iYou-1; pathCellIndx[iYou][jYou].inPath=true; iStpUp = false;}
        
        // try to move DOWN  - check to see if there is a wall
        if(iStpDwn == true && cell[iYou][jYou].wall5 == true)
        {iStpDwn = false;}
        if(iStpDwn == true && cell[iYou][jYou].wall5 == false){
            iYou=iYou+1; pathCellIndx[iYou][jYou].inPath=true; iStpDwn = false;}
    }

    // clear all incorrect key/button indicators
    iStpDwn=false; iStpUp=false; iStpDwnRgt=false;
    iStpUpRgt=false; iStpDwnLft=false; iStpUpLft;   
    
    // end of function solveMaze
}   

//--------------------------------------------------------------
function drawMaze(){
// draw the completed maze

// draw and fill the boarder cells 
    for(let i=0; i <= nRows-1; i++){ //down the rows
        for (let j=0; j <= nCols-1; j++) { // across the columns    
          if(i==0 || i==nRows-1 || j==0 || j==nCols-1){

            if((i == 0 && j == jTopIn) || (i == nRows-1 && j == jBotOut))
                { ;} // do nothing - these are the doors
            else
                {   if((i+j) % 2 == 0){bColor = 0;}
                    else(bColor = 1);
                    cell[i][j].drawBorder(bColor);} // fill a boarder cell
            }
        }
    }    

// draw the completed maze - all cells within the boarders   
    for(let i=1; i<nRows-1; i++){ //each row
        for (let j=1; j<nCols-1; j++) { // across the columns
            cell[i][j].displayCell();
        }   
    } 
    // end of function drawMaze
}


//--------------------------------------------------------------
function drawPath(){
    // draw the path through the maze
    
    // mark your staring point in the maze
    pathCellIndx[1][jTopIn].inPath = true;
    fill(0,200,0);
    noStroke(); 
    //ellipse(pathCellIndx[1][jTopIn].xCntr, pathCellIndx[1][jTopIn].yCntr,dotSize,dotSize);   
    
    // mark all cells visited so far!
    for(let i=1; i<nRows-1; i++){ //each row
        for (let j=1; j<nCols-1; j++) { // across the columns
            pathCellIndx[i][j].markCell();
        }
    }
   
    if(iYou==nRows-1 && jYou == jBotOut){ // you have reached the exit door
        fill(0, 0, 255); noStroke();
        ellipse(pathCellIndx[iYou][jYou].xCntr, pathCellIndx[iYou][jYou].yCntr,dotSize,dotSize);}

    else{ 
        fill(0,200,0); noStroke();
        ellipse(pathCellIndx[iYou][jYou].xCntr, pathCellIndx[iYou][jYou].yCntr,dotSize,dotSize);
    }
    // end of function drawPath
}


//--------------------------------------------------------------
function findSolution(){
    // define all walls in the initial maze as the starting configuration for the solution maze

//  console.log('begin findSolution');

    for(let i = 0; i <= nRows - 1; i++){ //each row
        for (let j = 0; j <= nCols - 1; j++) { // across the columns
            cell[i][j].swall1 = cell[i][j].wall1;
            cell[i][j].swall2 = cell[i][j].wall2;
            cell[i][j].swall3 = cell[i][j].wall3;
            cell[i][j].swall4 = cell[i][j].wall4; 
            cell[i][j].swall5 = cell[i][j].wall5;
            cell[i][j].swall6 = cell[i][j].wall6;                                     
        }   
    }

    // goal is move through the maze and add walls to seal off dead ends
    // now find the path that solves the maze 

    iSol = 0; jSol = jTopIn; // start in the maze in the entry cell on the top boarder

//console.log('entry cell: iSol-',iSol,' jSol- ',jSol);

    cell[0][jTopIn].inSol = true;  // top boarder entry cell is always in the solution path 
    cell[0][jTopIn].swall2 = true; // close the top boarder enty cell wall2(top)
    cell[0][jTopIn].swall5 = false; // open the top boarder entry cell wall5(bottom)
    cell[0][jTopIn].iSealed = false; // and the starting cell can't be sealed   
    cell[1][jTopIn].swall2 = false; // remove top wall of cell below entry cell
    solStepCnt = 0; 
    iStopSolution = false;

// Start a exhaustive search through maze and "seal" dead-end cells as you go

while(iStopSolution == false) {

    iStepped = false;

// ****************
// NEXT SECTION - IF YOU'RE IN AN EVEN CELL (column number is even)
// *****************

if((jSol % 2) == 0) { // cell is "even" 

// currently in an Even cell         

 //console.log('start Even cell - ',iSol,jSol);        

//  determine status of neighbor cells of the current Even cell
//   Cstat values: 0 - open, 1 - wall, 2 - open and inPath

    // up Cell
    uCstat = 0; // assume up Cell is open unless
    if (iSol == 0) {uCstat = 1;}  // you can't move up out of the top row
    else{
        if(cell[iSol-1][jSol].swall5 == true) {uCstat = 1;}
        if((cell[iSol-1][jSol].inSol == true) && (cell[iSol-1][jSol].swall5 == false)) {uCstat = 2;}
    }

    ulCstat = 0; // assume up-left Cell is open unless
    if (iSol == 0) {ulCstat = 1;}  // you can't move up out of the top row
    else{
        if(cell[iSol-1][jSol-1].swall4 == true) {ulCstat = 1;}
        if((cell[iSol-1][jSol-1].inSol == true) && (cell[iSol-1][jSol-1].swall4 == false)) {ulCstat = 2;}
    }

    urCstat = 0; // assume up-right Cell is open 
    if (iSol == 0) {urCstat = 1;}  // you can't move up out of the top row
    else{   
        if(cell[iSol-1][jSol+1].swall6 == true) {urCstat = 1;}
        if((cell[iSol-1][jSol+1].inSol == true) && (cell[iSol-1][jSol+1].swall6 == false)) {urCstat = 2;}
    }

    dlCstat = 0; // assume down-left Cell is open unless
    if(cell[iSol][jSol-1].swall3 == true) {dlCstat = 1;}
    if((cell[iSol][jSol-1].inSol == true) && (cell[iSol][jSol-1].swall3 == false)) {dlCstat = 2;}

    drCstat = 0; // assume down-right Cell is open unless
    if(cell[iSol][jSol+1].swall1 == true) {drCstat = 1;}
    if((cell[iSol][jSol+1].inSol == true) && (cell[iSol][jSol+1].swall1 == false)) {drCstat = 2;}

    dCstat = 0; // assume down Cell is open unless
    if(iSol == nRows-2) {dCstat = 1;}
    else{
    if(cell[iSol+1][jSol].swall2 == true) {dCstat = 1;}
    if((cell[iSol+1][jSol].inSol == true) && (cell[iSol+1][jSol].swall2 == false)) {dCstat = 2;}
    }

    // end of determine status of Even cell 

    iStepped = false;  //only 1 step per cycle through while loop is allowed

// determine how many walls surround you
    nWallC = 0;
    if(uCstat == 1){nWallC = nWallC +1;}
    if(ulCstat == 1){nWallC = nWallC +1;}
    if(urCstat == 1){nWallC = nWallC +1;} 
    if(dlCstat == 1){nWallC = nWallC +1;}
    if(drCstat == 1){nWallC = nWallC +1;}
    if(dCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(uCstat == 0){nOpenC = nOpenC +1;}
    if(ulCstat == 0){nOpenC = nOpenC +1;}
    if(urCstat == 0){nOpenC = nOpenC +1;} 
    if(dlCstat == 0){nOpenC = nOpenC +1;}
    if(drCstat == 0){nOpenC = nOpenC +1;}
    if(dCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (but inPath) cells surround you
    nPathC = 0;
    if(uCstat == 2){nPathC = nPathC +1;}
    if(ulCstat == 2){nPathC = nPathC +1;}
    if(urCstat == 2){nPathC = nPathC +1;}     
    if(dlCstat == 2){nPathC = nPathC +1;}
    if(drCstat == 2){nPathC = nPathC +1;}
    if(dCstat == 2){nPathC = nPathC +1;}     

//  console.log(uCstat,ulCstat,urCstat,dlCstat,drCstat,dCstat); 
//  console.log('nXC ',nWallC,nOpenC,nPathC); 

    if(nWallC == 5){ // you are in a dead-end cell (5 walls) - find the one open wall

 //    console.log(iSol,jSol,' is being sealed',uCstat,ulCstat,urCstat,dlCstat,drCstat,dCstat);      

        if(iStepped == false && (uCstat == 0) || (uCstat == 2)) // move up into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall2=true;            
          cell[iSol-1][jSol].swall5=true;
          iSol = iSol-1; jSol = jSol; // move up
          iStepped = true; solStepCnt = solStepCnt +1;
 //    console.log('nWallC -Even: moved up'); 
        } 

        if(iStepped == false && (ulCstat == 0) || (ulCstat == 2)) // move up-left into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall1=true;
          cell[iSol-1][jSol-1].swall4=true;
          iSol = iSol-1; jSol = jSol-1; // move up-left
          iStepped = true; solStepCnt = solStepCnt +1;
//     console.log('nWallC -Even: moved up-left'); 
        }      

        if(iStepped == false && (urCstat == 0) || (urCstat == 2)) // move up-right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall3=true;
          cell[iSol-1][jSol+1].swall6=true;
          iSol = iSol-1; jSol = jSol+1;  // move up-right
          iStepped = true; solStepCnt = solStepCnt +1;
//     console.log('nWallC -Even: moved up-right'); 
        } 

        if(iStepped == false && (dlCstat == 0) || (dlCstat == 2)) // move down-left into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall6 = true;
          cell[iSol][jSol-1].swall3 = true;
          iSol = iSol; jSol = jSol-1; // down-left
          iStepped = true; solStepCnt = solStepCnt +1;
//     console.log('nWallC -Even: down-left'); 
        } 

        if(iStepped == false && (drCstat == 0) || (drCstat == 2)) // move down-right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall4 = true;
          cell[iSol][jSol+1].swall1 = true;
          iSol = iSol; jSol = jSol + 1; // move down-right
          iStepped = true; solStepCnt = solStepCnt +1;
//     console.log('nWallC -Even: moved down-right'); 
        }      

        if(iStepped == false && (dCstat == 0) || (dCstat == 2)) // move down into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall5=true;
          cell[iSol+1][jSol].swall2=true;
          iSol = iSol+1; jSol = jSol;   // move down
          iStepped = true; solStepCnt = solStepCnt +1;
 //    console.log('nWallC -Even: moved down'); 
        }
    }

// ****************************************************

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

        if((iStepped == false) && (dlCstat == 0)) // move down-left into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol; jSol = jSol-1;
          cell[iSol][jSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;    
        }    

        if((iStepped == false) && (drCstat == 0)) // move down-right into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol; jSol = jSol+1;
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

        dice=int(random(0.,5.99));

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
            {iSol = iSol-1; jSol = jSol+1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 3:
         if((iStepped == false) && (dlCstat == 2))// move down-left into an open cell (already in solution)
            {iSol = iSol; jSol = jSol-1;
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
        break;

        case 4:
            if((iStepped == false) && (drCstat == 2)) // move down-right into an open cell (already in solution)
            { iSol = iSol; jSol = jSol+1; 
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
    // if(iStepped == true){console.log('nPathC -Even: move down-right'); } 

        break;

        case 5:
            if((iStepped == false) && (dCstat == 2)) // move down into an open cell (already in solution)
            {iSol = iSol+1; jSol = jSol; 
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
    // if(iStepped == true){console.log('nPathC -Even: move down'); } 

        break;


        }
    }

}

// ****************
// END OF SECTION - IN AN EVEN CELL 
// *****************

// ****************************************************************************************************

// ****************
// NEXT SECTION - IN AN ODD CELL (column number is odd)
// *****************

if(((jSol % 2)!= 0) && iStepped == false) { // cell is "odd" 

// currently in an Odd cell         

// console.log('start Odd cell - ',iSol,jSol);        

//  determine status of neighbor cells of the current Odd cell
//   Cstat values: 0 - open, 1 - wall, 2 - open and inPath

    // up Cell
    uCstat = 0; // assume up Cell is open unless
    if (iSol == 0){uCstat = 1;}  // you are in the top row - open cell
    else{
        if(cell[iSol-1][jSol].swall5 == true){uCstat = 1;}
        if((cell[iSol-1][jSol].inSol == true) && (cell[iSol-1][jSol].swall5 == false)){uCstat = 2;}
    }

    ulCstat = 0; // assume up-left Cell is open unless
    if (iSol == 0){ulCstat = 1;}  // you are in the top row - open cell
    else{
        if(cell[iSol][jSol-1].swall4 == true){ulCstat = 1;}
        if((cell[iSol][jSol-1].inSol == true) && (cell[iSol][jSol-1].swall4 == false)) {ulCstat = 2;}
    }   

    urCstat = 0; // assume up-right Cell is open unless
    if (iSol == 0){urCstat = 1;}  // you are in the top row - open cell
    else{    
        if(cell[iSol][jSol+1].swall6 == true){urCstat = 1;}
        if((cell[iSol][jSol+1].inSol == true) && (cell[iSol][jSol+1].swall6 == false)) {urCstat = 2;}
    }

    dlCstat = 0; // assume down-left Cell is open unless
    if(cell[iSol+1][jSol-1].swall3 == true){dlCstat = 1;}
    if((cell[iSol+1][jSol-1].inSol == true) && (cell[iSol+1][jSol-1].swall3 == false)) {dlCstat = 2;}

    drCstat = 0; // assume down-right Cell is open unless
    if(cell[iSol+1][jSol+1].swall1 == true){drCstat = 1;}
    if((cell[iSol+1][jSol+1].inSol == true) && (cell[iSol+1][jSol+1].swall1 == false)) {drCstat = 2;}

    dCstat = 0; // assume down Cell is open unless
    if (iSol == nRows-2) {dCstat = 1;}
    else {
    if(cell[iSol+1][jSol].swall2 == true){dCstat = 1;}
    if((cell[iSol+1][jSol].inSol == true) && (cell[iSol+1][jSol].swall2 == false)) {dCstat = 2;}
    }

    // end of determine status of Even cell 

    iStepped = false;  //only 1 step per cycle through while loop is allowed

// determine how many walls surround you
    nWallC = 0;
    if(uCstat == 1){nWallC = nWallC +1;}
    if(ulCstat == 1){nWallC = nWallC +1;}
    if(urCstat == 1){nWallC = nWallC +1;} 
    if(dlCstat == 1){nWallC = nWallC +1;}
    if(drCstat == 1){nWallC = nWallC +1;}
    if(dCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(uCstat == 0){nOpenC = nOpenC +1;}
    if(ulCstat == 0){nOpenC = nOpenC +1;}
    if(urCstat == 0){nOpenC = nOpenC +1;} 
    if(dlCstat == 0){nOpenC = nOpenC +1;}
    if(drCstat == 0){nOpenC = nOpenC +1;}
    if(dCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (but inPath) cells surround you
    nPathC = 0;
    if(uCstat == 2){nPathC = nPathC +1;}
    if(ulCstat == 2){nPathC = nPathC +1;}
    if(urCstat == 2){nPathC = nPathC +1;}     
    if(dlCstat == 2){nPathC = nPathC +1;}
    if(drCstat == 2){nPathC = nPathC +1;}
    if(dCstat == 2){nPathC = nPathC +1;}     

//  console.log(uCstat,ulCstat,urCstat,dlCstat,drCstat,dCstat);
//  console.log('nXC ',nWallC,nOpenC,nPathC); 

    if(nWallC == 5){ // you are in a dead-end cell (5 walls) - find the one open wall

//     console.log(iSol,jSol,' is being sealed',uCstat,ulCstat,urCstat,dlCstat,drCstat,dCstat);      

       if(iStepped == false && (uCstat == 0) || (uCstat == 2)) // move up into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall2=true;
          cell[iSol-1][jSol].swall5=true;
          iSol = iSol-1; jSol = jSol; // move up
          iStepped = true; solStepCnt = solStepCnt +1;
//     console.log('nWallC -Even: moved up'); 
        }

        if(iStepped == false && (ulCstat == 0) || (ulCstat == 2)) // move up-left into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall1=true;
          cell[iSol][jSol-1].swall4=true;
          iSol = iSol; jSol = jSol-1; // move up-left
          iStepped = true; solStepCnt = solStepCnt +1;
 //    console.log('nWallC -Even: moved up-left'); 
        }      

        if(iStepped == false && (urCstat == 0) || (urCstat == 2)) // move up-right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall3=true;
          cell[iSol][jSol+1].swall6=true;
          iSol = iSol; jSol = jSol+1;  // move up-right
          iStepped = true; solStepCnt = solStepCnt +1;
 //    console.log('nWallC -Even: moved up-right'); 
        } 

        if(iStepped == false && (dlCstat == 0) || (dlCstat == 2)) // move down-left into the open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall6 = true;
          cell[iSol+1][jSol-1].swall3 = true;
          iSol = iSol+1; jSol = jSol-1; // down-left
          iStepped = true; solStepCnt = solStepCnt +1;
//     console.log('nWallC -Even: down-left'); 
        } 

        if(iStepped == false && (drCstat == 0) || (drCstat == 2)) // move down-right into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;      
          cell[iSol][jSol].swall4 = true;
          cell[iSol+1][jSol+1].swall1 = true;
          iSol = iSol+1; jSol = jSol + 1; // move down-right
          iStepped = true; solStepCnt = solStepCnt +1;
//     console.log('nWallC -Even: moved down-right'); 
        }      

        if(iStepped == false && (dCstat == 0) || (dCstat == 2)) // move down into an open cell
        { cell[iSol][jSol].isSealed = true;
          cell[iSol][jSol].inSol = false;       
          cell[iSol][jSol].swall5=true;
          cell[iSol+1][jSol].swall2=true;
          iSol = iSol+1; jSol = jSol;   // move down
          iStepped = true; solStepCnt = solStepCnt +1;
 //    console.log('nWallC -Even: moved down'); 
        }

    }

// ****************************************************

    if(nOpenC => 1 && iStepped == false){ // find an open (not-yet-in-solutiom) cell to move into

        if(uCstat == 0) // move up into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol-1; jSol = jSol;
          cell[iSol][jSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;     
    // if(iStepped == true){console.log('nOpenC -Odd: move up'); }
        }    

        if((iStepped == false) && (ulCstat == 0)) // move up-left into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol; jSol = jSol-1;
          cell[iSol][jSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
    // if(iStepped == true){console.log('nOpenC -Odd: move up-left'); } 
        }

        if((iStepped == false) && (urCstat == 0)) // move up-right into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol; jSol = jSol+1;
          cell[iSol][jSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
    // if(iStepped == true){console.log('nOpenC -Odd: move up-right'); } 
        }

        if((iStepped == false) && (dlCstat == 0)) // move down-left into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol-1;
          cell[iSol][jSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;    
    // if(iStepped == true){console.log('nOpenC -Odd: move down-left'); }
        }    

        if((iStepped == false) && (drCstat == 0)) // move down-right into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol+1;
          cell[iSol][jSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
    // if(iStepped == true){console.log('nOpenC -Odd: move down-right'); } 
        }

        if((iStepped == false) && (dCstat == 0)) // move down into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol;
          cell[iSol][jSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
    // if(iStepped == true){console.log('nOpenC -Odd: move down'); } 
        }
            
    } 

    if((nPathC => 1) && (iStepped == false)){ // find a "random" open (in-solutiom) cell to move into

        dice=int(random(0.,5.99));

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (uCstat == 2))// move up into an open cell (already in solution)
            {iSol = iSol-1; jSol = jSol;
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
    // if(iStepped == true){console.log('nPathC -Odd: move up'); } 

        break;

        case 1:
            if((iStepped == false) && (ulCstat == 2)) // move up-left into an open cell (already in solution)
            { iSol = iSol; jSol = jSol-1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
    // if(iStepped == true){console.log('nPathC -Odd: move up-left'); } 

        break;

        case 2:
            if((iStepped == false) && (urCstat == 2)) // move up-right into an open cell (already in solution)
            {iSol = iSol; jSol = jSol+1;
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
    // if(iStepped == true){console.log('nPathC -Odd: move up-right'); } 

        break;

        case 3:
         if((iStepped == false) && (dlCstat == 2))// move down-left into an open cell (already in solution)
            {iSol = iSol+1; jSol = jSol-1;
            cell[iSol][jSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
    // if(iStepped == true){console.log('nPathC -Odd: move down-left'); } 

        break;

        case 4:
            if((iStepped == false) && (drCstat == 2)) // move down-right into an open cell (already in solution)
            { iSol = iSol+1; jSol = jSol+1; 
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
    // if(iStepped == true){console.log('nPathC -Odd: move down-right'); } 

        break;

        case 5:
            if((iStepped == false) && (dCstat == 2)) // move down into an open cell (already in solution)
            {iSol = iSol+1; jSol = jSol; 
            cell[iSol][jSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
    // if(iStepped == true){console.log('nPathC -Odd: move down'); } 

        break;


        }
    }
}

// ****************
// END OF SECTION - IN AN 0DD CELL 
// *****************


    // Special conditions for some boundary cells


        cell[0][jTopIn].inSol = true;  // starting cell always in the solution path
        cell[0][jTopIn].isSealed = false; // enty cell can't be sealed or modified
        cell[0][jTopIn].swall2 = true; // entry top wall is always there - no easy escape
        cell[0][jTopIn].swall5 = false; // entry bottom wall is always missing
        cell[1][jTopIn].swall2 = false; // cell below top entry cell top wall is always open
        cell[1][jTopIn].inSol = true;  // starting cell always in the solution path
        cell[1][jTopIn].isSealed = false; // enty cell can't be sealed or modified       

        cell[nRows-1][jBotOut].swall5 = true;
        cell[nRows-1][jBotOut].swall2 = false;
        cell[nRows-1][jBotOut].isSealed = false;
        cell[nRows-2][jBotOut].isSealed = false;     

      if((iSol == nRows-2 && jSol == jBotOut) || (solStepCnt > 10000)) {iStopSolution = true;}

 //       if(iSol == nRows-2 && jSol == jBotOut) {iStopSolution = true;}

    } // end of solution search while

    iFindSolution = false;

}

    // end of function findSolution


//--------------------------------------------------------------
function drawSolution(){
//console.log('in drawSolution');
 // *********   
    // draw the path that solves the maze

    for(let i=0; i<nRows-1; i++){ //each row
        for (let j=0; j<nCols-1; j++) { // across the columns
           if (cell[i][j].inSol == true){
              fill(0,0,255);
              noStroke();
              ellipse(cell[i][j].xCntr,cell[i][j].yCntr,.8*base, .8*base);
           }                      
        }   
    }

    fill(0,255,0);
    noStroke();
    ellipse(cell[iSol][jSol].xCntr,cell[iSol][jSol].yCntr,.9*base,.9*base);

 // this next section would show the blocked out cells during the solution if you're interested
/*

  for(let i=0; i<=nRows-1; i++){ //each row
        for (let j=0; j<=nCols-1; j++) { // across the columns
           if (cell[i][j].isSealed == true){
              fill(255,0,0);
              noStroke();
              ellipse(cell[i][j].xCntr,cell[i][j].yCntr,4,4);
           }                      
        }   
    }
*/

    // end of function drawSolution
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

    if (key === 'q')
    {iStpUpLft = true;}
    
    if (key === 'a')
    {iStpDwnLft = true;}
    
    if (key === 'e')
    {iStpUpRgt = true;}
    
    if (key === 'd')
    {iStpDwnRgt = true;}
    
    if (key === 'w')
    {iStpUp = true;}
    
    if (key === 's')
    {iStpDwn = true;}

    if (key === '9') {iYou=0; jYou=jTopIn;}// return to starting position 

     return false;  
}

function mouseReleased() {

// function mouseClicked() {
   
    onBtnRefresh = refreshButton.buttonCheck();
    if(onBtnRefresh == true)
    {mReleased = true;}
    
    onBtnSave = saveButton.buttonCheck();
    if(onBtnSave == true)
    {iSaveMaze = true; onBtnSave = false; mPressed = false;}

    onBtnSolve = solveButton.buttonCheck();
    if(onBtnSolve == true)
    {iSolveMaze = true; onBtnSolve = false; mPressed = false;}
 
    if(uPButton.buttonCheck() == true){iStpUp = true; mPressed = false;}
    if(dNButton.buttonCheck() == true){iStpDwn = true; mPressed = false;}
    if(uPLButton.buttonCheck() == true){iStpUpLft = true; mPressed = false;}
    if(dNLButton.buttonCheck() == true){iStpDwnLft = true; mPressed = false;}
    if(uPRButton.buttonCheck() == true){iStpUpRgt = true; mPressed = false;}
    if(dNRButton.buttonCheck() == true){iStpDwnRgt = true; mPressed = false;}

 return (false);
}

//****************************************************************************
//****************************************************************************

class Cell {
  constructor(xCntr,yCntr,s,wall1,wall2,wall3,wall4,wall5,wall6,inM,
            swall1,swall2,swall3,swall4,swall5,swall6,isSealed,inSol) {
    
    this.xCntr = xCntr;
    this.yCntr = yCntr;
    this.s = s; // s is base in buildMaze
    this.wall1 = wall1;
    this.wall2 = wall2;
    this.wall3 = wall3;
    this.wall4 = wall4;
    this.wall5 = wall5;
    this.wall6 = wall6;
    this.inM = inM;
    this.swall1 = swall1;
    this.swall2 = swall2;
    this.swall3 = swall3;
    this.swall4 = swall4;
    this.swall5 = swall5;
    this.swall6 = swall6;
    this.isSealed = isSealed;
    this.inSol = inSol;


    let fac = int(.866*float(base));
    
    this.x1 = this.xCntr - this.s; this.x2 = this.xCntr - this.s/2; 
    this.x3 = this.xCntr+this.s/2;
    this.x4 = this.xCntr + this.s; this.x5 = this.xCntr + this.s/2; 
    this.x6 = this.xCntr-this.s/2;
    this.y1 = this.yCntr; this.y2 = this.yCntr - fac; 
    this.y3 = this.yCntr - fac;
    this.y4 = this.yCntr; this.y5 = this.yCntr + fac; 
    this.y6 = this.yCntr + fac;
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
    if(this.wall4 == true){line(this.x4,this.y4,this.x5,this.y5);}
    if(this.wall5 == true){line(this.x5,this.y5,this.x6,this.y6);}
    if(this.wall6 == true){line(this.x6,this.y6,this.x1,this.y1);}  
  }

  drawBorder(bColor) {
    if(bColor == 0){fill(0,0,0);}
    if(bColor == 1){fill(255,0,0);}
    noStroke(0);

    beginShape();
     vertex(this.x1,this.y1);
     vertex(this.x2,this.y2);
     vertex(this.x3,this.y3);
     vertex(this.x4,this.y4);
     vertex(this.x5,this.y5);
     vertex(this.x6,this.y6);
    endShape(CLOSE);
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
        {ellipse(this.xCntr,this.yCntr,0.7*this.dotSize,0.7*this.dotSize);}
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
    fill(0,0,0);
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
    rect(this.xpos,this.ypos,this.bw,this.bh);

    fill(0);textSize(13); 
    text(this.nam, this.xpos + (.01*this.bw), this.ypos + (.75*this.bh));
 //   console.log(this.mOnBut);
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
