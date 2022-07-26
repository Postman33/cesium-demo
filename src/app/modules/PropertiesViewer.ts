import * as Cesium from 'cesium';

export class PropertiesViewer {


  static mInit(viewer: Cesium.Viewer) {

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (result: { position: any; }) {
      var feature = viewer.scene.pick(result.position);
      if (feature instanceof Cesium.Cesium3DTileFeature) {
        var propertyNames = feature.getPropertyNames();
        var length = propertyNames.length;
        for (var i = 0; i < length; ++i) {
          var propertyName = propertyNames[i];
          const property = feature.getProperty(propertyName);
          if (!property) { continue; }
          console.log(propertyName + ': ' + property);
        }
      }
      console.log('\n')
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}
