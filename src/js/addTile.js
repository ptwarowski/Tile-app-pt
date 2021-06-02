import React, { useState } from 'react';

let tDisplay = false;
let tileViewBox = ``;
const myStorage = window.localStorage;

//////

export const AddTile = () => {
const [tile, setTile] = useState({ID: Date.now(), name: "", width:0, height:0, color:"#FFFFFF", stroke:"#000000"});  

  const handleAddTile = (event) => {
    event.preventDefault(); 
    myStorage.setItem(`Tile: ${tile.name}`, JSON.stringify(tile)); 
    window.location.reload();
  }

  const handleTileChange = (event) => {
    const {name, value} = event.target;
    setTile((prevState)=>{return {
      ...prevState, 
      [name]: value}});
      tDisplay=true;
  }

  const tileDisplay = (tDisplay) => {
    tileViewBox=`-10 -10 ${2*tile.width+20} ${2*tile.height+20}`;
    let Gradient = (tile) => {return (
    <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="50%" y2="0%">
      <stop offset="0%" style={{stopColor: tile.color, stopOpacity:0.9 }} />
      <stop offset="50%" style={{stopColor: tile.color, stopOpacity:0.8}} />
      <stop offset="60%" style={{stopColor: tile.color, stopOpacity:1}} />
    </linearGradient>
    </defs>)}
    

    if (tDisplay) return (
      <section className='svgTileSection'>
        <p>{tile.name}</p>
        <svg className="tileSVG" viewBox={tileViewBox} style={{width:700, height:250}} >
          {Gradient(tile)}
          <rect x={tile.width} y={tile.height} width={tile.width} height={tile.height} stroke={tile.stroke} strokeWidth="0.3" fill="url(#gradient)" />
          <rect x={tile.width} y="0" width={tile.width} height={tile.height} stroke={tile.stroke} strokeWidth="0.3" fill="url(#gradient)" />
          <rect x="0" y={tile.height} width={tile.width} height={tile.height} stroke={tile.stroke} strokeWidth="0.3" fill="url(#gradient)" />
          <rect x="0" y="0" width={tile.width} height={tile.height} stroke={tile.stroke} strokeWidth="0.3" fill="url(#gradient)" />
          <text fill={tile.stroke} fontSize={tile.height/6} fontFamily="Verdana" x={2*tile.width+tile.width/6} y={2*tile.height}>
          </text>
          
        </svg>
        
      </section>
    )

    
  }
  
  return (
    <section className='middleSection'>
      <h2>Add Tile:</h2>
      <section className='formTileSection'>
        <form className='tileform'>
          <div>
            <p>Set tile name:</p> <input id="tileName" name="name" type="text" value={tile.name} placeholder="Tile name" onChange={handleTileChange}></input>
            <p>Set tile color:</p> <input id="tileColor" name="color" type="color" value={tile.color} onChange={handleTileChange}></input>
          </div>    
          <div>  
            <p>Set tile width:</p> <input id="tileWidth" name="width" type="text" value={parseInt(tile.width)} onChange={handleTileChange}></input>
            <p>Set joint color:</p> <input id="tileStroke" name="stroke" type="color" value={tile.stroke} onChange={handleTileChange}></input>
          </div> 
          <div>    
            <p>Set tile height:</p> <input id="tileHeight" name="height" type="text" value={parseInt(tile.height)} onChange={handleTileChange}></input>
          <button type="submit" className="tile_Submit" onClick={handleAddTile}>Save</button>  
          </div>
          
        </form>
      </section>
      {tileDisplay(tDisplay)}
      
    </section>
  )
}