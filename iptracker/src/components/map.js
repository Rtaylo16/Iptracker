import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import React, { useState, useEffect } from 'react';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../App.css';
import axios from 'axios';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [map, setMap] = useState(null);
  const theme = useTheme();
  const isNotXSmall = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    if (searchInput) {
      axios
        .get(`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_API_KEY}&ipAddress=${searchInput}`)
        .then((res) => {
          setLocation(res.data);
          if (map && res.data.location) {
            const { lat, lng } = res.data.location;
            map.flyTo([lat, lng], 13, {
              duration: 1.5,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [searchInput, map]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(inputValue);
  };

  return (
    <div className="mapDiv">
      <Paper
        className="input"
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
        onSubmit={handleSearch}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Enter IP Address"
          inputProps={{ 'aria-label': 'search IP address' }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      <Box sx={{ 
          display: 'flex', 
          flexDirection: isNotXSmall ? 'row' : 'column', 
          alignItems: 'center', 
          justifyContent: 'space-evenly', 
          backgroundColor: 'white',
          borderRadius: '5px',
          width: '100%',
          padding: '10px',
        }}>
        {location && (
          <>
            <text style={{ color: 'gray', fontWeight: 'bold' }}>
              IP Address: <span style={{ color: 'black' }}>{location.ip}</span>
            </text>
            <Divider orientation={isNotXSmall ? "vertical" : "horizontal"} variant="middle" flexItem />
            <text style={{ color: 'gray', fontWeight: 'bold' }}>
              Location: <span style={{ color: 'black' }}>{location.location.city}, {location.location.country}</span>
            </text>
            <Divider orientation={isNotXSmall ? "vertical" : "horizontal"} variant="middle" flexItem />
            <text style={{ color: 'gray', fontWeight: 'bold' }}>
              Timezone: <span style={{ color: 'black' }}>{location.location.timezone}</span>
            </text>
            <Divider orientation={isNotXSmall ? "vertical" : "horizontal"} variant="middle" flexItem />
            <text style={{ color: 'gray', fontWeight: 'bold' }}>
              ISP: <span style={{ color: 'black' }}>{location.isp}</span>
            </text>
          </>
        )}
      </Box>

      <MapContainer
        center={location ? [location.location.lat, location.location.lng] : [45.4, -75.7]}
        zoom={location ? 13 : 3.5}
        scrollWheelZoom={false}
        className="leaflet-container"
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {location && (
          <Marker position={[location.location.lat, location.location.lng]}>
            <Popup>
              <div>
                <p>IP Address: {location.ip}</p>
                <p>
                  Location: {location.location.city}, {location.location.country}
                </p>
                <p>Timezone: {location.location.timezone}</p>
                <p>ISP: {location.isp}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}