/* 

Javascript version as of 5/31/23


*/


//  Variables etc....
    let cell = [];
    let  cPi = []; cPj = [];


    let nRings,nCells,nCellsInit,nCellsX2,nCellsX4,nCellsX8;
    let tR1,tR2;
    let  loc;
    let  iRandom, iMove;
    let  cCi, cCj,cCjTemp; // shorthand for currentCell i-RING and j-CELL index
    let  pCi, pCj; // shorthand for perviousCell i-RING and j-CELL index
     // shorthand for the array of cell indecies on the current cell path (needed to go "backwards")
    let cPindex; // counter for current cell path
    let numInactiveCells; // an ininM cell is one that is not yet connected to the maze path
    let numACell;
    let iT;  // transition ring number
    let iU; // utility index
    let inActiveCellsLeft, rollDice;
    let iOpt;
    let nRingsMin,nRingsMax;
    let sRing; //local ring cell count
    let cCiL,cCjL,cCiR,cCjR,cCiD,cCjD,cCiU,cCjU,cCiUL,cCjUL,cCiUR,cCjUR;
    let dwnSide;
    let inDoor,outDoor;
    
    let centerX, centerY;
    let coreRadius,delRadius,delRadiusBorder,delRadiusCell;
    let theta,delTheta;
    let dTInit,dTD2,dTD4,dTD8;
    let xC1,xC2,xC3,xC4,xC5,xC6;
    let yC1,yC2,yC3,yC4,yC5,yC6;
    let cjL,cjR;
    let fac1,fac2,ang1,ang2,d1,d2,d3;

    let iDrawMaze,iBuildMaze,iSolveMaze,iSaveMaze;
    let logic1,logi2,logic3;
    let arrowL;
    let x1p,y1p,x2p,y2p,x3p,y3p,da,sa;
    
    // some stuff for solution path
    // i is the ring index
    // j is the cell in ring index
    let cellCntrX,cellCntrY;
    let iStpCW, iStpCCW, iStpIn, iStpOut, iStpOutCCW, iStpOutCW;
    let cIni,cInj,cOuti,cOutj,cCwi,cCwj,cCcwi,cCcwj;
    let cOutCwi,cOutCwj,cOutCcwi,cOutCcwj;
    let iYou,jYou;
    let youSize;
    let dotSize;
    
    
    
    // some graphics stuff
    let xp1,yp1,xp2,yp2,xp3,yp3,xp4,yp4;
    let xp5,yp5,xp6,yp6,xp7,yp7,xp8,yp8;
    let lineWid;
    
    // stuff for the buttons
    let onBtnRefresh,onBtnSave,onBtnSolve;
    let s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16;
    let mPressed, kPressed, kReleased; 

// <<<<<<<<<<< end of variables >>>>>>>>>
 
function setup() {  
  // size and center the maze based upon the number of cells
  createCanvas(1024,770);

  background(255);
  dotColor = color(255,0,0);
  visitedDotColor = color(255,255,0);
  
    centerX = height/2.; centerY = height/2.;
    nRingsMin = 12; nRingsMax = 40;
    
    ss1 = "MAZE COMPLEXITY";  ss2 = "SIMPLE";  ss3 = "COMPLEX"; 

 // declare slider and buttons objects
    sizeBar = new ScrollBar(820,565,150,35,1);
    refreshButton = new Button(820, 505, 130, 50, 255, 255, 0,false,'    NEW MAZE ');
    solveButton = new Button( 820.,130.,130.,50., 0, 200,0, false,'   SOLVE MAZE ');
    saveButton = new Button(820, 40, 130, 50, 255, 204, 255, false,'   SAVE MAZE'); 
 

    outButton = new Button(850., 210., 75., 75., 153, 204, 255,false,  '   Out(w)');
    inButton = new Button(850.,340.,75., 75., 153, 204, 255,false, '   In(s)');
    outCCwButton = new Button(770, 230, 75, 75, 153, 204, 255,false, 'Out-CCW(q)');
    outCwButton = new Button(930, 230, 75, 75, 153, 204, 255,false, ' Out-CW(e)');

    ccwButton = new Button(770, 320, 75, 75, 153, 204, 255,false, '  CCW (a)');
    cwButton = new Button(930, 320, 75, 75, 153, 204, 255,false, '   CW(d) ');

//    nRings = 18;
    nRingsMin=12;
    nCellsInit = 18;

    tR1 = int(3.+.2*float(nRings-11));
    tR2 = int(5.+0.6*(nRings-11));

    dTInit = 2*PI/nCellsInit;
    dTD2 = dTInit/2.; dTD4 = dTInit/4.;
    dTD8 = dTInit/8.;
    nCellsX2 = nCellsInit*2; nCellsX4=nCellsInit*4; nCellsX8=nCellsInit*8;
   
    coreRadius = 20.;
    delRadiusCell = 340./float(nRings);
    delRadiusBorder=delRadiusCell/2.;

    onBtnRefresh = false; onBtnSave = false;
    
    iBuildMaze = true; iDrawMaze = false; iSolveMaze = false; iDrawPath = false; iSaveMaze = false;
    
    iStpUpLft=false; iStpDwnLft=false; iStpUpRgt=false; iStpDwnRgt=false; iStpUp=false; iStpDwn=false;

}  // end of function setup ***********************



