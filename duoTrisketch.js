/* 

revised as of 10/28/24

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
let cPi = [];let cPj=[]; let cPk=[];
let xCor=[];let yCor=[];
let xCntr=[]; let yCntr=[];
let pCelli=[]; pCellj=[]; 
   
let nCols,nRows;
let nRowsMin;
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
let kInDoor, kOutDoor;
let jTopIn, jBotOut;
let jEven;
let fac1,fac2,fac3,fac4;
let mPressed;
    
let originX, originY;
let size;
let side;


let iDrawMaze,iBuildMaze,iSolveMaze,iDrawPath,iSaveMaze;
let iFindSolution,iSolution,iShowSolution,iHideSolution,iSolved;
let iSolStart,jSolStart,iStepped,iStopSolution;
let solStepCnt, dFacing, dFacingEntered;
let iDrawSolution;
let lCstat,rCstat,uCstat,dCstat,drStat,urStat,dlStat,ulStat;
let nOpenC, nPathC, nWallC;
let dice;
let mReleased;
    
 // stuff for the buttons
let refreshX, refreshY, refreshBoxh, refreshBoxw;
let reSaveX, reSaveY, reSaveBoxh, reSaveBoxw;
let onBtnRefresh,onBtnSave,onBtnSolve;
let logic1,logi2,logic3;
let arrowL;
    
 // stuff for solving the maze   
  let iStepUp, iStepDwn, iStepRgt, iStepLft;
  let iYou,jYou;
  let youSize;
  let dotSize;
  let solDotSize;

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
  
    originX = .05*width; originY = .05*height;
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


  nRowsMin = 10;  // basic = 10

  onBtnRefresh = false; onBtnSave = false;

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

        jTopIn = int(random(2,nCols-2));
        jBotOut = int(random(2,nCols-2));
        if(jTopIn % 2 == 0){kInDoor = 0;}
        else{kInDoor = 1;}
        if(jBotOut % 2 == 0){kOutDoor = 1;}
        else{kOutDoor = 0;} 

        fac1 = originX+jTopIn*side+side/2;
        fac2 = originX+jBotOut*side+side/2;
        fac3 = originY+nRows*side+5;
        fac4 = originY-22;
        arrowTop = new Arrow(fac1, fac4, 4);
        arrowBot = new Arrow(fac2, fac3, 4);

        iYou=0; jYou=jTopIn; kYou=0; // set your starting position        
       
        // open access to In and Out cells
        cell[iYou][jTopIn][0].wall = true;
        cell[iYou][jTopIn][0].wall3 = false;
        cell[iYou][jTopIn][1].wall3 = false;
        cell[iYou][jTopIn][1].wall2 = false;   
        cell[iYou+1][jTopIn][0].wall2 = false;
        
        cell[nRows-1][jBotOut][0].wall2 = false;
        cell[nRows-1][jBotOut][0].wall3 = false;
        cell[nRows-1][jBotOut][1].wall3 = false;
        cell[nRows-2][jBotOut][1].wall2 = false;

       findSolution(); 
       iFindSolution = false;   
    }

    if(iDrawMaze == true){
        drawMaze(); 
        arrowTop.displayArrow();
        arrowBot.displayArrow();
    }
       
    if(iShowSolution == true){
        drawSolution();
    }

    if(iSolveMaze == true){
        solveMaze();
        drawPath();}
      
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

  iBuildMaze = true; iDrawMaze = true; iSolveMaze = false; 
  iDrawPath = false; iSaveMaze = false;
  iFindSolution = false; iDrawSolution = false; iHideSolution =  true;
  iShowSolution = false;
  iSolved = false;

    nRows = nRowsMin + int(((sizeBar.getPos()-913)/150)*55);
    if(nRows % 2 == 0){nRows = nRows+1;}  // need odd number of rows/columns

    nCols = nRows;
    side = .85*height/nRows;

    dotSize = 0.7*side;

// define the cell objects

// compute positions of the upper left corner of all the square cells
// that contain two right triangles with equal orthogonal sides
// i index used for "y" position - i.e. horizontal row number
// j index used for "x" position - i.e. vertical column number

    
    for(let n=0; n<= nCols; n++){ //each column has same x coordinate 
        xCor[n] = originX + n * side;}
    for (let n=0; n<= nRows; n++) { // each row has the same y coodinate down a column
        yCor[n] = originY + n * side;}
    
 
    // initialize all the cell objects -  
    for(let i=0; i<nRows; i++){ //each row starting at top row
        cell[i]=[];
        pathCellIndx[i]=[];
        for (let j=0; j<nCols; j++) { // across the columns
            cell[i][j]=[];
            pathCellIndx[i][j]=[];
            for(let k=0; k<2; k++){ //within the square duo cell
                cell[i][j][k]=[];
                pathCellIndx[i][j][k]=[];
            }
        }
    }

    // initialize all the triangle cell object parameters for a new maze
    for(let i=0; i<nRows; i++){ //each row starting at top row
        for (let j=0; j<nCols; j++) { // across the columns
            for(let k=0; k<2; k++){
                if((i+j) % 2 == 0) {jEven = true;}
                else{jEven = false;}
                cell[i][j][k]= new Cell(i,j,k,xCor[j],yCor[i],side,jEven,true,true,true,false,
                    true,true,true,false,false);
            
               // console.log(i,j,k,jEven);
            }
        }
    }
    
    // initialize all the cell center locations for solution paths
    for(let i=0; i<nRows; i++){ //each row starting at top row
        for (let j=0; j<nCols; j++) { // across the columns
            for(let k =0; k<2; k++){
                pathCellIndx[i][j][k]= new Path(cell[i][j][k].xCntr,cell[i][j][k].yCntr,false,dotSize);
            }
        }
    }


    // block out edge boarder cells and make them inactive i.e. can't be eliminated when opening the maze
    for (let j=0;j<=nCols-1;j++){  // top and bottom boarders
        cell[0][j][0].inM = true;
        cell[nRows-1][j][1].inM = true;
    }

    for (let i=0;i<=nRows-1;i++){
        if(i % 2 == 0){  // left wall boarder
            cell[i][0][0].inM = true;
            cell[i][nCols-1][1].inM = true;}
        if(i % 2 != 0){  // right wall boarder
            cell[i][0][1].inM = true;
            cell[i][nCols-1][0].inM = true;}
    }

    
    // count the number of cells in maze to make active
    numInactiveCells = 0;
    for(let i=0; i<nRows; i++){ //each row starting at top row
        for (let j=0; j<nCols; j++) { // across the columns
            for(let k=0; k<2; k++){
                if(cell[i][j][k].inM == false){
                    numInactiveCells++;
                };
            }
        }
    }
    
    // select an interior cell at random as the maze starting point
    cCj= int(random(3,(nCols-3)));
    cCi= int(random(3,(nRows-3)));
    cCk= int(random(0,1.999));
    cell[cCi][cCj][cCk].inM = true;
    numInactiveCells = numInactiveCells - 1;
    inActiveCellsLeft = true; // variable is true as long as there are ininM cells
    
    // initialize path tracking paramater arrays
    cPi[0]=cCi; cPj[0]=cCj; cPk[0]=cCk;
    cPi[1]=cCi; cPj[1]=cCj; cPk[1]=cCk;
    cPindex = 1;
   
    // begin the depth first search algorithm to eliminate maze walls and create the maze
    while (numInactiveCells > 0 && cPindex > 0) {

    // determine if your current cell is EVEN (i +j = even)
    // or ODD (i + j = odd) and what is the cCk - 0 or 1
        
      //  ***************************

        if((cCi+cCj)%2 == 0 && cCk == 0){  // you're in EVEN cell and cCk=0
        
        if(!cell[cCi][cCj-1][0].inM || !cell[cCi-1][cCj][1].inM || !cell[cCi][cCj][1].inM)
        {rollDice=true;}  // there is someplace to move to
        
        else { // no inactive cells available for a move
            cCi=cPi[cPindex-1];
            cCj=cPj[cPindex-1];
            cCk=cPk[cPindex-1];
            cPindex=cPindex-1;
            rollDice = false;}
        
        while(rollDice){
            iMove=int(random(1.,3.99));
            
            if(iMove == 1 && !cell[cCi][cCj-1][0].inM) { // cell left - wall 1
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                cell[cCi][cCj][0].wall1 = false;  // current cell
                cell[cCi][cCj-1][0].wall1 = false; // neighboor and next cell in maze
                cCj = cCj-1; cCk =0;
                cell[cCi][cCj][cCk].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 2 && !cell[cCi-1][cCj][1].inM) {  // cell above- wall 2
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                cell[cCi][cCj][0].wall2 = false;  // current cell
                cell[cCi-1][cCj][1].wall2 = false; // neighboor and next cell
                cCi=cCi-1; cCk=1;
                cell[cCi][cCj][cCk].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
            
            else if(iMove == 3 && !cell[cCi][cCj][1].inM) { // lower right triangle
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                cell[cCi][cCj][0].wall3 = false;  // current cell
                cell[cCi][cCj][1].wall3 = false; // neighboor and next cell
                cCk=1;
                cell[cCi][cCj][cCk].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice=false;}
            }
        }

       // end of EVEN - cCk = 0 cell breakout
      //  ***************************
        
            if((cCi+cCj)%2 == 0 && cCk == 1){  // you're in EVEN cell and cCk=1
                
                if(!cell[cCi][cCj+1][1].inM || !cell[cCi+1][cCj][0].inM || !cell[cCi][cCj][0].inM)
                {rollDice=true;}  // there is someplace to move to
                
                else { // no inactive cells available for a move
                    cCi=cPi[cPindex-1];
                    cCj=cPj[cPindex-1];
                    cCk=cPk[cPindex-1];
                    cPindex=cPindex-1;
                    rollDice = false;}
                
                while(rollDice) { // roll the dice to find a door to open
                    
                    iMove=int(random(1.,3.99));
                    
                    if(iMove == 1 && !cell[cCi][cCj+1][1].inM) { // cell right - wall 1
                        cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                        cell[cCi][cCj][1].wall1 = false;  // current cell
                        cell[cCi][cCj+1][1].wall1 = false; // neighboor and next cell in maze
                        cCj = cCj+1; cCk =1;
                        cell[cCi][cCj][cCk].inM = true;
                        numInactiveCells = numInactiveCells -1;
                        rollDice = false;}
                    
                    else if(iMove == 2 && !cell[cCi+1][cCj][0].inM) {  // cell below- wall 2
                        cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                        cell[cCi][cCj][1].wall2 = false;  // current cell
                        cell[cCi+1][cCj][0].wall2 = false; // neighboor and next cell
                        cCi=cCi+1; cCk=0;
                        cell[cCi][cCj][cCk].inM = true;
                        numInactiveCells = numInactiveCells -1;
                        rollDice = false;}
                    
                    else if(iMove == 3 && !cell[cCi][cCj][0].inM) { // upper left triangle
                        cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                        cell[cCi][cCj][1].wall3 = false;  // current cell
                        cell[cCi][cCj][0].wall3 = false; // neighboor and next cell
                        cCk=0;
                        cell[cCi][cCj][cCk].inM = true;
                        numInactiveCells = numInactiveCells -1;
                        rollDice=false;}
                }
            }
      // end of EVEN - cCk = 1 cell breakout
      //  ***************************

                if((cCi+cCj)%2 != 0 && cCk == 0){  // you're in ODD cell and cCk=0
                    
                    if(!cell[cCi][cCj+1][0].inM || !cell[cCi-1][cCj][1].inM || !cell[cCi][cCj][1].inM)
                    {rollDice=true;}  // there is someplace to move to
                    
                    else { // no inactive cells available for a move
                        cCi=cPi[cPindex-1];
                        cCj=cPj[cPindex-1];
                        cCk=cPk[cPindex-1];
                        cPindex=cPindex-1;
                        rollDice = false;}
                    
                    while(rollDice) { // roll the dice to find a door to open
                        
                        iMove=int(random(1.,3.99));
                        
                        if(iMove == 1 && !cell[cCi][cCj+1][0].inM) { // cell to the right - wall 1
                            cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                            cell[cCi][cCj][0].wall1 = false;  // current cell
                            cell[cCi][cCj+1][0].wall1 = false; // neighboor and next cell in maze
                            cCj = cCj+1; cCk=0;
                            cell[cCi][cCj][cCk].inM = true;
                            numInactiveCells = numInactiveCells -1;
                            rollDice = false;}
                        
                        else if(iMove == 2 && !cell[cCi-1][cCj][1].inM) {  // cell above - wall 2
                            cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                            cell[cCi][cCj][0].wall2 = false;  // current cell
                            cell[cCi-1][cCj][1].wall2 = false; // neighboor and next cell
                            cCi=cCi-1; cCk=1;
                            cell[cCi][cCj][cCk].inM = true;
                            numInactiveCells = numInactiveCells -1;
                            rollDice = false;}
                        
                        else if(iMove == 3 && !cell[cCi][cCj][1].inM) { // lower left triangle
                            cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                            cell[cCi][cCj][0].wall3 = false;  // current cell
                            cell[cCi][cCj][1].wall3 = false; // neighboor and next cell
                            cCk=1;
                            cell[cCi][cCj][cCk].inM = true;
                            numInactiveCells = numInactiveCells -1;
                            rollDice=false;}
                    }
                }
        // end of ODD - cCk = 0 cell breakout
        //  ***************************
        
            if((cCi+cCj)%2 != 0 && cCk == 1){  // you're in ODD cell and cCk=1
                        
                if(!cell[cCi][cCj-1][1].inM || !cell[cCi+1][cCj][0].inM || !cell[cCi][cCj][0].inM)
                    {rollDice=true;}  // there is someplace to move to
                        
                else { // no inactive cells available for a move
                    cCi=cPi[cPindex-1];
                    cCj=cPj[cPindex-1];
                    cCk=cPk[cPindex-1];
                    cPindex=cPindex-1;
                    rollDice = false;}
                        
                while(rollDice) { // roll the dice to find a door to open
                            
                    iMove=int(random(1.,3.99));
                            
                    if(iMove == 1 && !cell[cCi][cCj-1][1].inM) { // cell to the left- wall 1
                        cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                        cell[cCi][cCj][1].wall1 = false;  // current cell
                        cell[cCi][cCj-1][1].wall1 = false; // neighboor and next cell in maze
                        cCj = cCj-1; cCk =1;
                        cell[cCi][cCj][cCk].inM = true;
                        numInactiveCells = numInactiveCells -1;
                        rollDice = false;}
                            
                    else if(iMove == 2 && !cell[cCi+1][cCj][0].inM) {  // cell below- wall 2
                        cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                        cell[cCi][cCj][1].wall2 = false;  // current cell
                        cell[cCi+1][cCj][0].wall2 = false; // neighboor and next cell
                        cCi=cCi+1; cCk=0;
                        cell[cCi][cCj][cCk].inM = true;
                        numInactiveCells = numInactiveCells -1;
                        rollDice = false;}
                            
                    else if(iMove == 3 && !cell[cCi][cCj][0].inM) { // upper right triangle
                        cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj; cPk[cPindex]=cCk;
                        cell[cCi][cCj][1].wall3 = false;  // current cell
                        cell[cCi][cCj][0].wall3 = false; // neighboor and next cell
                        cCk=0;
                        cell[cCi][cCj][cCk].inM = true;
                        numInactiveCells = numInactiveCells -1;
                        rollDice=false;}
                }             
            }   // end of ODD - cCk = 1 cell breakout 

    }  // end wall breakout process - the maze is complete
    
    iBuildMaze = false;
    iSolveMaze = false;
    iDrawMaze = true;
  
}


//-----------------------------------------------------------------------------

function solveMaze(){
    // build a path to move through the maze
    
    if((iYou+jYou) % 2 == 0 & kYou == 0){moveMe = 1;}// in EVEN cell with k=0
    if((iYou+jYou) % 2 == 0 & kYou == 1){moveMe = 2;} // in EVEN cell with k=1
    if((iYou+jYou) % 2 != 0 & kYou == 0){moveMe = 3;}; // in ODD cell with k=0
    if((iYou+jYou) % 2 != 0 & kYou == 1){moveMe = 4;}; // in ODD cell with k=1
        
    switch (moveMe){
            //  in EVEN cell with k=0
        case 1:
            if(iStepUp == true){
                if (cell[iYou][jYou][kYou].wall2 == true)
                    {iStepUp=false;}
                else{iYou=iYou-1; kYou=1; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepUp = false;}
            }
        
            if(iStepDwn == true || iStepRgt == true){
                if (cell[iYou][jYou][kYou].wall3 == true)
                    {iStepDwn=false; iStepRgt=false;}
            else{kYou=1; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepDwn=false; iStepRgt=false;}
            }
        
            if(iStepLft == true){
                if (cell[iYou][jYou][kYou].wall1 == true)
                    {iStepLft=false;}
                else{jYou=jYou-1; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepLft = false;}
            }
        break;
            
            // in EVEN cell with k=1
        case 2:
            if(iStepUp == true || iStepLft == true){
                if (cell[iYou][jYou][kYou].wall3 == true)
                    {iStepUp=false; iStepLft=false;}
            else{kYou=0; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepUp = false;iStepLft=false;}
            }
            
            if(iStepRgt == true){
                if (cell[iYou][jYou][kYou].wall1 == true){
                    iStepRgt=false;}
                else{jYou=jYou+1; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepRgt=false;}
            }
            
            if(iStepDwn == true){
                if (cell[iYou][jYou][kYou].wall2 == true)
                    {iStepDwn=false;}
                else{iYou=iYou+1; kYou=0; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepDwn = false;}
            }
        break;

            // in ODD cell with k=0
        case 3:
            if(iStepUp == true){
                if (cell[iYou][jYou][kYou].wall2 == true)
                    {iStepUp=false;}
                else{iYou=iYou-1; kYou=1; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepUp = false;}
                }
                
            if(iStepDwn == true || iStepLft == true)
                {if (cell[iYou][jYou][kYou].wall3 == true)
                    {iStepDwn=false; iStepLft=false;}
                else{kYou=1; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepDwn=false; iStepLft=false;}
                }
                
            if(iStepRgt == true)
                {if (cell[iYou][jYou][kYou].wall1 == true)
                    {iStepRgt=false;}
                else{jYou=jYou+1; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepRgt = false;}
                }
        break;

            // in ODD cell with k=1
        case 4:
            if(iStepUp == true || iStepRgt == true){
                if (cell[iYou][jYou][kYou].wall3 == true)
                {iStepUp=false; iStepRgt=false;}
                else{kYou=0; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepUp = false;iStepRgt=false;}
                }
                
            if(iStepLft == true){
                if (cell[iYou][jYou][kYou].wall1 == true){
                    iStepLft=false;}
                else{jYou=jYou-1; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepLft=false;}
                }
                
            if(iStepDwn == true){
                if (cell[iYou][jYou][kYou].wall2 == true)
                    {iStepDwn=false;}
                else{iYou=iYou+1; kYou=0; pathCellIndx[iYou][jYou][kYou].inPath=true; iStepDwn = false;}
                }
            break;
    }
    
    // end of function solveMaze
}   

//--------------------------------------------------------------
function drawMaze(){
    // draw the completed maze

    // draw the completed maze internal cells
    for(let i=0; i<nRows; i++){ //each row
        for (let j=0; j<nCols; j++) { // across the columns
            for(let k=0; k<2 ;k++){
            cell[i][j][k].displayCell();
            }
        }
    }
    
    // black out all alternating edge triangles to create the maze boarder
    // tag these cells as sealed for the "solution" process

    for (let j=0;j<=nCols-1;j++){  // top and bottom boarders
        cell[0][j][0].drawBoarder();
        cell[nRows-1][j][1].drawBoarder();

        cell[0][j][0].isSealed = true;
        cell[0][j][0].swall3 = true;
        cell[nRows-1][j][1].isSealed = true;
        cell[nRows-1][j][1].swall3 = true;
    }

    for (let i=0; i<=nRows-1; i++){
        if(i % 2 == 0){  // left wall boarder
            cell[i][0][0].drawBoarder();
            cell[i][nCols-1][1].drawBoarder();

            cell[i][0][0].isSealed = true;
            cell[i][0][0].swall3 = true;
        }


        if(i % 2 != 0){  // right wall boarder
            cell[i][0][1].drawBoarder();
            cell[i][nCols-1][0].drawBoarder();

            cell[i][0][1].isSealed = true;
            cell[i][0][1].swall3 = true;
        }
    }

    // position maze openings
    fill(255);
    noStroke();
    if(jTopIn % 2 == 0 ) // an EVEN cell
        {rect(cell[0][jTopIn][0].x2-1, cell[0][jTopIn][0].y2-1, side+2, side+2);}
    if(jTopIn % 2 != 0 ) // an ODD cell
        {rect(cell[0][jTopIn][0].x3-1, cell[0][jTopIn][0].y3-1, side+2, side+2);}
    
    if(jBotOut % 2 == 0) // an EVEN cell
        {rect(cell[nRows-1][jBotOut][0].x2-1,cell[nRows-1][jBotOut][0].y2-1,side+2,side+3);}
    if(jBotOut % 2 != 0) // an ODD cell
        {rect(cell[nRows-1][jBotOut][0].x3-1,cell[nRows-1][jBotOut][0].y3-1,side+2,side+3);}

    // end of function drawMaze
}


//--------------------------------------------------------------
function drawPath(){
    // draw the path through the maze
    
    // mark your staring point in the maze
    pathCellIndx[0][jTopIn][0].inPath = true;
    fill(0,200,0);
    noStroke(); 
    ellipse(pathCellIndx[0][jTopIn][0].xCntr, pathCellIndx[0][jTopIn][0].yCntr,.7*dotSize,.7*dotSize);   
 
   
    // mark all cells visited so far!
    for(let i=0; i<=nRows-1; i++){ //each row
        for (let j=0; j<nCols-1; j++) { // across the columns
            for(let k=0; k<2;k++){
                if(i == 0 && j == jTopIn && k == 0)
                    { ;} // don't mark entry cell
                else{pathCellIndx[i][j][k].markCell();}
            }   
        }
    }

    if(iYou == nRows-1 && jYou == jBotOut && kYou == 1){
        fill(0, 0, 255);
        ellipse(pathCellIndx[iYou][jYou][kYou].xCntr, pathCellIndx[iYou][jYou][kYou].yCntr,.65*dotSize,.65*dotSize);}

    else{ 
        fill(0,200,0); 
        ellipse(pathCellIndx[iYou][jYou][kYou].xCntr, pathCellIndx[iYou][jYou][kYou].yCntr,.65*dotSize,.65*dotSize);}

    // end of function drawPath
}

//--------------------------------------------------------------


function findSolution(){
    // define all walls in the original maze as the starting configuration for the solution maze

    for(let i=0; i<= nRows-1; i++){ //each row
        for (let j=0; j<= nCols-1; j++) { // across the columns
            for(let k=0; k<=1; k++){ //within the square duo cell
                cell[i][j][k].swall1 = cell[i][j][k].wall1;
                cell[i][j][k].swall2 = cell[i][j][k].wall2;
                cell[i][j][k].swall3 = cell[i][j][k].wall3;
                }                        
        }   
    }

// label all of the solid edge cells as sealed

    for (let j = 0; j<= nCols-1; j++){  // top and bottom boarders
        cell[0][j][0].isSealed = true;
        cell[nRows-1][j][1].isSealed = true;
    }

    for (let i = 0;i <= nRows-1;i++){ // left wall boarder
        if( i % 2 == 0){  // an even cell
            cell[i][0][0].isSealed = true;
        }
        if( i % 2 !== 0){  // an odd cell
            cell[i][0][1].isSealed = true;
        }
    }
    
    for (let i = 0;i <= nRows-1;i++){ // right wall boarder
        if( i % 2 == 0){  // an even cell
            cell[i][nCols-1][1].isSealed = true;
        }
        if( i % 2 !== 0){  // an odd cell
            cell[i][nCols-1][0].isSealed = true;
        }
    }


    // goal is move through the maze and add walls to seal off dead ends

    // find the path that solves the maze 
    iSol = 0; jSolStart = jTopIn; kSol = 0;// start in the maze in the entry cell on the top boarder


    cell[0][jSolStart][0].inSol = true;  // starting cell is always in the solution path 
    cell[0][jSolStart][0].isSealed = false; // and the starting cell can't be sealed   
    solStepCnt = 0; 
    iStopSolution = false;
    jSol = jSolStart;

// Start a exhaustive search through maze and "seal" dead-end cells as you go

 //   starting from the entrance cell - using the status of the cells around you
 //   decide which way to move.
 //   the up, down, left and right wall designation is relative to the point you are
 //   in the "maze" - not the direction you are facing/moving.

// console.log(' start at ','iSol-',iSol,' jSol-',jSol,' kSol-',kSol);

 while(iStopSolution == false) {

    iStepped = false;   // only 1 "Step" is permitted on each pass through the while loop

//console.log(' top of while loop ',cell[iSol][jSol][kSol].jEven,' ', kSol);

// ****************
// NEXT SECTION - IN AN EVEN - 0 CELL 
// *****************

if(cell[iSol][jSol][kSol].jEven == true  && kSol == 0){ 

// currently in an Even-0 cell         

// console.log('start Even-0 cell - ',iSol,jSol,kSol);        

//  determine status of neighbor cells of the current Even-0 cell
//   Cstat values: 0 - open, 1 - wall, 2 - open and inPath

    // up Cell
    uCstat = 0; // assume up Cell is open unless
    if (iSol == 0){uCstat = 1;}  // you are in the top row
    else{
        if(cell[iSol-1][jSol][1].swall2 == true){uCstat = 1;}
        if((cell[iSol-1][jSol][1].inSol == true) && (cell[iSol-1][jSol][1].swall2 == false)){uCstat = 2;}
    }
    // left Cell
    lCstat = 0; // assume left Cell is open unless
    if(cell[iSol][jSol-1][0].swall1 == true){lCstat = 1;}
    if((cell[iSol][jSol-1][0].inSol == true) && (cell[iSol][jSol-1][0].swall1 == false)) {lCstat = 2;}
    // down-right Cell
    drCstat = 0; // assume down-right Cell is open unless
    if(cell[iSol][jSol][1].swall3 == true){drCstat = 1;}
    if((cell[iSol][jSol][1].inSol == true) && (cell[iSol][jSol][1].swall3 == false)) {drCstat = 2;}

    // end of determine status of Even-0 cell 

    iStepped = false;  //only 1 step per cycle through while loop is allowed

// determine how many walls surround you
    nWallC = 0;
    if(uCstat == 1){nWallC = nWallC +1;}
    if(lCstat == 1){nWallC = nWallC +1;}
    if(drCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(uCstat == 0){nOpenC = nOpenC +1;}
    if(lCstat == 0){nOpenC = nOpenC +1;}
    if(drCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (but inPath) cells surround you
    nPathC = 0;
    if(uCstat == 2){nPathC = nPathC +1;}
    if(lCstat == 2){nPathC = nPathC +1;}
    if(drCstat == 2){nPathC = nPathC +1;}     
    

//  console.log(uCstat,lCstat,drCstat);  
//  console.log('nXC ',nWallC,nOpenC,nPathC); 

    if(nWallC == 2){ // you are in a dead-end cell (2 walls) - find the one open wall

//     console.log(iSol,jSol,kSol,' is being sealed',uCstat,lCstat,drCstat);      

        if(iStepped == false && (uCstat == 0 || uCstat ==2)) // move up into the open cell
        { cell[iSol][jSol][0].isSealed = true;
          cell[iSol][jSol][0].inSol = false;      
          cell[iSol][jSol][0].swall2=true;
          cell[iSol-1][jSol][1].swall2=true;
          iSol = iSol-1; jSol = jSol; kSol = 1; // move up
          iStepped = true; solStepCnt = solStepCnt +1;
     //console.log('nWallC -Even-0: moved up'); 
        } 


        if(iStepped == false && (lCstat == 0 || lCstat ==2)) // move left into an open cell
        { cell[iSol][jSol][0].isSealed = true;
          cell[iSol][jSol][0].inSol = false;      
          cell[iSol][jSol][0].swall1=true;
          cell[iSol][jSol-1][0].swall1=true;
          iSol = iSol; jSol = jSol-1; kSol = 0; // move left
          iStepped = true; solStepCnt = solStepCnt +1;
     //console.log('nWallC -Even-0: moved left'); 
        }      

        if(iStepped == false && (drCstat == 0 || drCstat == 2)) // move down-right into an open cell
        { cell[iSol][jSol][0].isSealed = true;
          cell[iSol][jSol][0].inSol = false;       
          cell[iSol][jSol][0].swall3=true;
          cell[iSol][jSol][1].swall3=true;
          iSol = iSol; jSol = jSol; kSol = 1;  // move down-right
          iStepped = true; solStepCnt = solStepCnt +1;
     //console.log('nWallC -Even-0: moved down-right'); 
        } 

    }


    if(nOpenC => 1 && iStepped == false){ // find an open (not-yet-in-solutiom) cell to move into

        if(uCstat == 0) // move up into an open cell
        { cell[iSol][jSol][0].inSol = true;
          iSol = iSol-1; jSol = jSol; kSol = 1;
          cell[iSol][jSol][kSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;
     
    // if(iStepped == true){console.log('nOpenC -Even-0: move up'); }

        }    

        if((iStepped == false) && (lCstat == 0)) // move left into an open cell
        { cell[iSol][jSol][0].inSol = true;
          iSol = iSol; jSol = jSol-1; kSol = 0;
          cell[iSol][jSol][kSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;

    // if(iStepped == true){console.log('nOpenC -Even-0: move left'); } 

        }

        if((iStepped == false) && (drCstat == 0)) // move down-right into an open cell
        { cell[iSol][jSol][0].inSol = true;
          iSol = iSol; jSol = jSol; kSol = 1;
          cell[iSol][jSol][1].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
          

    // if(iStepped == true){console.log('nOpenC -Even-0: move down-right'); } 

        }
    } 

    if((nPathC => 1) && (iStepped == false)){ // find a "random" open (in-solutiom) cell to move into

        dice=int(random(0.,2.99));

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (uCstat == 2))// move up into an open cell (already in solution)
            {iSol = iSol-1; jSol = jSol; kSol = 1;
            cell[iSol][jSol][kSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}

    // if(iStepped == true){console.log('nPathC -Even-0: move up'); } 

        break;

        case 1:
            if((iStepped == false) && (lCstat == 2)) // move left into an open cell (already in solution)
            { iSol = iSol; jSol = jSol-1; kSol = 0;
            cell[iSol][jSol][kSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}

    // if(iStepped == true){console.log('nPathC -Even-0: move left'); } 

        break;

        case 2:
            if((iStepped == false) && (drCstat == 2)) // move down-right into an open cell (already in solution)
            {iSol = iSol; jSol = jSol; kSol = 1;
            cell[iSol][jSol][kSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}

    // if(iStepped == true){console.log('nPathC -Even-0: move down-right'); } 

        break;
        }
    }

 //   console.log('end Even-0 - moved to ',iSol,jSol,kSol); 
}

// ****************
// END OF SECTION - IN AN EVEN - 0 CELL 
// *****************

// ****************************************************************************************************

// ****************
// NEXT SECTION - IN AN EVEN - 1 CELL 
// *****************

if(cell[iSol][jSol][kSol].jEven == true  && kSol == 1 && iStepped == false){ 

  // currently in an Even-1 cell       

 // console.log('beginning of an Even-1 cell',iSol,jSol,kSol);        

//  determine status of neighbor cells of the current Even-1 cell
//   Cstat values: 0 - open, 1 - wall, 2 - open and inPath

    // up-left Cell
    ulCstat = 0; // assume up-left Cell is open unless
    if (iSol == 0){ // you are in the top row
        ulCstat = 1;
    }
    else{
        if(cell[iSol][jSol][0].swall3 == true){ulCstat = 1;}
        if((cell[iSol][jSol][0].inSol == true) && (cell[iSol][jSol][0].swall3 == false)){ulCstat = 2;}
    }
    // right Cell
    rCstat = 0; // assume right Cell is open unless
    if(cell[iSol][jSol+1][1].swall1 == true){rCstat = 1;}
    if((cell[iSol][jSol+1][1].inSol == true) && (cell[iSol][jSol+1][1].swall1 == false)) {rCstat = 2;}
    // down Cell
    dCstat = 0; // assume down Cell is open unless
    if(cell[iSol+1][jSol][0].swall2 == true){dCstat = 1;}
    if((cell[iSol+1][jSol][0].inSol == true) && (cell[iSol+1][jSol][0].swall2 == false)) {dCstat = 2;}

    // end of determine status of Even-0 cell 

    iStepped = false;

// determine how many walls surround you
    nWallC = 0;
    if(ulCstat == 1){nWallC = nWallC +1;}
    if(rCstat == 1){nWallC = nWallC +1;}
    if(dCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(ulCstat == 0){nOpenC = nOpenC +1;}
    if(rCstat == 0){nOpenC = nOpenC +1;}
    if(dCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (but inPath) cells surround you
    nPathC = 0;
    if(ulCstat == 2){nPathC = nPathC +1;}
    if(rCstat == 2){nPathC = nPathC +1;}
    if(dCstat == 2){nPathC = nPathC +1;}     
    

  //console.log(ulCstat,rCstat,dCstat);  
  //console.log('nXC ',nWallC,nOpenC,nPathC); 

    if(nWallC == 2){ // you are in a dead-end cell (2 walls) - find the one open wall move and seal this cell

    //console.log(iSol,jSol,kSol,' is being sealed',ulCstat,rCstat,dCstat);   

        if(iStepped == false && (ulCstat == 0 || ulCstat == 2)) // move up-left into the open cell
        { cell[iSol][jSol][1].isSealed = true;
          cell[iSol][jSol][1].inSol = false;      
          cell[iSol][jSol][1].swall3=true;
          cell[iSol][jSol][0].swall3=true;
          iSol = iSol; jSol = jSol; kSol=0;  // move up-left
          iStepped = true; solStepCnt = solStepCnt +1;
    //console.log('nWallC-Even-1: moved up-left'); 
           }

        if(iStepped == false && (rCstat == 0 || rCstat == 2)) // move right into the open cell
        { cell[iSol][jSol][1].isSealed = true;
          cell[iSol][jSol][1].inSol = false;      
          cell[iSol][jSol][1].swall1=true;
          cell[iSol][jSol+1][1].swall1=true;
          iSol = iSol; jSol = jSol+1; kSol=1;  // move right
          iStepped = true; solStepCnt = solStepCnt +1;
    //console.log('nWallC-Even-1: moved right');  
           }

        if(iStepped == false && (dCstat == 0 || dCstat == 2)) // move down into the open cell
        { cell[iSol][jSol][1].isSealed = true;
          cell[iSol][jSol][1].inSol = false;       
          cell[iSol][jSol][1].swall2=true;
          cell[iSol+1][jSol][0].swall2=true;
          iSol = iSol+1; jSol = jSol; kSol = 0;  // move down
          iStepped = true; solStepCnt = solStepCnt +1; 
    //console.log('nWallC-Even-1: moved down');
          }    
    }


    if(nOpenC => 1 && iStepped == false){ // find an open (not-yet-in-solutiom) cell to move into

        if(ulCstat == 0) // move up-left into an open cell
        { cell[iSol][jSol][1].inSol = true;
          iSol = iSol; jSol = jSol; kSol = 0;
          cell[iSol][jSol][0].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;
          
    //if(iStepped == true){console.log('nOpenC-Even-1: move up-left'); } 
           }

        if((iStepped == false) && (rCstat == 0)) // move right into an open cell
        { cell[iSol][jSol][1].inSol = true;
          iSol = iSol; jSol = jSol+1; kSol = 1;
          cell[iSol][jSol][1].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
          
    //if(iStepped == true){console.log('nOpenC-Even-1: move right'); }
           }

        if((iStepped == false) && (dCstat == 0)) // move down into an open cell
        { cell[iSol][jSol].inSol = true;
          iSol = iSol+1; jSol = jSol; kSol = 0;
          cell[iSol][jSol][0].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
          
   //if(iStepped == true){console.log('nOpenC-Even-1: move down'); }
          }

    } 

    if((nPathC => 1) && (iStepped == false)){ // find a "random" open (in-solutiom) cell to move into

        dice=int(random(0.,2.99));

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (ulCstat == 2))// move up-left into an open cell (already in solution)
            {iSol = iSol; jSol = jSol; kSol = 0;
            cell[iSol][jSol][0].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}

    //if(iStepped == true){console.log('nPathC-Even-1: move up-left'); }            
        break;

        case 1:
            if((iStepped == false) && (rCstat == 2)) // move right into an open cell (already in solution)
            { iSol = iSol; jSol = jSol+1; kSol = 1;
            cell[iSol][jSol][1].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
 
    //if(iStepped == true){console.log('nPathC-Even-1: move right'); }
        break;

        case 2:
            if((iStepped == false) && (dCstat == 2)) // move down into an open cell (already in solution)
            { iSol = iSol+1; jSol = jSol; kSol = 0;
            cell[iSol][jSol][kSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
 
    //if(iStepped == true){console.log('nPathC-Even-1: move down'); }
        break;
        }
    } 

//  console.log('end Even-1 moved to - ',iSol,jSol,kSol); 
}

// ****************
// END OF SECTION - IN AN EVEN - 1 CELL 
// *****************


// ****************
// NEXT SECTION - IN AN ODD - 0 CELL 
// *****************


    if(cell[iSol][jSol][kSol].jEven == false  && kSol == 0 && iStepped == false){ 

// currently in an Odd-0 cell 


 // console.log('beginning of an Odd-0 cell',iSol,jSol,kSol);        

//  determine status of neighbor cells of the current Odd-0 cell
//   Cstat values: 0 - open, 1 - wall, 2 - open and inPath

    // up Cell
    uCstat = 0; // assume up Cell is open unless
    if (iSol == 0){ // you are in the top row
        uCstat = 1;
    }
    else{
        if(cell[iSol-1][jSol][1].swall2 == true){uCstat = 1;}
        if((cell[iSol-1][jSol][1].inSol == true) && (cell[iSol-1][jSol][1].swall2 == false)){uCstat = 2;}
    }
    // right Cell
    rCstat = 0; // assume right Cell is open unless
    if(cell[iSol][jSol+1][0].swall1 == true){rCstat = 1;}
    if((cell[iSol][jSol+1][0].inSol == true) && (cell[iSol][jSol+1][0].swall1 == false)) {rCstat = 2;}
    // down-right Cell
    dlCstat = 0; // assume down-left Cell is open unless
    if(cell[iSol][jSol][1].swall3 == true){dlCstat = 1;}
    if((cell[iSol][jSol][1].inSol == true) && (cell[iSol][jSol][1].swall3 == false)) {dlCstat = 2;}

    // end of determine status of Even-0 cell 

     iStepped = false;   

// determine how many walls surround you
    nWallC = 0;
    if(uCstat == 1){nWallC = nWallC +1;}
    if(rCstat == 1){nWallC = nWallC +1;}
    if(dlCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(uCstat == 0){nOpenC = nOpenC +1;}
    if(rCstat == 0){nOpenC = nOpenC +1;}
    if(dlCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (but inPath) cells surround you
    nPathC = 0;
    if(uCstat == 2){nPathC = nPathC +1;}
    if(rCstat == 2){nPathC = nPathC +1;}
    if(dlCstat == 2){nPathC = nPathC +1;}     
    

  //console.log(uCstat,rCstat,dlCstat);
  //console.log('nXC ',nWallC,nOpenC,nPathC);  


    if(nWallC == 2){ // you are in a dead-end cell (2 walls) - find the one open wall

   // console.log(iSol,jSol,kSol,' is being sealed',uCstat,rCstat,dlCstat);      

        if(iStepped == false && (uCstat == 0 || uCstat == 2)) // move up into the open cell
        { cell[iSol][jSol][0].isSealed = true;
          cell[iSol][jSol][0].inSol = false;      
          cell[iSol][jSol][0].swall2=true;
          cell[iSol-1][jSol][1].swall2=true;
          iSol = iSol-1; jSol = jSol; kSol = 1; // move up
          iStepped = true; solStepCnt = solStepCnt +1;
    //console.log('nWallC-Odd-0: moved up'); 
           }

        if(iStepped == false && (rCstat == 0 || rCstat == 2)) // move right into an open cell
        { cell[iSol][jSol][0].isSealed = true;
          cell[iSol][jSol][0].inSol = false;      
          cell[iSol][jSol][0].swall1 = true;
          cell[iSol][jSol+1][0].swall1 = true;
          iSol = iSol; jSol = jSol+1; kSol = 0; // move right
          iStepped = true; solStepCnt = solStepCnt +1;
    //console.log('nWallC-Odd-0: moved right'); 
        }

        if(iStepped == false && (dlCstat == 0 || dlCstat == 2)) // move down-left into an open cell
        { cell[iSol][jSol][0].isSealed = true;
          cell[iSol][jSol][0].inSol = false;       
          cell[iSol][jSol][0].swall3=true;
          cell[iSol][jSol][1].swall3=true;
          iSol = iSol; jSol = jSol; kSol = 1;  // move down-left
          iStepped = true; solStepCnt = solStepCnt +1;
    //console.log('nWallC-Odd-0: moved down-left'); 
        }
    }   


    if(nOpenC => 1 && iStepped == false){ // find the open (not-yet-in-solutiom) cell to move into

        if(uCstat == 0) // move up into an open cell
        { cell[iSol][jSol][0].inSol = true;
          iSol = iSol-1; jSol = jSol; kSol =1;
          cell[iSol][jSol][kSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;
  
    //if(iStepped == true){console.log('nOpenC-Odd-0: move up'); }
           }

        if((iStepped == false) && (rCstat == 0)) // move right into an open cell
        { cell[iSol][jSol][0].inSol = true;
          iSol = iSol; jSol = jSol+1; kSol = 0;
          cell[iSol][jSol][kSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
    
    //if(iStepped == true){console.log('nOpenC-Odd-0: move right'); }
           }

        if((iStepped == false) && (dlCstat == 0)) // move down-left into an open cell
        { cell[iSol][jSol][0].inSol = true;
          iSol = iSol; jSol = jSol; kSol = 1;
          cell[iSol][jSol][kSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
 
    //if(iStepped == true){console.log('nOpenC-Odd-0: move down-left'); }
          }

    } 

    if((nPathC => 1) && (iStepped == false)){ // find a "random" open (in-solutiom) cell to move into

        dice=int(random(0.,2.99));

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (uCstat == 2))// move up into an open cell (already in solution)
            {iSol = iSol-1; jSol = jSol; kSol = 1;
            cell[iSol][jSol][kSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}

    //if(iStepped == true){console.log('nPathC-Odd-0: move up'); }
        break;

        case 1:
            if((iStepped == false) && (rCstat == 2)) // move right into an open cell (already in solution)
            { iSol = iSol; jSol = jSol+1; kSol = 0;
            cell[iSol][jSol][kSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
 
    //if(iStepped == true){console.log('nPathC-Odd-0: move right'); }
        break;

        case 2:
            if((iStepped == false) && (dlCstat == 2)) // move down-left into an open cell (already in solution)
            {iSol = iSol; jSol = jSol; kSol = 1;
            cell[iSol][jSol][kSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
 
   // if(iStepped == true){console.log('nPathC-Odd-0: move down-left'); }
        break;
        }
    }
  //console.log('end Odd-0 - moved to - ',iSol,jSol,kSol);

}
// ****************
// END OF SECTION - IN AN ODD - 0 CELL 
// *****************

// ****************************************************************************************************

// ****************
// NEXT SECTION - IN AN ODD - 1 CELL 
// *****************



if(cell[iSol][jSol][kSol].jEven == false  && kSol == 1 && iStepped == false){ 

 // currently in an Odd-1 cell        

//  console.log('beginning of an Odd-1 cell',iSol,jSol,kSol);        

//  determine status of neighbor cells of the current Odd-1 cell
//   Cstat values: 0 - open, 1 - wall, 2 - open and inPath

    // up-right Cell
    urCstat = 0; // assume up-right Cell is open unless
    if (iSol == 0){ // you are in the top row
        urCstat = 1;
    }
    else{
        if(cell[iSol][jSol][0].swall3 == true){urCstat = 1;}
        if((cell[iSol][jSol][0].inSol == true) && (cell[iSol][jSol][0].swall3 == false)){urCstat = 2;}
    }
    // down Cell
    dCstat = 0; // assume down Cell is open unless
    if((cell[iSol+1][jSol][0].swall2 == true) || (cell[iSol][jSol][kSol].swall2 == true)) {dCstat = 1;}
    if((cell[iSol+1][jSol][0].inSol == true) && (cell[iSol+1][jSol][0].swall2 == false)) {dCstat = 2;}
    // left Cell
    lCstat = 0; // assume left Cell is open unless
    if(cell[iSol][jSol-1][1].swall1 == true || cell[iSol][jSol][kSol].swall1 == true){lCstat = 1;}
    if((cell[iSol][jSol-1][1].inSol == true) && (cell[iSol][jSol-1][1].swall1 == false)) {lCstat = 2;}

    // end of determine status of Even-0 cell 

    iStepped = false;

// determine how many walls surround you
    nWallC = 0;
    if(urCstat == 1){nWallC = nWallC +1;}
    if(dCstat == 1){nWallC = nWallC +1;}
    if(lCstat == 1){nWallC = nWallC +1;} 

// determine how many open (not inPath) cells surround you
    nOpenC = 0;
    if(urCstat == 0){nOpenC = nOpenC +1;}
    if(dCstat == 0){nOpenC = nOpenC +1;}
    if(lCstat == 0){nOpenC = nOpenC +1;} 

// determine how many open (but inPath) cells surround you
    nPathC = 0;
    if(urCstat == 2){nPathC = nPathC +1;}
    if(dCstat == 2){nPathC = nPathC +1;}
    if(lCstat == 2){nPathC = nPathC +1;}     
    

  //console.log(urCstat,dCstat,lCstat);  
  //console.log('nXC ',nWallC,nOpenC,nPathC); 

    if(nWallC == 2){ // you are in a dead-end cell (2 walls) - find the one open wall

    //console.log(iSol,jSol,kSol,' is being sealed',urCstat,dCstat,lCstat);    

        if(iStepped == false && (urCstat == 0 || urCstat == 2)) // move up-right into the open cell
        { cell[iSol][jSol][1].isSealed = true;
          cell[iSol][jSol][1].inSol = false;      
          cell[iSol][jSol][1].swall3=true;
          cell[iSol][jSol][0].swall3=true;
          iSol = iSol; jSol = jSol; kSol=0;  // move up-right
          iStepped = true; solStepCnt = solStepCnt +1;
    //console.log('nWallC-Odd-1: moved up-right'); 
           }

        if(iStepped == false && (dCstat == 0 || dCstat == 2)) // move down into an open cell
        { cell[iSol][jSol][1].isSealed = true;
          cell[iSol][jSol][1].inSol = false;      
          cell[iSol][jSol][1].swall2=true;
          cell[iSol+1][jSol][0].swall2=true;
          iSol = iSol+1; jSol = jSol; kSol=0;  // move down
          iStepped = true; solStepCnt = solStepCnt +1;
    //console.log('nWallC-Odd-1: moved down'); 
           }

        if(iStepped == false && (lCstat == 0 || lCstat == 2)) // move left into an open cell
        { cell[iSol][jSol][1].isSealed = true;
          cell[iSol][jSol][1].inSol = false;       
          cell[iSol][jSol][1].swall1=true;
          cell[iSol][jSol-1][1].swall1=true;
          iSol = iSol; jSol = jSol-1; kSol = 1;  // move left
          iStepped = true; solStepCnt = solStepCnt +1;
    //console.log('nWallC-Odd-1: moved left'); 
          }
        
    }


    if(nOpenC => 1 && iStepped == false){ // find the open (not-yet-in-solutiom) cell to move into

        if(urCstat == 0) // move up-right into an open cell
        { cell[iSol][jSol][1].inSol = true;
          iSol = iSol; jSol = jSol; kSol = 0;
          cell[iSol][jSol][kSol].inSol = true;
          iStepped = true; solStepCnt = solStepCnt +1;

    //if(iStepped == true){console.log('nOpenC-Odd-1: move up-right'); }
           }

        if((iStepped == false) && (dCstat == 0)) // move down into an open cell
        { cell[iSol][jSol][1].inSol = true;
          iSol = iSol+1; jSol = jSol; kSol = 0;
          cell[iSol][jSol][kSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
 
    //if(iStepped == true){console.log('nOpenC-Odd-1: move down'); }
           }

        if((iStepped == false) && (lCstat == 0)) // move left into an open cell
        { cell[iSol][jSol][1].inSol = true;
          iSol = iSol; jSol = jSol-1; kSol = 1;
          cell[iSol][jSol][kSol].inSol = true; 
          iStepped = true; solStepCnt = solStepCnt +1;
 
    //if(iStepped == true){console.log('nOpenC-Odd-1: move left'); }
          }

    } 

    if((nPathC => 1) && (iStepped == false)){ // find a "random" open (in-solutiom) cell to move into

        dice=int(random(0.,2.99));

        switch(dice) { // roll dice to decide which of the already-in-solution open cells to move to

        case 0:
         if((iStepped == false) && (urCstat == 2))// move up-right into an open cell (already in solution)
            {iSol = iSol; jSol = jSol; kSol = 0;
            cell[iSol][jSol][kSol].inSol = true;
            iStepped = true; solStepCnt = solStepCnt +1;}
 
    //if(iStepped == true){console.log('nPathC-Odd-1: move up-right'); }
        break;

        case 1:
            if((iStepped == false) && (dCstat == 2)) // move down into an open cell (already in solution)
            { iSol = iSol+1; jSol = jSol; kSol = 0;
            cell[iSol][jSol][kSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
 
    //if(iStepped == true){console.log('nPathC-Odd-1: move down'); }
        break;

        case 2:
            if((iStepped == false) && (lCstat == 2)) // move left into an open cell (already in solution)
            {iSol = iSol; jSol = jSol-1; kSol = 1;
            cell[iSol][jSol][kSol].inSol = true; 
            iStepped = true; solStepCnt = solStepCnt +1;}
 
    //if(iStepped == true){console.log('nPathC-Odd-1: move left'); }
        break;
        }
    }

  //console.log('end Odd-1 - moved to - ',iSol,jSol,kSol); 

}
// ****************
// END OF SECTION - IN AN ODD - 1 CELL 
// *****************

    if(jTopIn % 2 == 0){ // entry cell was an Even cell
        cell[0][jSolStart][0].inSol = true;  // starting cell always in the solution path
        cell[0][jSolStart][0].isSealed = false; // and never sealed
        cell[0][jSolStart][0].swall2 = true;  // the top wall of this Entry cell alwaya exists
        cell[0][jSolStart][0].swall1 = true;  // the l wall exists
        cell[0][jSolStart][0].swall3 = false;  // the dr wall doesn't exist 
        cell[0][jSolStart][1].swall3 = false;  // the ul wall doesn't exist
        cell[0][jSolStart][1].swall2 = false;  // the d wall doesn't exist        
        cell[0][jSolStart][1].inSol = true;  // kSol = 1 starting cell always in the solution path
        cell[0][jSolStart][1].isSealed = false; // and is never sealed
    }


    if(jTopIn % 2 != 0){ // entry cell was an Odd cell
        cell[0][jSolStart][0].inSol = true;  // starting cell always in the solution path
        cell[0][jSolStart][0].isSealed = false; // and never sealed
        cell[0][jSolStart][0].swall2 = true;  // the top wall of this Entry cell alwaya exists
        cell[0][jSolStart][0].swall1 = true;  // the right wall always exist
        cell[0][jSolStart][0].swall3 = false;  // the dl wall doesn't exist 
        cell[0][jSolStart][1].swall3 = false;  // the ur wall doesn't exist
        cell[0][jSolStart][1].swall2 = false;  // the d wall doesn't exist 
        cell[0][jSolStart][1].swall1 = false;  // the l wall doesn't exist       
        cell[0][jSolStart][1].inSol = true;  // kSol = 1 starting cell always in the solution path
        cell[0][jSolStart][1].isSealed = false; // and is never sealed
    }

    if((iSol == nRows-1 && jSol == jBotOut) || (solStepCnt > 50000)) {iStopSolution = true;}

    iFindSolution =  false;

}

}

//}  // last bracket in findSolution


//--------------------------------------------------------------

function drawSolution(){
    // draw the path that solves the maze

    if(iShowSolution == true){

    for(let i=0; i<=nRows-1; i++){ //each row
        for (let j =0 ; j <= nCols-1; j++) { // across the columns
            for (let k=0; k<2; k++){
                if (cell[i][j][k].inSol == true){
                fill(0,0,255);
                noStroke();
                ellipse(cell[i][j][k].xCntr,cell[i][j][k].yCntr,.4*dotSize,.4*dotSize);
                }
           }                      
        }   
    }


 // this would show the blocked out cells during the solution if you're interested

/*
  for(let i=0; i <= nRows-1; i++){ //each row
        for (let j = 0; j <= nCols-1; j++) { // across the columns
            for (let k=0; k<2; k++){
                if (cell[i][j][k].isSealed == true){
                    fill(255,0,0);
                    noStroke();
                    ellipse(cell[i][j][k].xCntr,cell[i][j][k].yCntr,0.3*dotSize,0.3*dotSize);
                }
           }                      
        }   
    }
*/

    }

    // end of function drawSolution
}



