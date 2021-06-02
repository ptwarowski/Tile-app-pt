export const calculate = (
  lengthArray,
  wallsSVG,
  startXArr,
  tile,
  positionArr
) => {
  let maxXDivArr = [];
  let maxYDivArr = [];
  let modYCutArray = [];
  let wallXArr = [];
  let wallYArr = [];
  let modArray = [];
  let dwArray = [];

  let array = [];
  let svgArray = [];
  let yCutArray = [];
  let xCutArray = [];
  let xCutEndArray = [];
  let xyCutArray = [];
  let xyCutEndArray = [];

  let restArray = [];
  let unusedArray = [];
  let lastArray = [];
  let amount = 0;

  console.log(lengthArray, wallsSVG, startXArr, tile, positionArr);

  const getMaxYDiv = () => {
    for (let i = 0; i < svgArray.length; i++) {
      wallYArr = [...wallYArr, []];
      for (let j = 0; j < svgArray[i].length; j++) {
        svgArray[i][j] = svgArray[i][j].split(" ");
        svgArray[i][j] = [
          parseInt(svgArray[i][j][0]) - startXArr[i],
          parseInt(svgArray[i][j][1]),
        ];
        wallYArr[i].push(Math.abs(svgArray[i][j][1]));
      }
      svgArray[i] = [[0, 0], [lengthArray[i], 0], ...svgArray[i]];
      wallYArr[i].sort((a, b) => b - a);
      maxYDivArr[i] = Math.floor(wallYArr[i][0] / tile.height);
    }
  };

  /////

  const getMaxXDiv = () => {
    for (let i = 0; i < svgArray.length; i++) {
      wallXArr = [...wallXArr, []];
      for (let j = 0; j < svgArray[i].length; j++) {
        wallXArr[i].push(Math.abs(svgArray[i][j][0]));
      }
      wallXArr[i].sort((a, b) => b - a);
      maxXDivArr[i] = Math.floor(
        (wallXArr[i][0] - positionArr[i][0]) / tile.width
      );
    }
  };

  // max Div after positionning

  /////

  const svgReducer = (array) => {
    for (let i = 0; i < array.length; i++) {
      for (let j = array[i].length - 2; j > 0; j--)
        if (
          (array[i][j][0] === array[i][j + 1][0]) &
          (array[i][j][1] === array[i][j + 1][1])
        ) {
          array[i].splice(j, 2); 
          (j = array[i].length - 1);
        }
      (array[i][array[i].length - 1][0] === 0) &
        (array[i][array[i].length - 1][1] === 0) && array[i].pop();
    }
  };
  // reducing repeting points of SVG and end [0, 0]

  const restSorter = (array) => {
    array.sort((a, b) => a - b);
  };

  //

  for (let i = 0; i < lengthArray.length; i++) {
    array.push(wallsSVG[i].join(""));
    svgArray.push(array[i].substring(3));
    svgArray[i] = svgArray[i].substring(0, svgArray[i].length - 2);
    svgArray[i] = svgArray[i].split(" L ");
  }

  getMaxYDiv();

  getMaxXDiv();

  ////////

  const xCut = () => {
    let nSVGArray = JSON.parse(JSON.stringify(svgArray));
    let arr = [];

    xCutArray = JSON.parse(JSON.stringify(svgArray));
    xCutEndArray = JSON.parse(JSON.stringify(svgArray));

    for (let i = 0; i < xCutArray.length; i++) {
      xCutArray[i].map(
        (item) => item[0] > positionArr[i][0] && (item[0] = positionArr[i][0])
      );
      xCutEndArray[i].map(
        (item) =>
          (item[0] = item[0] - positionArr[i][0] - maxXDivArr[i] * tile.width)
      );
      nSVGArray[i].map((item) => (item[0] = item[0] - positionArr[i][0]));
      nSVGArray[i].map((item) => item[0] < 0 && (item[0] = 0));
      nSVGArray[i].map(
        (item) =>
          item[0] >= maxXDivArr[i] * tile.width &&
          (item[0] = maxXDivArr[i] * tile.width)
      );
      xCutEndArray[i].map((item) => item[0] < 0 && (item[0] = 0));
    }

    svgArray = nSVGArray;

    arr = [];
    for (let i = 0; i < nSVGArray.length; i++) {
      arr[i] = nSVGArray[i].filter((item) => item[0] === 0);
    }

    for (let i = nSVGArray.length - 1; i >= 0; i--) {
      arr[i].length === nSVGArray[i].length && nSVGArray.splice(i, 1);
    }

    arr = [];
    for (let i = 0; i < xCutArray.length; i++) {
      arr[i] = xCutArray[i].filter((item) => item[0] === 0);
    }

    for (let i = xCutArray.length - 1; i >= 0; i--) {
      arr[i].length === xCutArray[i].length && xCutArray.splice(i, 1);
    }

    arr = [];
    for (let i = 0; i < xCutEndArray.length; i++) {
      arr[i] = xCutEndArray[i].filter((item) => item[0] === 0);
    }

    for (let i = xCutEndArray.length - 1; i >= 0; i--) {
      arr[i].length === xCutEndArray[i].length && xCutEndArray.splice(i, 1);
    }

    svgReducer(xCutArray);
    svgReducer(xCutEndArray);
  };

  //bez ścinek szerokości, zostają w (xCutArray, xCutEndArray)

  ///////////

  const yCut = (array) => {
    yCutArray = JSON.parse(JSON.stringify(array));

    for (let i = 0; i < maxYDivArr[0]; i++) {
      for (let j = 0; j < array.length; j++) {
        array[j].map(
          (item) => item[1] < -tile.height && (item[1] = -tile.height)
        );
        yCutArray[j].map(
          (item) =>
            item[1] < -tile.height &&
            (item[1] = item[1] + parseInt(tile.height))
        );
      }
      modArray = [...modArray, ...array];
    }

    modYCutArray = [...modYCutArray, ...yCutArray];

    for (let i = 0; i < modYCutArray.length; i++) {
      for (let j = 0; j < modYCutArray[i].length; j++) {
        modYCutArray[i][j][1] === -tile.height && (modYCutArray[i][j][1] = 0);
      }
    }

    for (let i = modYCutArray.length - 1; i >= 0; i--) {
      modYCutArray[i].length < 4 && modYCutArray.splice(i, 1);
    }

    for (let i = 0; i < yCutArray; i++) {
      yCutArray[i].length < 2 && (yCutArray[i].length = 0);
    }

    yCutArray.length !== 0 && svgReducer(yCutArray);

    console.log("yCutArrayx", yCutArray);
  };

  ///////

  const yxCut = () => {
    for (let i = 0; i < yCutArray; i++) {
      yCutArray[i].length < 3 && (yCutArray[i].length = 0);
    }
    let nSVGArray = JSON.parse(JSON.stringify(yCutArray));
    xyCutArray = JSON.parse(JSON.stringify(yCutArray));
    xyCutEndArray = JSON.parse(JSON.stringify(yCutArray));
    let arr = [];

    for (let i = 0; i < xyCutArray.length; i++) {
      xyCutArray[i].map(
        (item) => item[0] > positionArr[i][0] && (item[0] = positionArr[i][0])
      );
      xyCutEndArray[i].map(
        (item) =>
          (item[0] = item[0] - positionArr[i][0] - maxXDivArr[i] * tile.width)
      );
      nSVGArray[i].map((item) => (item[0] = item[0] - positionArr[i][0]));
      nSVGArray[i].map((item) => item[0] < 0 && (item[0] = 0));
      nSVGArray[i].map(
        (item) =>
          item[0] >= maxXDivArr[i] * tile.width &&
          (item[0] = maxXDivArr[i] * tile.width)
      );
      xyCutEndArray[i].map((item) => item[0] < 0 && (item[0] = 0));
    }

    arr = [];
    for (let i = 0; i < xyCutArray.length; i++) {
      arr[i] = xyCutArray[i].filter((item) => item[0] === 0);
    }

    for (let i = xyCutArray.length - 1; i >= 0; i--) {
      arr[i].length === xyCutArray[i].length && xyCutArray.splice(i, 1);
    }

    arr = [];
    for (let i = 0; i < xyCutEndArray.length; i++) {
      arr[i] = xyCutEndArray[i].filter((item) => item[0] === 0);
    }

    for (let i = xyCutEndArray.length - 1; i >= 0; i--) {
      arr[i].length === xyCutEndArray[i].length && xCutEndArray.splice(i, 1);
    }

    svgReducer(xyCutArray);
    svgReducer(xyCutEndArray);
  };

  //bez ścinek z wysokości, zostają w (yCutArray)

  //////

  const yCutSorter = () => {
    let cornerArray = [];
    let arr = [];

    for (let i = 0; i < modYCutArray.length; i++) {
      arr.push(modYCutArray[i][2]);
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i][0] % tile.height !== 0 && cornerArray.push(arr[i]);
    }
    for (let i = arr.length - 1; i > 0; i--) {
      arr[i][0] % tile.height !== 0 && arr.splice(i, 1);
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][0] / tile.height !== 1) {
        arr.push([arr[i][0] - tile.height, arr[i][1]]);
        arr[i][0] = parseInt(tile.height);
      }
    }

    for (let i = 0; i < arr.length; i++) {
      unusedArray.push(parseInt(tile.height) + parseInt(arr[i][1]));
      lastArray.push(parseInt(tile.height));
    }

    let sortedCornerArray = cornerArray.sort((a, b) => a[0] - b[0]);

    ////////

    const cutReduction = (array, number) => {
      for (let i = 0; i < array.length; i++) {
        for (let j = array.length - 1; j > 0; j--) {
          if (array[i][0] + array[j][0] <= number) {
            restArray.push(number);
            unusedArray.push(parseInt(tile.height) + parseInt(arr[i][1]));
            array.splice(j, 1);
            array.splice(i, 1);
            i = 0;
            j = array.length - 1;
          }
        }
      }
    };

    cutReduction(sortedCornerArray, tile.height);

    console.log("unused", unusedArray);

    console.log("xx", arr);
    console.log("xxx", sortedCornerArray);
  };

  xCut();
  yCut(svgArray);
  yCut(xCutArray);
  yCut(xCutEndArray);
  yCutArray.length > 2 && yxCut();
  modYCutArray > 2 && yCutSorter();

  console.log("myca", modYCutArray);

  //////

  modArray.map((item) => {
    let x = 1;
    if (
      (item[item.length - 1][0] === 0) &
      (item[item.length - 1][1] === 0) &
      (x === 1)
    ) {
      item.pop();
      return x = 1;
    } else {
      return x = 0;
    }
  });

  //usuwanie [0,0] z końca zamknięcia

  dwArray = modArray.filter((item) => item.length > 6); // podział na ściany i ściany z otworami
  modArray = modArray.filter((item) => item.length <= 6);

  for (let i = 0; i < modArray.length; i++) {
    lastArray.push(modArray[i][1][0]);
  }

  restArray = lastArray.filter((item) => item % tile.width !== 0);
  lastArray = lastArray.filter((item) => item % tile.width === 0);

  // eslint-disable-next-line
  let arr = dwArray.filter(
    (item) => (item[0] === 0) | (item[0] === -tile.height)
  );

  // sprawdzanie otworu 1

  for (let i = 0; i < dwArray.length; i++) {
    restArray.push(Math.abs(dwArray[i][5][0]));
    restArray.push(Math.abs(dwArray[i][1][0] - dwArray[i][7][0]));
  }

  for (let i = restArray.length - 1; i >= 0; i--) {
    if (restArray[i] > tile.width) {
      (lastArray.push(tile.width * Math.floor(restArray[i] / tile.width)));
      (restArray[i] = restArray[i] - tile.width * Math.floor(restArray[i] / tile.width));
      }
  }

  restSorter(restArray);
  restSorter(unusedArray);

  console.log("uA", unusedArray);

  console.log("rA", restArray);

  for (let i = 0; i < restArray.length; i++) {
    for (let j = restArray.length - 1; j > 0; j--) {
      if (restArray[i] + restArray[j] <= tile.width) {
        lastArray.push(parseInt(tile.width));
        restArray.splice(j, 1);
        restArray.splice(i, 1);
        i = 0;
        j = restArray.length;
      }
    }
  }

  if (tile.height === tile.width) {
    for (let i = restArray.length - 1; i > 0; i--) {
      for (let j = unusedArray.length - 1; j > 0; j--) {
        if (restArray[i] < unusedArray[j]) {
          unusedArray.splice(j, 1);
          restArray.splice(i, 1);
        }
      }
    }
  }

  for (let i = 0; i < restArray.length; i++) {
    lastArray.push(parseInt(tile.width));
  }

  lastArray.map((item) => parseInt(item));

  amount = lastArray.reduce((total, item) => total + item, 0) / tile.width;

  console.log(amount);

  return amount;
};
