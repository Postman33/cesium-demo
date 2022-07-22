import { Component, OnInit } from '@angular/core';
import * as Cesium from 'cesium';

@Component({
  selector: 'app-cesium-viewer',
  templateUrl: './cesium-viewer.component.html',
  styleUrls: ['./cesium-viewer.component.css']
})
export class CesiumViewerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account

    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmQ1OGZlZC00Y2ZkLTRiMmEtYWYwNC0xYTRiYjZjODMxMzciLCJpZCI6MTAyMTU4LCJpYXQiOjE2NTg0ODUzOTZ9.iFLj0GX0uOMvS0hPyjkhfyK9JygdishYZIdag5xm3PY';
    // @ts-ignore
    window.CESIUM_BASE_URL = '/assets/cesium/';
// Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    });
// Add Cesium OSM Buildings, a global 3D buildings layer.
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());
// Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      orientation : {
        heading : Cesium.Math.toRadians(0.0),
        pitch : Cesium.Math.toRadians(-15.0),
      }
    });
  }

}