//--------------------------------------------------------------


function keyPressed()  {
     if (keyCode === UP_ARROW) {iStepUp = true;}
     if (keyCode === DOWN_ARROW) {iStepDwn = true;}
     if (keyCode === RIGHT_ARROW) {iStepRgt = true;}
     if (keyCode === LEFT_ARROW) {iStepLft = true;}

     if (key === '9') {iYou=0; jYou=jTopIn;kYou=0;}// return to starting position   
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


//****************************************************************************
//****************************************************************************

class Cell {
  constructor(i,j,k,x1,y1,side,jEven,wall1,wall2,wall3,inM,swall1,swall2,swall3,isSealed,inSol) {
        this.xCor = x1; this.yCor = y1;
        this.side = side;
        this.jEven = jEven;
        this.wall1=wall1; this.wall2 = wall2; this.wall3=wall3;
        this.swall1 = swall1; this.swall2 = swall2; this.swall3 = swall3;

        this.inM = inM;
        this.inSol = inSol;
        this.isSealed = isSealed;

        let celli = i; let cellj = j; let cellk = k;
        let xCntr; let yCntr;
        
    if((celli+cellj)%2 == 0){ // an "even" square cell
        if(cellk == 0){ // an upper triangle in an even cell
            this.x1 = this.xCor; this.y1 = this.yCor+this.side;
            this.x2 = this.xCor; this.y2 = this.yCor;
            this.x3 = this.xCor + this.side; this.y3 = this.yCor;
            this.xCntr = this.xCor + this.side/4.;
            this.yCntr = this.yCor + this.side/4.;
        }
        else { // a lower triangle in an even cell
            this.x1 = this.xCor + this.side; this.y1 = this.yCor;
            this.x2 = this.xCor + this.side; this.y2 = this.yCor + this.side;
            this.x3 = this.xCor; this.y3 = this.yCor + this.side;
            this.xCntr = this.xCor + (3.*this.side)/4.;
            this.yCntr = this.yCor + (3*this.side)/4.;
        }
    }
        
    else{ // an "odd"cell
        if(cellk == 0){ // an upper triangle in an odd cell
            this.x1 = this.xCor + this.side; this.y1 = this.yCor + this.side;
            this.x2 = this.xCor + this.side; this.y2 = this.yCor;
            this.x3 = this.xCor; this.y3 = this.yCor;
            this.xCntr = this.xCor + (3.*this.side)/4.;
            this.yCntr = this.yCor + this.side/4.;        
            }
        else {// a lower triangle in an even cell
            this.x1 = this.xCor; this.y1 = this.yCor;
            this.x2 = this.xCor; this.y2 = this.yCor + this.side;
            this.x3 = this.xCor + this.side; this.y3 = this.yCor + this.side;
            this.xCntr = this.xCor + this.side/4.;
            this.yCntr = this.yCor + (3*this.side)/4.;
        }
    }
}
    //Methods
    
    displayCell() {
    
        if(nRows < 20){strokeWeight(3);}
        if(nRows > 19 && nRows < 35){strokeWeight(2);}
        if(nRows > 34){strokeWeight(1);}
        stroke(0);

        if(this.wall1 == true){line(this.x1, this.y1, this.x2, this.y2);}
        if(this.wall2 == true){line(this.x2, this.y2, this.x3, this.y3);}
        if(this.wall3 == true){line(this.x3, this.y3, this.x1, this.y1);}
    }
    
    drawBoarder() {
        fill(0);//ofFill(0);
        triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
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
