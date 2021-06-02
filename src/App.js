import React from 'react';
import { Header } from "./js/header"
import './App.scss';
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { DrawPlan } from "./js/drawPlan";
import { DrawWalls } from "./js/drawWalls";
import { AddTile } from "./js/addTile";
import { PutTiles } from "./js/putTiles";
import { Footer } from "./js/footer"
import { Start } from "./js/start"

export const App = () => {
  return (
    <>
    <Router>
      <Header/>
      <Switch>
        <Route path="/" exact><Start/></Route>
        <Route path="/app.html" exact><DrawPlan/></Route>
        <Route path="/drawWalls.html"><DrawWalls/></Route>
        <Route path="/addTile.html"><AddTile/></Route>  
        <Route path='/putTiles.html'><PutTiles/></Route>
        <Route path="*"><h1 style={{width: "100%",textAlign: "center"}}>Page not found</h1></Route>
      </Switch>
      
    </Router>
    <Footer/>
    </>
  );
}


