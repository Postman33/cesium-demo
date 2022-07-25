

import * as Cesium from 'cesium';

export class SplitMonitor {

  static mInit(viewer: Cesium.Viewer){

    const layers = viewer.imageryLayers;
    const earthAtNight = layers.addImageryProvider(
      new Cesium.IonImageryProvider({ assetId: 3812 }));


  }
}
