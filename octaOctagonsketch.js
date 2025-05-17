/* 

revised as of 10/26/23

updated for website
 - added letter-key operation for keyboard
 - added buttons for mouse or touch 

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

let iBuildMaze,iDrawMaze, iRefresh, iSaveMaze, iSolve1Maze, iSolve2Maze,iDrawPath;
let refreshX, refreshY, refreshBoxh, refreshBoxw;
let reSaveX, reSaveY, reSaveBoxh, reSaveBoxw;

    // stuff for solving the maze
    
let iStpUpLft, iStpUpRgt, iStpDwnLft, iStpDwnRgt, iStpUp,iStpDwn,iStpLft,iStpRgt;
let iYou,jYou;
let youSize;

let dotColor,mLineW;
let visitedDotColor;
let fac1,fac2,fac3;
let n3;
    
    // stuff for solve buttons
let uPButton,dNButton,rButton,lButton,uPRButton,dNRButton,uPLButton,dNLButton;
    
    // stuff for the refresh buttons
let refreshButton,saveButton,solve1Button,solve2Button;
    
let onBtnRefresh,onBtnSave,onBtnSolve1,onBtnSolve2;
let s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13;
let mPressed;
    

// <<<<<<<<<<< end of variables >>>>>>>>>
 
function setup() { 

  // size and center the maze based upon the number of cells
    createCanvas(1024,770);
    background(255);
    
    originX = .075*width; originY = .06*height;
    
    xLeftUpCornerMaze = originX; yLeftUpCornerMaze = originY;
    
    nColsMin = 12; nColsMax = 44; //number of columns must be an even #

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
    
    iStpUpLft=false; iStpDwnLft=false; iStpUpRgt=false; iStpDwnRgt=false; iStpUp=false; iStpDwn=false; iStpLft=false; iStpRgt=false;

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


    if(refreshButton.buttonCheck() == true && mouseIsPressed == true) 
      {iBuildMaze = true; }

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
        // the nCols must be even number multiples of 3 
        let ifacsize= int(((sizeBar.getPos()-1070)/150)*12);
        if ((ifacsize % 2)>0){ifacsize = ifacsize-1;}
        nCols = 3*ifacsize+12;
        nRows = nCols;
        n3=int(nCols/3);
        
        side = .84*height/nRows;
        spacer = side;
        
        buildMaze();
        iBuildMaze = false;

        jTopIn = nCols/2;
        jBotOut = nCols/2;
        fac1 = originX+jTopIn*spacer;
        fac2 = originX+jBotOut*spacer;
        fac3 = originY+nRows*spacer;;
        arrowTop= new Arrow(0,fac1, .02*height+20, 20, 4);
        arrowBot= new Arrow(1,fac2, fac3+10,20, 4);
        iYou=1; jYou=jTopIn; // start you at the entrance
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
            cell[i][j]= new Cell(originX+j*side,(originY+side/2)+i*side,side,true,true,true,true,true,true,true,true,false,false,false);
        }
    }

    // initialize all the cell center locations for solution paths
    for(let i=0; i<nRows; i++){ //each row starting at top row
        pathCellIndx[i]=[];
        for (let j=0; j<nCols; j++) { // across the columns
            pathCellIndx[i][j] = new Path(cell[i][j].xCntr,cell[i][j].yCntr,false,nRows);
        }
    }

    // remove the "corners" of the square to construct an octagon

    // set all the boundary cells to inactive and "corner"
    for(let i=0; i<nRows; i++){ //each row
        for (let j=0; j<nCols; j++) { // across the columns
            // block out all edge cells and make them inactive i.e. can't be eliminated when opening the maze
            if(i==0 ||i==nRows-1 || j==0 || j==nCols-1)
            {cell[i][j].inM = true;cell[i][j].iCorner = true;}
        }
    }
    
    // set the internal corner cells active and label as corner cells - i.e. they won't be included in the maze
    for(let i=1; i<n3; i++){ //upper left and right corner
        for(let jleft=1; jleft<n3-i+1; jleft++){
            cell[i][jleft].inM = true; cell[i][jleft].iCorner = true;}
        for(let js=0;js < n3-i;js++){
            let jright=(2*n3-1)+i+js;
            cell[i][jright].inM = true;cell[i][jright].iCorner = true;}
    }
    for(let idum=0; idum <=n3-1; idum++){ //lower left and right corner
        let i=idum+(2*n3-1);
        for(let jleft=1; jleft <= idum; jleft++){
            cell[i][jleft].inM = true; cell[i][jleft].iCorner = true;}
        for(let jright=nCols-1-idum;jright < nCols-1;jright++){
            cell[i][jright].inM = true; cell[i][jright].iCorner = true;}
    }
    
    // block out all edge cells so they are not in maze but will be shown as edges

    // block out top edge
    for (let j=n3-1; j <= 2*n3; j++) { // across the columns
        cell[0][j].inM = true; cell[0][j].iEdge = true;
    }
   
    // block out bottom edge
    for (let j=n3-1; j <= 2*n3; j++) { // across the columns
        cell[nRows-1][j].inM = true; cell[nRows-1][j].iEdge = true;
    }
    
    // block out left edge
    for (let i=n3-1; i <= 2*n3; i++) { // across the columns
        cell[i][0].inM = true; cell[i][0].iEdge = true;
    }
    
    // block out right edge
    for (let i=n3-1; i <= 2*n3; i++) { // across the columns
        cell[i][nCols-1].inM = true; cell[i][nCols-1].iEdge = true;
    }
    
    // block out upper left corner edge
    for (let i=1; i<=n3-1;i++){
        cell[i][n3-i].iEdge = true;
        cell[i][n3-i-1].iEdge = true;
    }

    // block out lower left corner edge
    for (let i=2*n3; i<=nRows-2;i++){            
        cell[i][(i-(2*n3))+1].iEdge = true;
        cell[i+1][(i-(2*n3))+1].iEdge = true;      
    }
  
    // block out upper right corner edge
    for (let i=1; i<n3;i++){
        cell[i][2*n3+i-1].iEdge = true;
        cell[i][2*n3+i].iEdge = true;      
    }
    
    // block out lower right corner edge
    for (let i=2*n3; i<=nRows-2;i++){
        cell[i][(nCols-2)-(i-2*n3)].iEdge = true;
        cell[i+1][(nCols-2)-(i-(2*n3))].iEdge = true;
    }   

    // block out all edge cells and make them inactive i.e. can't be eliminated when opening the maze
    for(let i=0; i<nRows; i++){ //each row
        for (let j=0; j<nCols; j++) { // across the columns
            if(i==0 ||i==nRows-1 || j==0 || j==nCols-1)
            { cell[i][j].inM = true;}
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
    iSolve1Maze = false;
    iSolve2Maze = false;

    // end of buildMaze
}
//-----------------------------------------------------------------------------

// EASY SOLUTION ALGORITHM

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

    // end of function solve2Maze
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
            if(cell[i][j].iEdge == true || cell[i][j].iCorner == true)
            { ;}
            else
            {cell[i][j].displayCell(2);}
        }
    }
    
 // black out boarder cells   
    for(let i=0; i<nRows; i++){ //each row
        for (let j=0; j<nCols; j++) { // across the columns
            if(cell[i][j].iEdge == true)
            {cell[i][j].drawBorder();}
        }
    }   
   
    // add entrance and exit
    fill(255,255,255);
    noStroke();
    let d=side/(1.+2*cos(45));
    rect(cell[0][jTopIn].xCntr-d/2, cell[0][0].yCntr-side, d, 2*side);
    rect(cell[nRows-1][jBotOut].xCntr-d/2, cell[nRows-1][0].yCntr-side, d, 3*side);

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
function keyTyped(){

    if (key == '1') 
    {iBuildMaze = true;}
    
    if (key == '2') 
    {iSaveMaze = true;}
    
    if (key == '3') 
    {iSolveMaze = true;}
  
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
function mousePressed(){

    mPressed = true;
    
    onBtnRefresh = refreshButton.buttonCheck();
    if(onBtnRefresh == true)
    {iBuildMaze = true;}
    
    onBtnSave = saveButton.buttonCheck();
    if(onBtnSave == true)
    {iSaveMaze = true;}
    
    onBtnSolve1 = solve1Button.buttonCheck();
    if(onBtnSolve1 == true)
    {iSolve1Maze = true;
    }
    
    onBtnSolve2 = solve2Button.buttonCheck();
    if(onBtnSolve2 == true)
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
    
}
// end of function mosusePresed

//--------------------------------------------------------------
function mouseReleased(){
    mPressed = false;
    
}

//****************************************************************************
//****************************************************************************

class Cell {

constructor(xCntr, yCntr, side, wall0, wall1, wall2, wall3,wall4, wall5, wall6, wall7, inM, iCorner, iEdge) {
    
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
    this.inM = inM;
    this.iCorner = iCorner;
    this.iEdge = iEdge;
    
    let fac=(side/(1.+2.*cos(45))/2.);
    
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
    if(nRows>30){this.lineW =1;}
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
