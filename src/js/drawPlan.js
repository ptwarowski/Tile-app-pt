import React, { useState } from "react";



let xCount = 0;
let yCount = 0;
let xCoOrdinates = [0];
let yCoOrdinates = [0];
let svgFill = 'none';

let svgViewBox = `-10 -10 200 200`
let svgStyle = {
  padding:10, 
  border: '1px solid #eee', 
  backgroundImage: `url("../img/unnamed.png")`, 
  backgroundSize: `contain`, 
  backgroundPosition: `center`, 
  };
let xTotal=0;
let yTotal=0;
let sortedX = [0];
let sortedY = [0];
const myStorage = window.localStorage;

let objToSave={
  id: '',
  arrayToSave: [],
  svgViewBox:''
};

let svgStroke = Math.floor((xTotal+yTotal)/100)+1;
/////

export const DrawPlan = () => {
  const [plan, setPlan] = useState(['M 0 0']);
  const [display, setDisplay]= useState(false);
  
  
  const handleChange = (e) => {
    
    const $wallLength = document.getElementById("wallLength");
    
    if ($wallLength.value.length>0 & $wallLength.value>0)  {
      if (e.target.name==="buttonUp") {
        e.preventDefault(); yCount -= parseInt($wallLength.value)}
      if (e.target.name==="buttonDown") {
        e.preventDefault(); yCount += parseInt($wallLength.value)}
      if (e.target.name==="buttonLeft") {
        e.preventDefault(); xCount -= parseInt($wallLength.value)}
      if (e.target.name==="buttonRight") {
        e.preventDefault(); xCount += parseInt($wallLength.value)};
    
    xCoOrdinates.push(xCount);
    yCoOrdinates.push(yCount);
    
    sortedX = xCoOrdinates.sort((a,b)=>a-b);
    sortedY = yCoOrdinates.sort((a,b)=>a-b);
    
    xTotal=-sortedX[0] + sortedX[sortedX.length-1];
    yTotal=-sortedY[0] + sortedY[sortedY.length-1];

    setPlan((prevState)=>[...prevState, ` L ${xCount} ${yCount}`]);
    svgViewBox = `${(sortedX[0]-30)} ${(sortedY[0]-30)} ${xTotal>140 ? xTotal+60: 200} ${yTotal>140 ? yTotal+60: 200}`
    
    document.getElementById("formDraw").reset();} else {e.preventDefault()};
  }
  
  //////

  const handleUndo = () => {
    if (plan !== 'M 0 0') {
    ((xCoOrdinates.length > 1) & (xCount === xCoOrdinates[xCoOrdinates.length-1])) && xCoOrdinates.splice(xCoOrdinates.length-1,1); 
    ((yCoOrdinates.length > 1) & (yCount === yCoOrdinates[yCoOrdinates.length-1])) && yCoOrdinates.splice(yCoOrdinates.length-1,1); 
    ((xCoOrdinates.length > 1) & (xCount === xCoOrdinates[0])) && xCoOrdinates.splice(0,1);
    ((yCoOrdinates.length > 1) & (yCount === yCoOrdinates[0])) && yCoOrdinates.splice(0,1);
    
    xCoOrdinates.length === 1 && (xCount = 0);
    yCoOrdinates.length === 1 && (yCount = 0);

    plan.pop();
    
    let lastItem = plan[plan.length-1];
    
    xCount=parseInt(lastItem.split(' ')[2]);
    yCount=parseInt(lastItem.split(' ')[3]);
    
    isNaN(xCount) && (xCount=0);
    isNaN(yCount) && (yCount=0);
    
    setPlan((prevState)=>[...prevState]);
    
    xTotal=-sortedX[0] + sortedX[sortedX.length-1];
    yTotal=-sortedY[0] + sortedY[sortedY.length-1];

    svgViewBox = `${(sortedX[0]-30)} ${(sortedY[0]-30)} ${xTotal>140 ? xTotal+60: 200} ${yTotal>140 ? yTotal+60: 200}`
    }
  };

////

  const handleDone = () => {
    setDisplay(true);
    if (plan[plan.length-1]=== ' L 0 0') {
        plan.length=plan.length-1;
        setPlan((prevState)=>prevState + ` Z`);
        
    } else {
    setPlan((prevState)=>prevState + ` Z`);}
    
    displaySaveBox = true;
    svgFill = "gainsboro";
    svgStroke = 3;
    let array = [...plan].join("").split(" ");
    
    
    for(let i=1; i<array.length; i=i+3) {
      if ((array[i]===array[i+3])&(array[i]===array[i+6])){
        array.splice(i+2,3);
        i=1;
      }
      for(let j=2; j<array.length; j=j+3) {
      if ((array[j]===array[j+3])&(array[j]===array[j+6])){
        array.splice(j+2,3);
        j=2;
      }
      }
    }
    
    objToSave={
      id: '',
      arrayToSave: [...array, "Z"].join(" "),
      svgViewBox: `${(sortedX[0]-30)} ${(sortedY[0]-30)} ${xTotal>140 ? xTotal+60: 200} ${yTotal>140 ? yTotal+60: 200}`
    }
  }

  ///////

  const handleSavePlan = () => { 
    myStorage.setItem(`svg ${Date.now()}`, JSON.stringify(objToSave)); 
    window.location.reload();

  };
  
  /////

  const handleReset = () => {
    setDisplay(false);
    xCount = 0;
    yCount = 0;
    xCoOrdinates = [0];
    yCoOrdinates = [0];
    svgFill = 'none';
    svgStroke = 1;
    svgViewBox = `-10 -10 200 200`
    xTotal=0;
    yTotal=0;
    sortedX = [0];
    sortedY = [0];
    setPlan(['M 0 0']);
  };

  /////

  let displayDrawBox = ({display}) => {
    if(!display) {return (
    <>
      <p>Enter the length in the field and click on the triangle showing the direction.</p>
      <br/>
      <p>X Width: <span>{xTotal}</span>cm, Y Width: <span>{yTotal}</span>cm | X is <span>{xCount}</span>cm from the start, Y is <span>{yCount}</span>cm from the start.</p>
      <div className='tools'>
        <form id="formDraw" className="formDraw">
         <button type="submit" name= "buttonUp" className = "upPlanButton" onClick={(e)=>handleChange(e)}> 
         </button>
         <br></br>
         <button type="submit" name= "buttonLeft" className = "leftPlanButton" onClick={(e)=>handleChange(e)}>
         </button>
         <input id="wallLength" type="number" placeholder="length" ></input>
         <button type="submit" name= "buttonRight" className = "rightPlanButton" onClick={(e)=>handleChange(e)}>
         </button>
         <br></br>
         <button type="submit" name= "buttonDown" className = "downPlanButton" onClick={(e)=>handleChange(e)}>
         </button>
        </form>
        <div className='buttonsBox'>
        <button type="submit" name= "undo" className = "undoButton" onClick={handleUndo}>
          undo
        </button>
        <button name= "resetPlan" className = "resetPlanButton" onClick={handleReset}>
          reset
        </button>
        <button name= "closePlan" className = "closePlanButton" onClick={handleDone}>
          done
        </button>
        </div>    
      </div>
      </>
    )}
  }

  /////

  let displaySaveBox = ({display}) => {
    
    if (display) 
    {return (<div className="saveBox">
        <h5>Do you want to save your plan?</h5>
          <div className='saveBoxButtons'>
            <button className="savePlanButton" onClick = {handleSavePlan}>Save</button>
            <button className="resetPlanButton" onClick = {handleReset}>Reset</button>
          </div>
        </div>)
    }
  }
  
  //////

  return (
    <section className='middleSection'>
      <div className="viewSVG">
        <svg className="planSVG" viewBox={svgViewBox} style={svgStyle} >
          <path id="planPath" d={plan}  stroke="#555" strokeWidth={svgStroke} fill={svgFill} />
        </svg>
          {displayDrawBox({display})}
          {displaySaveBox({display})}
      </div>
    </section>
  )
}
