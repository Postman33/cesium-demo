import {Component, OnInit} from '@angular/core';
import * as Cesium from 'cesium';
import {BillboardCollection, ScreenSpaceEventType} from 'cesium';
import {TestDevModule} from "../../modules/TestDevModule";
import {PropertiesViewer} from "../../modules/PropertiesViewer";
import {CloudsModule} from "../../modules/CloudsModule";

@Component({
  selector: 'app-cesium-viewer',
  templateUrl: './cesium-viewer.component.html',
  styleUrls: ['./cesium-viewer.component.css']
})
export class CesiumViewerComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

// Your token can be found at https://cesium.com/ion/tokens
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NmQ1OGZlZC00Y2ZkLTRiMmEtYWYwNC0xYTRiYjZjODMxMzciLCJpZCI6MTAyMTU4LCJpYXQiOjE2NTg0ODUzOTZ9.iFLj0GX0uOMvS0hPyjkhfyK9JygdishYZIdag5xm3PY';
    // @ts-ignore
    window.CESIUM_BASE_URL = '/assets/cesium/';
    const viewer = new Cesium.Viewer('cesiumContainer', {

      terrainProvider: Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
      }),
      imageryProvider: Cesium.createWorldImagery(),
      animation: false,
      // imageryProvider : Cesium.createWorldImagery({
      //   style : Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
      // }),
    });
    viewer.scene.globe.enableLighting = false; // Глобальное освещение
  //  viewer.extend(Cesium.viewerCesiumInspectorMixin);
    viewer.scene.moon = new Cesium.Moon({
      onlySunLighting: false
    }); // Почему не работает?

    viewer.scene.sun = new Cesium.Sun() // И это тоже

    // иногда называют osmBuildings в документации, что-то типа 3д зданий
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());


    // Как ни странно, порядок оказывается здсеь важен
    buildingTileset.style = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
          "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(37.175657, 55.989027))",
        newHeight: "${feature['cesium#estimatedHeight']}"
      },
      color: {
        conditions: [
          ["${newHeight} > 90", "color('#c79228')"],
          ["${newHeight} > 60", "color('#0765A9')"],
          ["${newHeight} > 45", "color('#751a37')"],
          ["${newHeight} > 20", "color('#953ead')"],
          ["true", "color('#abb85c')"]
        ],
      },
    });


    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(37.175657, 55.989027, 800),
    });

    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement: { position: Cesium.Cartesian2; }) {
      const pickedFeature = viewer.scene.pick(movement.position);
      console.log(pickedFeature)
    }, ScreenSpaceEventType.LEFT_CLICK)

    const czml = [
      {
        id: "document",
        name: "CZML Geometries: Polyline",
        version: "1.0",
      },
      {
        id: "redLine",
        name: "Red line clamped to terain",
        polyline: {
          positions: {
            cartographicDegrees: [-75, 35, 0, -125, 35, 0],
          },
          material: {
            solidColor: {
              color: {
                rgba: [255, 0, 0, 255],
              },
            },
          },
          width: 5,
          clampToGround: true,
        },
      }
    ]
    const dataSourcePromise = Cesium.CzmlDataSource.load(czml);
    viewer.dataSources.add(dataSourcePromise);


    const greenCylinder = viewer.entities.add({
      name: "Green cylinder with black outline",
      position: Cesium.Cartesian3.fromDegrees(-100.0, 40.0, 200000.0),
      cylinder: {
        length: 400000.0,
        topRadius: 200000.0,
        bottomRadius: 200000.0,
        material: Cesium.Color.GREEN.withAlpha(0.5),
        outline: true,
        outlineColor: Cesium.Color.GREEN,
      },
    });


    let billboards = viewer.scene.primitives.add(new BillboardCollection());

    billboards.add({
      position: Cesium.Cartesian3.fromDegrees(37.175657, 55.989027, 250.0),
      image: './assets/test.png',
      height: 30,
      width: 30,
    });
    billboards.add({
      position: Cesium.Cartesian3.fromDegrees(37.175657, 56.989027, 0.0),
      image: './assets/test.png',
      height: 30,
      width: 30,
    });


    // Материал с изображения
    viewer.entities.add({
      id: "Textured rectangle, zIndex 3",
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(-99.5, 20.0, -90.0, 30.0),
        material: new Cesium.ImageMaterialProperty({
          image: "./assets/cesium.jpg"
        }),
        zIndex: 3,
      },
    });
    const redCone = viewer.entities.add({
      name: "Red cone",
      position: Cesium.Cartesian3.fromDegrees(37.175657, 55.989027, 22222.0),
      cylinder: {
        length: 100.0,
        topRadius: 0.0,
        bottomRadius: 100.0,
        material: Cesium.Color.RED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      },
    });

    //SplitMonitor.mInit(viewer)
    //MPrimitives.mInit(viewer);
    PropertiesViewer.mInit(viewer)
    TestDevModule.mInit(viewer)
    CloudsModule.mInit(viewer)

    // var layers = viewer.scene.imageryLayers;
    // var blackMarble = layers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3812 }));
    // blackMarble.alpha = 0.9; // 0.0 is transparent.  1.0 is opaque.
    //
    // blackMarble.brightness = 5.0;
  }

}
