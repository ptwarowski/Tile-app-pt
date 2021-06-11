import React, { useState } from "react";

import { calculate } from "./calculator";

let svgViewBox = `-80 -80 600 420`;
let svgFill = "gainsboro";
let svgStroke = 6;
let displaySVG = false;
let lengthArray = [];
let startXArr = [];

let tile = {
  id: "",
  name: "",
  width: 0,
  height: 0,
  stroke: "",
  color: "",
};

let svgFillArr = [];
let svgStroke2 = 1;
let svgViewBox2 = `0 -310 200 330`;
let startPathArr = [];
let wallsSVG = [];
let wallPathArr = [];

const myStorage = window.localStorage;

let modelObjectArr = [];
let tileObjectArr = [];
let positionArr = [];

export const PutTiles = () => {
  const [line, setLine] = useState([]);
  const [valueSVG, setValueSVG] = useState("");
  const [wallNumber, setWallNumber] = useState(0);
  // eslint-disable-next-line
  const [change, setChange] = useState(false);
  const [amount, setAmount] = useState(0);

  const options = [];
  const optionsTile = [];
  modelObjectArr = [];
  tileObjectArr = [];

  for (let i = 0; i < myStorage.length; i++) {
    let label = myStorage.key(i);

    if (label[0] === "O") {
      let option = { ID: label, value: modelObjectArr.length };
      options.push(option);
      modelObjectArr = [
        ...modelObjectArr,
        JSON.parse(myStorage[myStorage.key(i)]),
      ];
    }
  }

  for (let i = 0; i < myStorage.length; i++) {
    let label = myStorage.key(i);

    if (label[0] === "T") {
      let option = { ID: label, value: tileObjectArr.length };
      optionsTile.push(option);
      tileObjectArr = [
        ...tileObjectArr,
        JSON.parse(myStorage[myStorage.key(i)]),
      ];
    }
  }

  ////

  const onSVGPlanChange = (e) => {
    setValueSVG(modelObjectArr[e.target.value].planSVG);
    setWallNumber(0);
    setLine([]);
    displaySVG = true;
    startPathArr = [];
    wallPathArr = [];
    positionArr = [];

    startXArr = [...modelObjectArr[e.target.value].startXArr];

    lengthArray = [...modelObjectArr[e.target.value].lengthArray];

    wallsSVG = [...modelObjectArr[e.target.value].wallsSVG];

    setLine([...modelObjectArr[e.target.value].lineArray]);

    svgViewBox2 = `0 -330 ${lengthArray[0]} 360`;

    for (let i = 0; i < lengthArray.length; i++) {
      positionArr = [...positionArr, [0, 0]];
    }

    e.preventDefault();
  };

  //////

  const onTileChange = (e) => {
    tile = {
      ...tile,

      id: tileObjectArr[e.target.value].ID,

      name: tileObjectArr[e.target.value].name,

      width: tileObjectArr[e.target.value].width,

      height: tileObjectArr[e.target.value].height,

      stroke: tileObjectArr[e.target.value].stroke,

      color: tileObjectArr[e.target.value].color,
    };
    setChange((p) => !p);
    e.preventDefault();
  };

  ///

  const handleLeftWallBtn = () => {
    const nWallNumber = wallNumber - 1;

    if (nWallNumber === -1) {
      setWallNumber(line.length - 1);
      svgViewBox2 = `${startXArr[lengthArray.length - 1]} -330 ${
        lengthArray[line.length - 1]
      } 360`;
    } else {
      setWallNumber(nWallNumber);
      svgViewBox2 = `${startXArr[nWallNumber]} -330 ${lengthArray[nWallNumber]} 360`;
    }
  };

  /////

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

  //////

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
          <defs>
            <filter id="f1" x="0" y="0" width="200%" height="200%">
              <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
              <feGaussianBlur result="blurOut" in="offOut" stdDeviation="20" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>

          <path
            id="planStrong"
            d={line[wallNumber]}
            stroke="goldenrod"
            strokeWidth={3 * svgStroke}
            filter="url(#f1)"
          />
        </svg>
      );
  };

  //////

  function drawWallsSVG(displaySVG) {
    startPathArr = [];
    wallPathArr = [];

    let z;
    for (z = 0; z < lengthArray.length; z++) {
      svgFillArr.push("none");
    }

    let i;
    for (i = 1; i < lengthArray.length + 1; i++) {
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
          filter="url(#f1)"
        />,
      ];

      wallPathArr = [
        ...wallPathArr,
        <path
          key={i - 1}
          id={`wallPath${i - 1}`}
          d={`M ${startXArr[i - 1]} 0 L ${
            lengthArray[i - 1] + startXArr[i - 1]
          } 0 ${wallsSVG[i - 1].join(" ")}`}
          stroke="black"
          strokeWidth={svgStroke2}
          fill="url(#tile)"
        />,
      ];
    }

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
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="50%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: tile.color, stopOpacity: 0.95 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: tile.color, stopOpacity: 0.9 }}
                />
                <stop
                  offset="60%"
                  style={{ stopColor: tile.color, stopOpacity: 1 }}
                />
              </linearGradient>
              <pattern
                id="tile"
                patternUnits="userSpaceOnUse"
                x={startXArr[wallNumber] + positionArr[wallNumber][0]}
                y={-positionArr[wallNumber][1]}
                width={tile.width}
                height={tile.height}
              >
                <rect
                  id="element"
                  x="0"
                  y="0"
                  width={tile.width}
                  height={tile.height}
                  stroke={tile.stroke}
                  strokeWidth="0.3"
                  fill="url(#gradient)"
                />
              </pattern>

              <filter id="f1" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
                <feGaussianBlur
                  result="blurOut"
                  in="offOut"
                  stdDeviation="20"
                />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
              </filter>
            </defs>
            {startPathArr}
            {wallPathArr[wallNumber]}
          </svg>
        </>
      );
    }
  }

  //////

  const onXPositionChange = (x) => {
    positionArr[wallNumber][0] = parseInt(x.target.value);
    console.log(positionArr);
    setChange((p) => !p);
  };

  ///////

  const onYPositionChange = (y) => {
    positionArr[wallNumber][1] = parseInt(y.target.value);
    console.log(positionArr);
    setChange((p) => !p);
  };

  return (
    <section className='middleSection'>
      <div className="selectBox">
        <div id="modelInput" className="modelInput">
          <form>
            <h2>Select Plan:</h2>
            <select onChange={onSVGPlanChange} defaultValue={'default'}>
            <option value='default' disabled> -- Select Plan -- </option>
              {options.map((item) => (
                <option key={item.ID} value={item.value}>
                  {item.ID}
                </option>
              ))}
            </select>
          </form>
        </div>
        <div id="tileInput" className="tileInput">
          <form>
            <h2>Select Tile:</h2>
            <select onChange={onTileChange} defaultValue={'default'}>
            <option value='default' disabled> -- Select Tile -- </option>
              {optionsTile.map((item) => (
                <option key={item.ID} value={item.value}>
                  {item.ID}
                </option>
              ))}
            </select>
          </form>
        </div>
      </div>
      <div className="planBox">
        {miniSVG(displaySVG)}

        {drawWallsSVG(displaySVG, wallNumber)}
      </div>
      {positionArr[wallNumber] && (
        <>
          <div className="sliders">
            <p>
              Set tile position: x is <span>{positionArr[wallNumber][0]}</span>{" "}
              and y is <span>{positionArr[wallNumber][1]}</span> from left-bottom
              corner and click calculate button.
            </p>
          
            <input
              type="range"
              step={1}
              id="volumeX"
              name="positionX"
              value={positionArr[wallNumber][0]}
              min={0}
              max={tile.width}
              onChange={(x) => onXPositionChange(x)}
            ></input>
            <input
              type="range"
              step={1}
              id="volumeY"
              name="positionY"
              value={positionArr[wallNumber][1]}
              min={0}
              max={tile.height}
              onChange={(y) => onYPositionChange(y)}
            ></input>
            <button
            className={
              (tile.height !== 0) & (wallPathArr.length > 0)
                ? "calc__btn calc__btn__pos"
                : "disabled calc__btn__pos"
            }
            onClick={() =>
              setAmount(
                calculate(lengthArray, wallsSVG, startXArr, tile, positionArr)
              )
            }
          >
            Calculate
          </button>
          </div>
          
          <br />
          {amount > 0 && (
            <p className="result">
              You will need <span>{amount}</span> tiles.
            </p>
          )}
        </>
      )}
    </section>
  );
};
