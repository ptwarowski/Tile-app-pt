import React from 'react';
import {  Link } from "react-router-dom";

export const Header = () => {
  return (
    <header id="header">
      <div className="header">
        <div className="logo">
          <p>
            <span> Tile </span>Calculator
          </p>
        </div>
        <nav className="navBar">
          <ul className="list">
            <Link to="/app.html"><li>
              Add Plan
            </li></Link>
            <Link to="/drawWalls.html"><li>
              Add Walls
            </li></Link>
            <Link to="/addTile.html"><li>
              Add Tile
            </li></Link>
            <Link to="/putTiles.html"><li>
              Put Tiles
            </li></Link>
          </ul>
        </nav>
      </div>
    </header>
  );
};