function draw () {

   // createCanvas(1024,770);
    background(255);
    fill(255); noStroke();
    rect(0, 0, 1023,769);

    sizeBar.sbDisplay();
    sizeBar.sbUpdate();
    refreshButton.buttonDraw();
    saveButton.buttonDraw();
    solveButton.buttonDraw();
    outButton.buttonDraw();
    inButton.buttonDraw();
    outCCwButton.buttonDraw();
    outCwButton.buttonDraw();
    cwButton.buttonDraw();
    ccwButton.buttonDraw();

    if(refreshButton.buttonCheck() == true && mouseIsPressed == true) 
      {iBuildMaze = true; }

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
        iYou=0; jYou=inDoor;
        iBuildMaze = false;
    }
   
    if(iSolveMaze == true){
        solveMaze();
    }
    
    drawMaze();
    
    if(iSaveMaze == true){
        noStroke();
        fill(255);
        rect(745,0,280,770);
        saveCanvas('aMaze','jpg');
        let count;
        for(let ic=0;ic<100000;ic=ic+.0001) // need a short delay so only 1 copy of the maze is downloaded
          {count=count+ic;}
           iSaveMaze = false;
    }


}
// end of function draw() *************************

  
function buildMaze () {
  background(255);

  console.log('num', (sizeBar.getPos()-1063)/150.);

// size the maze and set the doors
    nRings= int(nRingsMin+((sizeBar.getPos()-1063)/150.)*(nRingsMax-nRingsMin));

    nCells=nRings;
    delRadiusCell = 340./float(nRings);
    inDoor=int(random(0,nCellsInit-1));
    outDoor=int(random(0,nCellsX4-1));

    dotSize=int(21.6 - .43 * nRings);

    tR1 = int(3.+.2*float(nRings-11));
    tR2 = int(5.+0.6*(nRings-11));

    dTInit = 2*PI/nCellsInit;
    dTD2 = dTInit/2.; dTD4 = dTInit/4.;
    dTD8 = dTInit/8.;
    nCellsX2 = nCellsInit*2; nCellsX4=nCellsInit*4; nCellsX8=nCellsInit*8;  
    
// i is the ring index
// j is the cell in ring index
// define the cell objects corner coordinates and create Cell objects
    
    for(let i=0; i<= tR1-1; i++){  // Loop 1 rings
        cell[i]=[];
        nCells = nCellsInit;
        delRadius=delRadiusCell;
        delTheta=dTInit;
        for(let j=0;j <= nCells; j++){
        xC1 = centerX + (coreRadius + i*delRadius)*cos(j*delTheta);
        yC1 = centerY + (coreRadius + i*delRadius)*sin(j*delTheta);
        xC2 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta);
        yC2 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta);
        xC3 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta/2.);
        yC3 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta/2.);
        xC4 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta);
        yC4 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta);
        xC5 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta);
        yC5 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta);
        xC6 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta/2.);
        yC6 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta/2.);
        cell[i][j] = new Cell(1,xC1,yC1,xC2,yC2,xC3,yC3,xC4,yC4,xC5,yC5,xC6,yC6,true,true,true,true,true,true,false,false);
        }
    }
    
    let i = tR1;  // Loop 1 transition ring
    cell[i]=[];
    nCells = nCellsInit;
    delTheta=dTInit;
        for(let j=0;j <= nCells; j++){
            xC1 = centerX + (coreRadius + i*delRadius)*cos(j*delTheta);
            yC1 = centerY + (coreRadius + i*delRadius)*sin(j*delTheta);
            xC2 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta);
            yC2 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta);
            xC3 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta/2.);
            yC3 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta/2.);
            xC4 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta);
            yC4 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta);
            xC5 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta);
            yC5 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta);
            xC6 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta/2.);
            yC6 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta/2.);
            cell[i][j] = new Cell(2,xC1,yC1,xC2,yC2,xC3,yC3,xC4,yC4,xC5,yC5,xC6,yC6,true,true,true,true,true,true,false,false);
        }
    
    for(let i=tR1+1; i<= tR2-1; i++){  // Loop 2 rings
        cell[i]=[];
        nCells = 2*nCellsInit;
        delTheta=dTD2;
        for(let j=0;j <= nCells; j++){
            xC1 = centerX + (coreRadius + i*delRadius)*cos(j*delTheta);
            yC1 = centerY + (coreRadius + i*delRadius)*sin(j*delTheta);
            xC2 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta);
            yC2 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta);
            xC3 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta/2.);
            yC3 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta/2.);
            xC4 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta);
            yC4 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta);
            xC5 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta);
            yC5 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta);
            xC6 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta/2.);
            yC6 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta/2.);
            cell[i][j] = new Cell(1,xC1,yC1,xC2,yC2,xC3,yC3,xC4,yC4,xC5,yC5,xC6,yC6,true,true,true,true,true,true,false,false);
        }
    }
    
        i=tR2;  // Loop 2 transition ring
        cell[i]=[];    
        nCells = 2*nCellsInit;
        delTheta=dTD2;
        for(let j=0;j <= nCells; j++){
            xC1 = centerX + (coreRadius + i*delRadius)*cos(j*delTheta);
            yC1 = centerY + (coreRadius + i*delRadius)*sin(j*delTheta);
            xC2 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta);
            yC2 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta);
            xC3 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta/2.);
            yC3 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta/2.);
            xC4 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta);
            yC4 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta);
            xC5 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta);
            yC5 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta);
            xC6 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta/2.);
            yC6 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta/2.);
            cell[i][j] = new Cell(2,xC1,yC1,xC2,yC2,xC3,yC3,xC4,yC4,xC5,yC5,xC6,yC6,true,true,true,true,true,true,false,false);
        }
    
    for(let i=tR2+1; i<= nRings-1; i++){  // Loop 3 rings
        cell[i]=[];
        nCells = 4*nCellsInit;
        delTheta=dTD4;
        delRadius=delRadiusCell;
        for(let j=0;j <= nCells; j++){
            xC1 = centerX + (coreRadius + i*delRadius)*cos(j*delTheta);
            yC1 = centerY + (coreRadius + i*delRadius)*sin(j*delTheta);
            xC2 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta);
            yC2 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta);
            xC3 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta/2.);
            yC3 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta/2.);
            xC4 = centerX + (coreRadius + (i+1)*delRadius)*cos(j*delTheta+delTheta);
            yC4 = centerY + (coreRadius + (i+1)*delRadius)*sin(j*delTheta+delTheta);
            xC5 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta);
            yC5 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta);
            xC6 = centerX+(coreRadius+i*delRadius)*cos(j*delTheta+delTheta/2.);
            yC6 = centerY+(coreRadius+i*delRadius)*sin(j*delTheta+delTheta/2.);
            cell[i][j] = new Cell(1,xC1,yC1,xC2,yC2,xC3,yC3,xC4,yC4,xC5,yC5,xC6,yC6,true,true,true,true,true,true,false,false);
        }
    }

    // begin constructing the maze
    
    let iIn = 0;//blocking out all the cells on the inner(cCi=0) ring
    for (let j=0; j<nCellsInit; j++) { // across the columns
        cell[iIn][j].inM = true;cell[iIn][j].iType=3;}
    
    let iOt = nRings-1;//blocking out all the cells on the outer(cCi=nRings-1) ring
    for (let j=0; j<4*nCellsInit; j++) { // across the columns
        cell[iOt][j].inM = true;cell[iOt][j].iType=3;}
    
    // all non-wall cells start as inactive (NEED TO GENERALIZE****)
    numInactiveCells=tR1*nCellsInit+(tR2-tR1)*nCellsX2+(nRings-tR2-1)*nCellsX4;
    
    // select an interior cell at random as the maze starting point
    cCj= int(random(3,float(nCellsInit-3)));
    cCi= int(random(3,float(nRings-3)));
    
    cell[cCi][cCj].inM = true;
    numInactiveCells = numInactiveCells -1;
    inActiveCellsLeft = true; // variable is true as long as there are ininM cells
    
    // initialize path tracking paramater arrays
    cPi[0]=cCi; cPj[0]=cCj;
    cPi[1]=cCi; cPj[1]=cCj;
    cPindex = 1;
    numACell=1;
    
