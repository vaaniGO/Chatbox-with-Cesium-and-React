import React, { useEffect, useRef } from 'react';
import { Viewer, Entity } from "resium";
import { Cartesian3, Ion, Color, SceneMode, OpenStreetMapImageryProvider, Rectangle } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Set the Cesium Ion access token
window.CESIUM_BASE_URL = "/cesium";
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMDRiYjEyZC1jNDYzLTQ1YjYtOTRhOS1iYWQ2MmUxNTVlNDQiLCJpZCI6MjY4ODY3LCJpYXQiOjE3MzY4NDIxODR9.kzkK7ll2BqwUBdyxOcVZnGpbhTyRbBPTWUqDUYHWMWE' 
const osm = new OpenStreetMapImageryProvider({
    url : 'https://tile.openstreetmap.org/'
});

const CesiumMap = () => {
    
  return (
    <div
      id="cesium-container"
      style={{
        width: '100%',  // Ensure full width
        height: '100%', // Ensure full height
        position: 'relative', // Allow Cesium Viewer to take the full space
      }}
    >
        <Viewer sceneMode={SceneMode.SCENE2D}
        imageryProvider = {osm}
        >
        {/* Add an entity: a point on the map */}
        <Entity
            name="Sample Point"
            description="This is a sample point added to the map."
            position={Cartesian3.fromDegrees(-75.59777, 40.03883, 0)} // Longitude, Latitude, Altitude
            point={{ pixelSize: 10, color: Color.RED }}
        />
        <Entity
            name="Sample Rectangle"
            description="This is a sample rectangle added to the map."
            rectangle={{
                coordinates: Rectangle.fromDegrees(-110.0, 30.0, -100.0, 40.0), // Rectangle bounds (west, south, east, north)
                material: Color.RED.withAlpha(0.5), // Set rectangle material (color with transparency)
            }}
        />
        </Viewer>

    </div>
  );
};

export default CesiumMap;
