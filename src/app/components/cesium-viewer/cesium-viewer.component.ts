import {Component, OnInit} from '@angular/core';
import * as Cesium from 'cesium';
import {BillboardCollection, HeightReference, ScreenSpaceEventType, VerticalOrigin} from 'cesium';
import {TestDevModule} from "../../modules/TestDevModule";
import {PropertiesViewer} from "../../modules/PropertiesViewer";
import {CloudsModule} from "../../modules/CloudsModule";
import {PostProcessSettingsModule} from "../../modules/PostProcessSettingsModule";

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
      // requestRenderMode: true,
      // maximumRenderTimeChange: 6,
      terrainProvider: Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
      }),
      imageryProvider: Cesium.createWorldImagery(),
      animation: false,
      timeline: false
      // imageryProvider : Cesium.createWorldImagery({
      //   style : Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
      // }),
    });
    viewer.scene.globe.enableLighting = false; // Глобальное освещение
    //  viewer.extend(Cesium.viewerCesiumInspectorMixin);
    viewer.scene.moon = new Cesium.Moon({
      onlySunLighting: false
    }); // Работает, но найти Луну нелегко

    viewer.scene.sun = new Cesium.Sun() // И это тоже

    // иногда называют osmBuildings в документации, что-то типа 3д зданий
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());


    buildingTileset.style = new Cesium.Cesium3DTileStyle({
      defines: {
        mainMaterial: "${feature['part#building:material']}",
        roofMaterial: "${feature['part#roof:material']}",
        cesiumColor: "${feature['cesium#color']}",
        height: "${feature['cesium#estimatedHeight']}"
      },
      color: {
        conditions: [
          ["${mainMaterial} === 'glass'", "color('skyblue', 0.5)"],
          ["${mainMaterial} === 'concrete'", "color('grey')"],
          ["${mainMaterial} === 'brick'", "color('indianred')"],
          ["${mainMaterial} === 'stone'", "color('lightslategrey')"],
          ["${mainMaterial} === 'metal'", "color('lightgrey')"],
          ["${mainMaterial} === 'steel'", "color('lightsteelblue')"],
          ["${mainMaterial} === 'copper'", "color('peru', 0.7)"],
          ["${roofMaterial} === 'copper'", "color('peru', 0.7)"],
          ["${roofMaterial} === 'glass'", "color('skyblue', 0.5)"],
          ["${roofMaterial} === 'metal'", "color('lightgrey')"],
          ["${cesiumColor} !== undefined", "color(${cesiumColor},1) * vec4(1,1,1,1)"],
          ["${height} > 80", "color('royalblue')"],
          ["${height} > 40", "color('tomato')"],
          ["${height} > 5", "color('yellowgreen')"],
          ["true", "color('white')"],
        ]
      }
    })

    // buildingTileset.style = new Cesium.Cesium3DTileStyle({
    //   defines: {
    //     distanceFromComplex:
    //       "10000*distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(37.175657, 55.989027))",
    //     newHeight: "${feature['cesium#estimatedHeight']}"
    //   },
    //   color: "rgba(clamp(${newHeight},0,255),255-clamp(${newHeight},0,255),clamp(${newHeight},0,118),1)",
    // });

    // buildingTileset.style = new Cesium.Cesium3DTileStyle({
    //   defines: {
    //     distanceFromComplex:
    //       "10000*distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(37.175657, 55.989027))",
    //     newHeight: "${feature['cesium#estimatedHeight']}"
    //   },
    //   color: "rgba(clamp(${distanceFromComplex},0,255),255-clamp(${distanceFromComplex},0,255),clamp(${distanceFromComplex},0,118),1)",
    // });

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-73.98579710760927, 40.69162777593141, 800),
    });

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
          mainMaterial: {
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
    ];
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
        outlineColor: Cesium.Color.WHEAT,
        outlineWidth: 5
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
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        fill: false,
        outline: true,
        outlineColor: Cesium.Color.fromRgba(0xFF0000FF),
        outlineWidth: 5
      },
    });
    const pinBuilder = new Cesium.PinBuilder();

    const hospitalPin = Promise.resolve(
      pinBuilder.fromMakiIconId("hospital", Cesium.Color.RED, 48)
    ).then(function (canvas) {
      return viewer.entities.add({
        name: "Hospital",
        position: Cesium.Cartesian3.fromDegrees(38.125657, 55.889027),
        billboard: {
          image: canvas.toDataURL(),
          verticalOrigin: VerticalOrigin.CENTER,
        },
      });

    });
    const url = Cesium.buildModuleUrl("Assets/Textures/maki/grocery.png");
    const groceryPin = Promise.resolve(
      pinBuilder.fromUrl(url, Cesium.Color.GREEN, 48)
    ).then(function (canvas) {
      return viewer.entities.add({
        name: "Grocery store",
        position: Cesium.Cartesian3.fromDegrees(-75.1705217, 39.921786),
        billboard: {
          image: canvas.toDataURL(),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
      });
    });

    //SplitMonitor.mInit(viewer)
    //MPrimitives.mInit(viewer);
    PropertiesViewer.mInit(viewer);
    TestDevModule.mInit(viewer);
    CloudsModule.mInit(viewer);
    PostProcessSettingsModule.mInit(viewer);
    // var layers = viewer.scene.imageryLayers;
    // var blackMarble = layers.addImageryProvider(new Cesium.IonImageryProvider({ assetId: 3812 }));
    // blackMarble.alpha = 0.9; // 0.0 is transparent.  1.0 is opaque.
    //
    // blackMarble.brightness = 5.0;
  }

}
