import React, { useState } from "react";

let svgViewBox = [];
let svgFill = "gainsboro";
let svgStroke = 6;
let displaySVG = false;
let lengthArray = [];
let xGap = 20;

let startXArr = [];
let svgBeginning = [];

let xCount = [];
let yCount = [];
let xCoOrdinates = [0];
let yCoOrdinates = [0];
let svgFillArr = [];
let svgStroke2 = 1;
let svgViewBox2 = `0 -310 200 330`;
let startPathArr = [];
let wallPathArr = [];
let wall = [];

const myStorage = window.localStorage;

let modelToSave = {
  id: "",
  planSVG: "",
  wallsSVG: [],
  xGap: 20,
  svgViewBox: svgViewBox,
  lengthArray: [],
  startXArr: [],
};

const door = {
  offset: 0,
  height: 0,
  width: 0,
};
const win = {
  offset: 0,
  height: 0,
  width: 0,
  level: 0,
};

let windowDisplay = true;


export const DrawWalls = () => {
  const [line, setLine] = useState([]);
  const [valueSVG, setValueSVG] = useState("");
  const [wallNumber, setWallNumber] = useState(0);

  const options = [];
  let svgArray = [];
  let svgViewBoxArr = [];
  let lineArray = [];
  let planArray = [];

  for (let i = 0; i < myStorage.length; i++) {
    let label = myStorage.key(i);
    if (label[0] === "s") {
      let option = { ID: label, value: planArray.length };
      options.push(option);
      planArray = [
        ...planArray,
        JSON.parse(myStorage[myStorage.key(i)]).arrayToSave,
      ];
      svgViewBoxArr = [
        ...svgViewBoxArr,
        JSON.parse(myStorage[myStorage.key(i)]).svgViewBox,
      ];
    }
  }

  /////

  const onSVGPlanChange = (e) => {
    setValueSVG(planArray[e.target.value]);
    svgViewBox = svgViewBoxArr[e.target.value];

    modelToSave = {
      ...modelToSave,
      id: options[e.target.value].ID,
      svgViewBox: svgViewBox,
      planSVG: planArray[e.target.value],
    };

    setWallNumber(0);
    setLine([]);
    displaySVG = true;
    startPathArr = [];
    wallPathArr = [];

    let array = [];
    array = planArray[e.target.value];

    svgArray = array.substring(2);
    svgArray = svgArray.substring(0, svgArray.length - 2);
    svgArray = svgArray.split(" L ");
    svgArray = [...svgArray, "0 0"];

    lengthArray = [];
    xCount = [];
    yCount = [];
    xCoOrdinates = [];
    yCoOrdinates = [];

    for (let i = 0; i < svgArray.length - 1; i++) {
      lineArray.push([`M ${svgArray[i]} L ${svgArray[i + 1]}`]);
      lengthArray.push(svgArray[i].split(" "));
      xCount = [...xCount, []];
      yCount = [...yCount, []];
      xCoOrdinates = [...xCoOrdinates, []];
      yCoOrdinates = [...yCoOrdinates, []];
    }

    setLine(lineArray);

    lengthArray = [...lengthArray, ["0", "0"]];
    let arr = [];
    for (let i = 0; i < lengthArray.length - 1; i++) {
      lengthArray[i][0] === lengthArray[i + 1][0]
        ? arr.push(
            Math.abs(
              parseInt(lengthArray[i + 1][1]) - parseInt(lengthArray[i][1])
            )
          )
        : arr.push(
            Math.abs(
              parseInt(lengthArray[i + 1][0]) - parseInt(lengthArray[i][0])
            )
          );
    }
    arr[arr.length - 1] === 0 && (arr.length = arr.length - 1);

    lengthArray = [...arr];

    wallNumber === 0 && (svgViewBox2 = `0 -310 ${lengthArray[0]} 330`);
    e.preventDefault();
  };

  ////

  const handleLeftWallBtn = () => {
    const nWallNumber = wallNumber - 1;

    if (nWallNumber === -1) {
      setWallNumber(line.length - 1);
      svgViewBox2 = `${startXArr[lengthArray.length - 1]} -330 ${
        lengthArray[lengthArray.length - 1]
      } 360`;
    } else {
      setWallNumber(nWallNumber);
      svgViewBox2 = `${startXArr[nWallNumber]} -330 ${lengthArray[nWallNumber]} 360`;
    }
  };

  ////

  const handleRightWallBtn = () => {
    const nWallNumber = wallNumber + 1;
    if (nWallNumber === line.length) {
      setWallNumber(0);
      svgViewBox2 = `${startXArr[0]} -330 ${lengthArray[0]} 360`;
    } else {
      setWallNumber(nWallNumber);
      svgViewBox2 = `${startXArr[nWallNumber]} -330 ${lengthArray[nWallNumber]} 360`;
    }
  };

  ///////

  const miniSVG = (displaySVG) => {
    if (displaySVG)
      return (
        <svg
          className="planMiniSVG"
          viewBox={svgViewBox}
          style={{ width: 150, height: 300 }}
        >
          <path
            id="planPath"
            d={valueSVG}
            stroke="black"
            strokeWidth={svgStroke}
            fill={svgFill}
          />
          <path
            id="planStrong"
            d={line[wallNumber]}
            stroke="goldenrod"
            strokeWidth={2 * svgStroke}
          />
        </svg>
      );
  };

  ///////

  function DrawWallsSVG(displaySVG) {
    const [change, setChange] = useState(false);
    const [display, setDisplay] = useState(false);
    const [boxDisplay, setBoxDisplay] = useState(false);

    startPathArr = [];
    wallPathArr = [];

    let z;
    for (z = 0; z < lengthArray.length; z++) {
      svgFillArr.push("none");
      startXArr = [...lengthArray];
      wall.push([]);
    }
    wall.length = lengthArray.length;
    let i;
    for (i = 1; i < lengthArray.length + 1; i++) {
      startXArr[0] = 0;
      startXArr[i] = lengthArray[i - 1] + startXArr[i - 1] + xGap;
      svgBeginning[i - 1] = `M ${startXArr[i - 1]} 0 L ${
        lengthArray[i - 1] + startXArr[i - 1]
      } 0`;

      startPathArr = [
        ...startPathArr,
        <path
          key={i - 1}
          id={`startWallPath${i - 1}`}
          d={`M ${startXArr[i - 1]} 0 L ${
            lengthArray[i - 1] + startXArr[i - 1]
          } 0`}
          stroke="goldenrod"
          strokeWidth={svgStroke2}
          fill={svgFillArr[wallNumber]}
        />,
      ];

      wallPathArr = [
        ...wallPathArr,
        <path
          key={i - 1}
          id={`wallPath${i - 1}`}
          d={`M ${startXArr[i - 1]} 0 L ${
            lengthArray[i - 1] + startXArr[i - 1]
          } 0 ${wall[wallNumber].join(" ")}`}
          stroke="black"
          strokeWidth={svgStroke2}
          fill={svgFillArr[wallNumber]}
        />,
      ];
    }

    const handleChange = (e) => {
      const $wallLength = document.getElementById("wallLength");
      let $activeWall = document.getElementById(`wallPath${wallNumber}`);

      if (wall[wallNumber].length === 0) {
        xCount[wallNumber] = 0;
        xCount[wallNumber] =
          xCount[wallNumber] + lengthArray[wallNumber] + startXArr[wallNumber];
        // (xCoOrdinates[wallNumber] = xCoOrdinates[wallNumber]);
      }

      if ($wallLength.value.length > 0) {
        if (e.target.name === "buttonUp") {
          e.preventDefault();
          yCount[wallNumber] -= parseInt($wallLength.value);
        }
        if (e.target.name === "buttonDown") {
          e.preventDefault();
          yCount[wallNumber] += parseInt($wallLength.value);
        }
        if (e.target.name === "buttonLeft") {
          e.preventDefault();
          xCount[wallNumber] -= parseInt($wallLength.value);
        }
        if (e.target.name === "buttonRight") {
          e.preventDefault();
          xCount[wallNumber] += parseInt($wallLength.value);
        }

        xCoOrdinates[wallNumber] = [
          xCoOrdinates[wallNumber] + xCount[wallNumber],
        ];
        yCoOrdinates[wallNumber] = [
          yCoOrdinates[wallNumber] + yCount[wallNumber],
        ];

        wall[wallNumber].push(` L ${xCount[wallNumber]} ${yCount[wallNumber]}`);

        $activeWall.d = $activeWall.d + wall[wallNumber];

        setChange((p) => !p);

        document.getElementById("formDraw").reset();
      } else {
        e.preventDefault();
      }
    };

    ///////

    const handleWindow = () => {
      setBoxDisplay(true);
      windowDisplay = true;
      
    };

    const displayWindow = () => {
      return (
        <div className="addBox">
          <h5>Window inputs:</h5>
          <div className="saveBoxButtons">
            <label>
              Window offset from left:
              <input
                type="number"
                name="wOffset"
                onChange={(e) => (win.offset = e.target.value)}
              ></input>
            </label>
            <br></br>
            <label>
              Window width:
              <input
                type="number"
                name="wWidth"
                onChange={(e) => (win.width = e.target.value)}
              ></input>
            </label>
            <br></br>
            <label>
              Window height:
              <input
                type="number"
                name="wHeight"
                onChange={(e) => (win.height = -e.target.value)}
              ></input>
            </label>
            <br></br>
            <label>
              Window level from the floor:
              <input
                type="number"
                name="wLevel"
                onChange={(e) => (win.level = -e.target.value)}
              ></input>
            </label>
            <br></br>
            <button type="submit" onClick={addWindow}>
              Submit
            </button>
          </div>
        </div>
      );
    };

    const handleDoor = () => {
      setBoxDisplay(true);
      windowDisplay = false;
      
    };
    const displayDoor = () => {
      return (
        <div className="addBox">
          <h5>Door inputs:</h5>
          <div className="saveBoxButtons">
            <label>
              Door offset from left:
              <input
                type="number"
                name="wOffset"
                onChange={(e) => (door.offset = e.target.value)}
              ></input>
            </label>
            <br></br>
            <label>
              Door width:
              <input
                type="number"
                name="wWidth"
                onChange={(e) => (door.width = e.target.value)}
              ></input>
            </label>
            <br></br>
            <label>
              Door height:
              <input
                type="number"
                name="wHeight"
                onChange={(e) => (door.height = -e.target.value)}
              ></input>
            </label>
            <br></br>
            <button onClick={addDoor}>Submit</button>
          </div>
        </div>
      );
    };

    const addDoor = () => {
      setBoxDisplay(false);
      let doorSVG = ` L ${
        parseInt(startXArr[wallNumber]) + parseInt(door.offset)
      } 0 L ${parseInt(startXArr[wallNumber]) + parseInt(door.offset)} ${
        door.height
      } L ${parseInt(startXArr[wallNumber]) + parseInt(door.offset) + parseInt(door.width)} ${door.height} L ${
        parseInt(startXArr[wallNumber]) + parseInt(door.offset) + parseInt(door.width)
      } 0`;
      wall[wallNumber] = [wall[wallNumber] + doorSVG, ` L ${startXArr[wallNumber]} 0`];
    };

    const addWindow = () => {
      setBoxDisplay(false);
      let windowSVG = ` L ${parseInt(startXArr[wallNumber]) + parseInt(win.offset)} 0 L ${parseInt(startXArr[wallNumber]) + parseInt(win.offset)} ${
        parseInt(win.height) + parseInt(win.level)
      } L ${parseInt(startXArr[wallNumber]) + parseInt(win.offset) + parseInt(win.width)} ${parseInt(win.height) + parseInt(win.level)} L ${
        parseInt(startXArr[wallNumber]) + parseInt(win.offset) + parseInt(win.width)
      } ${win.level} L ${win.offset} ${win.level} L ${win.offset} 0`;
      wall[wallNumber] = [wall[wallNumber] + windowSVG, ` L ${startXArr[wallNumber]} 0`];
    };

    const handleDone = () => {
      wall[wallNumber].push(` Z`);

      svgFillArr[wallNumber] = "gainsboro";
      svgStroke = 3;
      setChange((p) => !p);
      let array = [...wall].join("").split(" ");
      let array2 = array.filter((string) => string[string.length - 1] === "Z");
      if (array2.length === lengthArray.length) {
        setDisplay(true);
      }

      for (let i = 1; i < array.length; i = i + 3) {
        if ((array[i] === array[i + 3]) & (array[i] === array[i + 6])) {
          array.splice(i + 2, 3);
          i = 1;
        }
        for (let j = 2; j < array.length; j = j + 3) {
          if ((array[j] === array[j + 3]) & (array[j] === array[j + 6])) {
            array.splice(j + 2, 3);
            j = 2;
          }
        }
      }

      modelToSave = {
        ...modelToSave,
        lineArray: [...line],
        wallsSVG: [...wall],
        lengthArray: [...lengthArray],
        startXArr: [...startXArr],
        svgBeginning: [...svgBeginning],
      };
    };

    ///////

    const handleSavePlan = () => {
      myStorage.setItem(
        `Object ${modelToSave.id}`,
        JSON.stringify(modelToSave)
      );

      window.location.reload();
    };

    //////

    const handleReset = () => {
      setDisplay(false);
      wall[wallNumber] = [];
      xCount[wallNumber] = [0];
      yCount[wallNumber] = [0];
      xCoOrdinates[wallNumber] = [0];
      yCoOrdinates[wallNumber] = [0];
      svgFillArr[wallNumber] = "none";
      svgStroke2 = 1;

      setChange((p) => !p);
    };

    let displayDrawBox = ({ display }) => {
      if (!display) {
        return (
          <>
            <div className="tools">
              <form id="formDraw">
                <button
                  type="submit"
                  name="buttonUp"
                  className="upPlanButton"
                  onClick={(e) => handleChange(e)}
                ></button>
                <br></br>
                <button
                  type="submit"
                  name="buttonLeft"
                  className="leftPlanButton"
                  onClick={(e) => handleChange(e)}
                ></button>
                <input
                  id="wallLength"
                  type="number"
                  placeholder="length"
                ></input>
                <button
                  type="submit"
                  name="buttonRight"
                  className="rightPlanButton"
                  onClick={(e) => handleChange(e)}
                ></button>
                <br></br>
                <button
                  type="submit"
                  name="buttonDown"
                  className="downPlanButton"
                  onClick={(e) => handleChange(e)}
                ></button>
              </form>

              <br></br>

              <div className="buttonsBox">
                <button
                  name="window"
                  className={
                    wall[wallNumber][wall[wallNumber].length - 1] ===
                    ` L ${startXArr[wallNumber]} 0`
                      ? "windowButton"
                      : "disabled"
                  }
                  onClick={handleWindow}
                >
                  window
                </button>
                <button
                  name="door"
                  className={
                    wall[wallNumber][wall[wallNumber].length - 1] ===
                    ` L ${startXArr[wallNumber]} 0`
                      ? "doorButton"
                      : "disabled"
                  }
                  onClick={handleDoor}
                >
                  door
                </button>
                <button
                  name="resetPlan"
                  className="resetPlanButton"
                  onClick={handleReset}
                >
                  reset
                </button>
                <button
                  name="closePlan"
                  className={
                    wall[wallNumber][wall[wallNumber].length - 1] ===
                    ` L ${startXArr[wallNumber]} 0`
                      ? "closePlanButton"
                      : "disabled"
                  }
                  onClick={handleDone}
                >
                  done
                </button>
              </div>
            </div>
          </>
        );
      }
    };

    ///////

    let displaySaveBox = ({ display }) => {
      if (display) {
        return (
          <div className="saveBox">
            <h5>Do you want to save your plan?</h5>
            <div className="saveBoxButtons">
              <button className="savePlanButton" onClick={handleSavePlan}>
                Save
              </button>
              <button className="resetPlanButton" onClick={handleReset}>
                Reset
              </button>
            </div>
          </div>
        );
      }
    };

    let displayAddBox = () =>
      boxDisplay && (windowDisplay ? displayWindow() : displayDoor());

    if (displaySVG) {
      return (
        <>
          <button
            className="leftWallBtn"
            onClick={(e) => handleLeftWallBtn(e)}
          ></button>
          <button
            className="rightWallBtn"
            onClick={(e) => handleRightWallBtn(e)}
          ></button>
          <svg
            className="planSVG"
            viewBox={svgViewBox2}
            style={{ width: 600, height: 300, border: "1px solid #eee" }}
          >
            {startPathArr}

            {wallPathArr[wallNumber]}
          </svg>
          <p>
            Wall <span>#{wallNumber + 1}</span> length:{" "}
            <span>{lengthArray[wallNumber]}</span> cm
          </p>
          <br></br>
          <p>Close wall to add doors and windows</p>
          {displayDrawBox({ display })}
          {displaySaveBox({ display })}
          {displayAddBox()}
        </>
      );
    }
  }

  return (
    <section className='middleSection'>
      <div className="selectBox">
        <form>
          <h2>Select Plan:</h2>

          <select onChange={onSVGPlanChange} defaultValue={'default'}>
            <option value='default' disabled>
              {" "}
              -- Select Plan --{" "}
            </option>
            {options.map((item) => (
              <option key={item.ID} value={item.value}>
                {item.ID}
              </option>
            ))}
          </select>
        </form>
      </div>
      <div className="planBox">
        {miniSVG(displaySVG)}

        {DrawWallsSVG(displaySVG)}
      </div>
    </section>
  );
};
