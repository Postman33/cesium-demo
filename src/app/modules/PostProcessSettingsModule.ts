import * as Cesium from 'cesium';
// FXAA (Fast approXimate Anti-Aliasing)
export class PostProcessSettingsModule {

  static mInit(viewer: Cesium.Viewer) {

    viewer.scene.postProcessStages.fxaa.enabled = true;

  }
}
