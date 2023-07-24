import logo from './logo.svg';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup,} from 'react-leaflet'
import { Icon } from "leaflet";
import * as parkData from "./data/skateboardparks.json";
import React from 'react';
import Map from './components/map';

const position = [51.505, -0.09]

function App() {
  return (
 <div>
   <header className ="header">
    <text className='title'>IP Address Tracker
    </text>
   </header>
   <Map/>
 </div>
  );
}

export default App;
