import {Component, OnInit} from '@angular/core';
import * as Cesium from 'cesium';

@Component({
  selector: 'app-cesium-viewer',
  templateUrl: './cesium-viewer.component.html',
  styleUrls: ['./cesium-viewer.component.css']
})
export class CesiumViewerComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token from your ion account

    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmQ1OGZlZC00Y2ZkLTRiMmEtYWYwNC0xYTRiYjZjODMxMzciLCJpZCI6MTAyMTU4LCJpYXQiOjE2NTg0ODUzOTZ9.iFLj0GX0uOMvS0hPyjkhfyK9JygdishYZIdag5xm3PY';
    // @ts-ignore
    window.CESIUM_BASE_URL = '/assets/cesium/';

    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals : true
      }),
    });
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());

    viewer.extend(Cesium.viewerCesiumInspectorMixin);
    viewer.scene.moon = new Cesium.Moon(); // Почему не работает?

    viewer.scene.sun = new Cesium.Sun() // И это тоже
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees( 37.175657,55.989027, 800),
    });

    viewer.scene.globe.enableLighting = true;
    console.log(viewer.scene)
    console.log(  viewer.scene.moon.isDestroyed())
  }

}
