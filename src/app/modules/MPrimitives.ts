import * as Cesium from 'cesium';

export class MPrimitives {

  static mInit(viewer: Cesium.Viewer){
    const redCone = viewer.entities.add({
      name: "Red cone",
      position: Cesium.Cartesian3.fromDegrees(37.175657,55.989027, 22222.0),
      cylinder: {
        length: 100.0,
        topRadius: 0.0,
        bottomRadius: 100.0,
        material: Cesium.Color.RED,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      },
    });
  }
}