// *****************
// begin the search algorithm to eliminate maze walls and create the maze

    while (numInactiveCells >0 && cPindex>0) {
 
// search for an open adjecent cell
            
// if current cell is a transition ring cell (i.e. tR1 or tR2)
//****** BEGIN TRANSITION RING CELLS *********************
            
    if(cCi == tR1 || cCi == tR2){  // cell is a transition ring     
        // determine the current ring size
        if(cCi <= tR1){sRing = nCellsInit;}
        if((cCi > tR1)&&(cCi<=tR2)){sRing = nCellsX2;}
        if((cCi > tR2)&&(cCi<=nRings)){sRing = nCellsX4;}
        
        if(cCj==0){cCjL=sRing-1; cCiL=cCi;}
        else{cCjL=cCj-1; cCiL=cCi;}
        if(cCj==sRing-1){cCjR = 0; cCiR=cCi;}
        else{cCjR=cCj+1; cCiR=cCi;}
        cCiD=cCi-1; cCjD=cCj;
        cCiUL=cCi+1;cCjUL=2*cCj;
        cCiUR=cCi+1;cCjUR=2*cCj+1;
 
        if(!cell[cCiL][cCjL].inM||!cell[cCiR][cCjR].inM||
        !cell[cCiD][cCjD].inM||!cell[cCiUL][cCjUL].inM||!cell[cCiUR][cCjUR].inM)
            {rollDice=true;} // there is an inactive neighboor
        else { // no inactive cells available for a move - move back
                cCi=cPi[cPindex-1];
                cCj=cPj[cPindex-1];
                cPindex=cPindex-1;
        }

        while(rollDice) { // roll the dice to find a cell to open
            
            iMove=int(random(1.,5.999));
                
            if(iMove == 1 && !cell[cCiL][cCjL].inM) { //move"left" to i,j-1
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall1 = false;  // current cell
                cCi=cCiL; cCj=cCjL;
                cell[cCi][cCj].wall4 = false; // neighboor and next cell
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
                
            else if(iMove == 2 && !cell[cCiD][cCjD].inM) { //move "down" to i-1,j
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall5 = false;  // current cell
                cell[cCi][cCj].wall6 = false;  // current cell
                cCi=cCiD; cCj=cCjD;
                cell[cCi][cCj].wall2 = false; // neighboor and next cell
                cell[cCi][cCj].wall3 = false; // neighboor and next cell
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice = false;}
                
            else if(iMove == 3 && !cell[cCiR][cCjR].inM) {//move right to i,j+1
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall4 = false;  // current cell
                cCi=cCiR; cCj=cCjR;
                cell[cCi][cCj].wall1 = false; // neighboor and next cell
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice=false;}
                
            else if(iMove == 4 && !cell[cCiUL][cCjUL].inM) {//move up to i+1,j(left)
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall2 = false;  // current cell
                cCi=cCiUL; cCj=cCjUL;
                cell[cCi][cCj].wall5 = false; // neighboor and next cell
                cell[cCi][cCj].wall6 = false; // neighboor and next cell
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells-1;
                rollDice=false;}
                
            else if(iMove == 5 && !cell[cCiUR][cCjUR].inM) {//move up to i+1,j(right)
                cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                cell[cCi][cCj].wall3 = false;  // current cell
                cCi=cCiUR; cCj=cCjUR;
                cell[cCi][cCj].wall5 = false; // neighboor and next cell
                cell[cCi][cCj].wall6 = false; // neighboor and next cell
                cell[cCi][cCj].inM = true;
                numInactiveCells = numInactiveCells -1;
                rollDice=false;}
            }
        }
        
// if current cell is above a transition ring cell (i.e. 3 or 6)
//****** BEGIN RING ABOVE TRANSITION RING CELLS *********************
        
        if(cCi == tR1+1 || cCi == tR2+1){  // cell is a ring above a transition ring
            
            // determine the current ring size
            if(cCi <= tR1){sRing = nCellsInit;}
            if((cCi > tR1)&&(cCi<=tR2)){sRing=nCellsX2;}
            if((cCi > tR2)&&(cCi<=nRings)){sRing=nCellsX4;}
            
            if(cCj==0){cCjL=sRing-1; cCiL=cCi;}
            else{cCjL=cCj-1; cCiL=cCi;}
            if(cCj==sRing-1){cCjR = 0; cCiR=cCi;}
            else{cCjR=cCj+1; cCiR=cCi;}
            cCiU=cCi+1; cCjU=cCj;
            cCiD=cCi-1;cCjD=int(cCj/2);
            if((cCj%2) == 0){dwnSide=1;}
            else{dwnSide=2;}      
            
            if(!cell[cCiL][cCjL].inM||!cell[cCiR][cCjR].inM
               ||!cell[cCiD][cCjD].inM||!cell[cCiU][cCjU].inM)
                {rollDice=true;} // there is an inactive neighboor
            else { // no inactive cells available for a move - move back
                cCi=cPi[cPindex-1];
                cCj=cPj[cPindex-1];
                cPindex=cPindex-1;
            }   
            
            while(rollDice) { // roll the dice to find a cell to open
                
                iMove=int(random(1.,4.999));
                
                if(iMove == 1 && !cell[cCiL][cCjL].inM) { //move"left" to i,j-1
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall1 = false;  // current cell
                    cCi=cCiL; cCj=cCjL;
                    cell[cCi][cCj].wall4 = false; // neighboor and next cell
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 2 && !cell[cCiU][cCjU].inM) { //move "up" to i+1,j
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall2 = false;  // current cell
                    cell[cCi][cCj].wall3 = false;  // current cell
                    cCi=cCiU;cCj=cCjU;
                    cell[cCi][cCj].wall5 = false; // neighboor and next cell
                    cell[cCi][cCj].wall6 = false; // neighboor and next cell
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 3 && !cell[cCiR][cCjR].inM) {//move right to i,j+1
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall4 = false;  // current cell
                    cCi=cCiR; cCj=cCjR;
                    cell[cCi][cCj].wall1 = false; // neighboor and next cell
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
                else if(iMove == 4 && !cell[cCiD][cCjD].inM) {//move down to i,j/2
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall5 = false;  // current cell
                    cell[cCi][cCj].wall6 = false;  // current cell
                    cCi=cCiD;cCj=cCjD;
                    if(dwnSide ==1)
                    {cell[cCi][cCj].wall2 = false;} //upperleft wall in lower ring
                    if(dwnSide ==2)
                    {cell[cCi][cCj].wall3 = false;} //upper right wall in lower ring
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells-1;
                    rollDice=false;}
            }
        }
// if current cell NOT (i.e. 2,3 or 5,6)
//****** BEGIN RING CELLS NOT MODIFIED BY TRANSTION RINGS *********************

        
        if(cCi != tR1 && cCi != tR2 && cCi != (tR1+1) && cCi != (tR2+1)){  // cell is not next to a transition

            // determine the current ring size
            if(cCi <= tR1){sRing = nCellsInit;}
            if((cCi > tR1)&&(cCi<=tR2)){sRing=nCellsX2;}
            if((cCi > tR2)&&(cCi<=nRings)){sRing=nCellsX4;}
            
            
            if(cCj==0){cCjL=sRing-1; cCiL=cCi;}
            else{cCjL=cCj-1; cCiL=cCi;}
            if(cCj==sRing-1){cCjR = 0; cCiR=cCi;}
            else{cCjR=cCj+1; cCiR=cCi;}
            cCiD=cCi-1; cCjD=cCj;
            cCiU=cCi+1; cCjU=cCj;

            
            if(!cell[cCiL][cCjL].inM||!cell[cCiR][cCjR].inM||
               !cell[cCiD][cCjD].inM||!cell[cCiU][cCjU].inM)
            {rollDice=true;} // there is an inactive neighboor
            else { // no inactive cells available for a move - move back
                cCi=cPi[cPindex-1];
                cCj=cPj[cPindex-1];
                cPindex=cPindex-1;
            }
            
            while(rollDice) { // roll the dice to find a cell to open
                
                iMove=int(random(1.,4.999));
                
                if(iMove == 1 && !cell[cCiL][cCjL].inM) { //move"left" to i,j-1
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall1 = false;  // current cell
                    cCi=cCiL; cCj=cCjL; // neighboor and next cell
                    cell[cCi][cCj].wall4 = false; // neighboor and next cell
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 2 && !cell[cCiD][cCjD].inM) { //move "down" to i-1,j
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall5 = false;  // current cell
                    cell[cCi][cCj].wall6 = false;  // current cell
                    cCi=cCiD; cCj=cCjD; // neighboor and next cel
                    cell[cCi][cCj].wall2 = false; // neighboor and next cell
                    cell[cCi][cCj].wall3 = false; // neighboor and next cell
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice = false;}
                
                else if(iMove == 3 && !cell[cCiR][cCjR].inM) {//move right to i,j+1
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall4 = false;  // current cell
                    cCi=cCiR; cCj=cCjR; // neighboor and next cell
                    cell[cCi][cCj].wall1 = false;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells -1;
                    rollDice=false;}
                
                else if(iMove == 4 && !cell[cCiU][cCjU].inM) {//move up to i+1,j
                    cPindex++; cPi[cPindex]=cCi; cPj[cPindex]=cCj;
                    cell[cCi][cCj].wall2 = false;  // current cell
                    cell[cCi][cCj].wall3 = false;  // current cell
                    cCi=cCiU; cCj=cCjU;  // neighboor and next cell
                    cell[cCi][cCj].wall5 = false;
                    cell[cCi][cCj].wall6 = false;
                    cell[cCi][cCj].inM = true;
                    numInactiveCells = numInactiveCells-1;
                    rollDice=false;}
            }
        }
    }
// wall breakout process - the maze is complete
    
// set some parameters so you can start finding your way out of the maze
    
    iSolveMaze=false; // to solve maze you need to now hit the Solve Maze button
    iStpCW=false; iStpCCW=false; iStpIn=false, iStpOut=false; iStpOutCCW=false; iStpOutCW=false;
    cell[0][inDoor].wall2=false;cell[0][inDoor].wall3=false;
    cell[1][inDoor].wall5=false;cell[1][inDoor].wall6=false;

    // end of buildMaze
}
//-----------------------------------------------------------------------------

function solveMaze(){
    // build a path to move through the maze

   //****************************************************************
    // if YOU are currently in a transition ring cell (i.e. tR1 or tR2)
    
    if(iYou == tR1 || iYou == tR2){  // cell is a transition ring
        
        // determine the current ring size
        if(iYou == tR1){sRing = nCellsInit;}
        if((iYou == tR2)){sRing=nCellsX2;}
        
        if(jYou==0){cCcwj=sRing-1; cCcwi=iYou;}
        else{cCcwj=jYou-1; cCcwi=iYou;}
        if(jYou==sRing-1){cCwj = 0; cCwi=iYou;}
        else{cCwj=jYou+1; cCwi=iYou;}
        cIni=iYou-1; cInj=jYou;
        cOutCcwi=iYou+1;cOutCcwj=2*jYou;
        cOutCwi=iYou+1;cOutCwj=2*jYou+1;
        
        if(iStpIn == true){
            if (cell[iYou][jYou].wall5 == true && cell[iYou][jYou].wall6 == true)
            {iStpIn=false;}
            else{iYou=cIni; jYou=cInj; cell[iYou][jYou].inPath=true; iStpIn = false;}
        }
        
        if(iStpOutCCW == true){
            if (cell[iYou][jYou].wall2 == true)
            {iStpOutCCW=false;}
            else{iYou=cOutCcwi; jYou=cOutCcwj; cell[iYou][jYou].inPath=true; iStpOutCCW = false;}
        }

        if(iStpOutCW == true){
            if (cell[iYou][jYou].wall3 == true)
            {iStpOutCW=false;}
            else{iYou=cOutCwi; jYou=cOutCwj; cell[iYou][jYou].inPath=true; iStpOutCW = false;}
        }
        
        if(iStpCW == true){
            if (cell[iYou][jYou].wall4 == true)
            {iStpCW=false;}
            else{iYou=cCwi;jYou=cCwj; cell[iYou][jYou].inPath=true; iStpCW = false;}
        }
        
        if(iStpCCW == true){
            if (cell[iYou][jYou].wall1 == true)
            {iStpCCW=false;}
            else{iYou=cCcwi;jYou=cCcwj; cell[iYou][jYou].inPath=true; iStpCCW = false;}
        }

        if(iStpOut == true) {iStpOut=false;} // can't step "out" only from a transition ring
        
    }
    
    
    // ***************************************************
    // if YOU are in a cell is above a transition ring cell
    
    if(iYou == tR1+1 || iYou == tR2+1){  // cell is a ring above a transition ring
        
        // determine the current ring size
        if(iYou == tR1+1){sRing=nCellsX2;}
        if(iYou == tR2+1){sRing=nCellsX4;}
       
        if(jYou==0){cCcwj=sRing-1; cCcwi=iYou;}
        else{cCcwj=jYou-1; cCcwi=iYou;}
        if(jYou==sRing-1){cCwj = 0; cCwi=iYou;}
        else{cCwj=jYou+1; cCwi=iYou;}
        cOuti=iYou+1; cOutj=jYou;
        cIni=iYou-1;
        cInj=int(jYou/2);
        
        if(iStpIn == true){
            if (cell[iYou][jYou].wall5 == true && cell[iYou][jYou].wall6 == true)
            {iStpIn=false;}
            else{iYou=cIni; jYou=cInj; cell[iYou][jYou].inPath=true; iStpIn = false;}
       }
        
        if(iStpOut == true){
            if (cell[iYou][jYou].wall2 == true && cell[iYou][jYou].wall3 == true)
            {iStpOut=false;}
            else{iYou=cOuti;jYou=cOutj;cell[iYou][jYou].inPath=true; iStpOut = false;}
        }
        
        if(iStpCW == true){
            if (cell[iYou][jYou].wall4 == true)
            {iStpCW=false;}
            else{iYou=cCwi;jYou=cCwj;cell[iYou][jYou].inPath=true; iStpCW = false;}
        }
        
        if(iStpCCW == true){
            if (cell[iYou][jYou].wall1 == true)
            {iStpCCW=false;}
            else{iYou=cCcwi;jYou=cCcwj;cell[iYou][jYou].inPath=true; iStpCCW = false;}
        }
    }
    
    // ************************************
    // if YOU are NOT in a transition cell
    
    if(iYou != tR1 && iYou != tR2 && iYou != (tR1+1) && iYou != (tR2+1)){  // cell is not next to a transition
        
        // determine the current ring size
        if(iYou <= tR1){sRing = nCellsInit;}
        if((iYou > tR1)&&(iYou<=tR2)){sRing=nCellsX2;}
        if((iYou > tR2)&&(iYou<=nRings)){sRing=nCellsX4;}
        
        if(jYou==0){cCcwj=sRing-1; cCcwi=iYou;}
        else{cCcwj=jYou-1; cCcwi=iYou;}
        if(jYou==sRing-1){cCwj = 0; cCwi=iYou;}
        else{cCwj=jYou+1; cCwi=iYou;}
        cIni=iYou-1; cInj=jYou;
        cOuti=iYou+1; cOutj=jYou;
        
        if(iStpIn == true){
            if (cell[iYou][jYou].wall5 == true && cell[iYou][jYou].wall6 == true)
                {iStpIn=false;}
            else{iYou=cIni;jYou=cInj;cell[iYou][jYou].inPath=true; iStpIn = false;}
        }
    
        if(iStpOut == true){
            if (cell[iYou][jYou].wall2 == true && cell[iYou][jYou].wall3 == true)
                {iStpOut=false;}
            else{iYou=cOuti;jYou=cOutj;cell[iYou][jYou].inPath=true; iStpOut = false;}
        }
    
        if(iStpCW == true){
            if (cell[iYou][jYou].wall4 == true)
                {iStpCW=false;}
            else{iYou=cCwi;jYou=cCwj;cell[iYou][jYou].inPath=true; iStpCW = false;}
        }
    
        if(iStpCCW == true){
            if (cell[iYou][jYou].wall1 == true)
                {iStpCCW=false;}
            else{iYou=cCcwi;jYou=cCcwj;cell[iYou][jYou].inPath=true; iStpCCW = false;}
        }
}
         // clear any bad button pushes 
        iStpIn = false; iStpOut = false; iStpCW = false; iStpCCW=false;
        iStpOutCW = false; iStpOutCCW = false;
   
    // end of function solveMaze
}   

//--------------------------------------------------------------
function drawMaze(){
// draw the completed maze

  //  ofSetColor(0,0,0);
    noFill();
    if(nRings<=30){lineWid=3;}
    if(nRings>30){lineWid=2;}
    
    for(let i=1; i<=tR1; i++){  // don't draw inner fixed ring
        nCells = nCellsInit;
        for(let j=0;j < nCells; j++){
            cell[i][j].displayCell(lineWid);
            if(cell[i][j].inPath == true){cell[i][j].markCell();}
            
        }
    }
    for(let i=(tR1+1); i<=tR2; i++){
        nCells = 2*nCellsInit;
        for(let j=0;j < nCells; j++){
            cell[i][j].displayCell(lineWid);
            if(cell[i][j].inPath == true){cell[i][j].markCell();}
            
        }
    }
    for(let i=(tR2+1); i<=nRings-2; i++){
        nCells = 4*nCellsInit;
        for(let j=0;j < nCells; j++){  // don't draw outer fixed ring
            cell[i][j].displayCell(lineWid);
            if(cell[i][j].inPath == true){cell[i][j].markCell();}
            
        }
    }
    
// position maze openings and arrows
    fill(255);  stroke(255);  strokeWeight(6);
    line(cell[1][inDoor].xC1, cell[1][inDoor].yC1,cell[1][inDoor].xC5, cell[1][inDoor].yC5);
    line(cell[nRings-2][outDoor].xC2, cell[nRings-2][outDoor].yC2,cell[nRings-2][outDoor].xC4, cell[nRings-2][outDoor].yC4);

// inner arrow
    fill(0);  stroke(0);  strokeWeight(3);
    arrowL=15;
    sa=7;da=10;
    ang1=(inDoor*(dTInit)+dTInit/2.);
    ellipse(centerX,centerY,5);
    line(centerX,centerY,centerX+arrowL*cos(ang1),centerY+arrowL*sin(ang1));
    // arrow tip
    x1p=(da*cos(ang1)+sa*sin(ang1))+centerX; y1p=(da*sin(ang1)-sa*cos(ang1))+centerY;
    x2p=(da*cos(ang1)-sa*sin(ang1))+centerX; y2p=(da*sin(ang1)+sa*cos(ang1))+centerY;
    x3p=2*da*cos(ang1)+centerX; y3p=2*da*sin(ang1)+centerY;
    triangle(x1p,y1p,x2p,y2p,x3p,y3p);

    // outer arrow
    ang2=(outDoor*(dTD4)+dTD4/2.);
  //  ofSetLineWidth(3);
    arrowL=25;
    d1=coreRadius + (nRings-1)*delRadius;
    d2=d1+arrowL;
    line(centerX+d1*cos(ang2),centerY+d1*sin(ang2),centerX+d2*cos(ang2),centerY+d2*sin(ang2));
    // arrow tip
    x1p=(da*cos(ang2)+sa*sin(ang2))+centerX+d1*cos(ang2); y1p=(da*sin(ang2)-sa*cos(ang2))+centerY+d1*sin(ang2);
    x2p=(da*cos(ang2)-sa*sin(ang2))+centerX+d1*cos(ang2); y2p=(da*sin(ang2)+sa*cos(ang2))+centerY+d1*sin(ang2);
    x3p=centerX+(d2+2)*cos(ang2); y3p=centerY+(d2+2)*sin(ang2);
    triangle(x1p,y1p,x2p,y2p,x3p,y3p);
    
// show where you are
    
    youSize=.5*dotSize;
        fill(0,0,0);
        ellipse(cell[iYou][jYou].cellCntrX, cell[iYou][jYou].cellCntrY,youSize,youSize);
        
    if(iYou == nRings-2 && jYou == outDoor){
        fill(0,255,0);
        ellipse(cell[iYou][jYou].cellCntrX, cell[iYou][jYou].cellCntrY,1.2*dotSize,1.2*dotSize);
    }

    // end of function drawMaze
}


//--------------------------------------------------------------
function drawPath(){
    // draw the path through the maze
    
    // mark your staring point in the maze
    pathCellIndx[0][jTopIn].inPath = true;

    fill(0,200,0);  stroke(0,200,0);  strokeWeight(6);
    //dotSize = 4;
     dotSize=int(21.6 - .43 * nRings);

    ellipse(pathCellIndx[0][jTopIn].xCntr, pathCellIndx[0][jTopIn].yCntr,dotSize,dotSize);   
    
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

function keyPressed()  {  // changed from keyTyped

    if (key === '5') 
    {iBuildMaze = true;}
    
    if (key === '6') 
    {iSaveMaze = true;}

    if (key === '7') // 
    {iSolveMaze = true;}
    
    if (key === 'w' || key ==="W")
    {iStpOut = true;}
    else{iStpOut = false;}
    
    if (key === 's' || key ==="S")
    {iStpIn = true;}
    else{iStpIn = false;}
    
    if (key === 'd' || key === "D")
    {iStpCW = true;}
    else{iStpCW = false;}
    
    if (key === 'a' || key === "A")
    {iStpCCW = true;}
    else{iStpCCW = false;}
    
    if (key === 'e' || key === "E")
    {iStpOutCW = true;}
    else{iStpOutCW = false;}
    
    if (key === 'q' || key === "Q")
    {iStpOutCCW = true;}
    else{iStpOutCCW = false;}

    // an escape hatch
    if(key === '9') 
    {iYou=0;jYou=inDoor;}

    return false;
}

function mousePressed() {
    mPressed = true;
    
    onBtnRefresh = refreshButton.buttonCheck();
    if(onBtnRefresh == true)
    {iBuildMaze = true;}
    
    onBtnSave = saveButton.buttonCheck();
    if(onBtnSave == true)
    {iSaveMaze = true;}

    onBtnSolve = solveButton.buttonCheck();
    if(onBtnSolve == true)
    {iSolveMaze = true;
    }
    
    if(outButton.buttonCheck() == true ){iStpOut = true; mPressed = false;}
    if(inButton.buttonCheck() == true){iStpIn = true; mPressed = false;}
    if(cwButton.buttonCheck() == true){iStpCW = true; mPressed = false;}
    if(ccwButton.buttonCheck() == true){iStpCCW = true; mPressed = false;}
    if(outCwButton.buttonCheck() == true){iStpOutCW = true; mPressed = false;}
    if(outCCwButton.buttonCheck() == true){iStpOutCCW = true; mPressed = false;}
}

//****************************************************************************
//****************************************************************************

class Cell {
  constructor(iType,x1,y1,x2,y2,x3,y3,x4,y4,x5,y5,x6,y6,wall1,wall2,wall3,wall4,wall5,wall6,inM,inPath) {
    
    this.wall1=wall1; this.wall2 = wall2; this.wall3=wall3; this.wall4=wall4; 
    this.wall5=wall5; this.wall6=wall6;
    // wallx=true if it remains and =false if removed
    this.inM = inM; // true if added to active maze - false if all walls exist
    this.iType = iType; // =1 if a basic cell, =2 if a transition cell, =3 for inner ring
    this.inPath = inPath;
    
    this.xC1 = x1; this.yC1 = y1;
    this.xC2 = x2; this.yC2 = y2;
    this.xC3 = x3; this.yC3 = y3;
    this.xC4 = x4; this.yC4 = y4;
    this.xC5 = x5; this.yC5 = y5;
    this.xC6 = x6; this.yC6 = y6;
    
    this.cellCntrX=(this.xC1+this.xC4)/2.;
    this.cellCntrY=(this.yC1+this.yC4)/2.;
    
  }

  // method for drawing the cell walls
  displayCell() {
    stroke(0);
    strokeWeight(3);

    if(this.wall1 == true){line(this.xC1,this.yC1,this.xC2,this.yC2);}
    if(this.wall2 == true){line(this.xC2,this.yC2,this.xC3,this.yC3);}
    if(this.wall3 == true){line(this.xC3,this.yC3,this.xC4,this.yC4);}
    if(this.wall4 == true){line(this.xC4,this.yC4,this.xC5,this.yC5);}
    if(this.wall5 == true){line(this.xC5,this.yC5,this.xC6,this.yC6);}
    if(this.wall6 == true){line(this.xC6,this.yC6,this.xC1,this.yC1);} 
  }

    markCell() {
    
    fill(255,0,0); noStroke();
    ellipse(this.cellCntrX,this.cellCntrY,dotSize,dotSize);
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
//    console.log(this.nam);
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
