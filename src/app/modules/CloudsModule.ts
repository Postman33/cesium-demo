import * as Cesium from 'cesium';
function getColor(colorName: string) {
  // @ts-ignore
  return Cesium.Color[colorName.toUpperCase()];
}
export class CloudsModule {

  static mInit(viewer: Cesium.Viewer){
    const clouds = viewer.scene.primitives.add(
      new Cesium.CloudCollection({
        noiseDetail: 16.0,
        noiseOffset: 1,
      }));

  const position = Cesium.Cartesian3.fromDegrees(37.175657,55.989027, 650.0)
    const cloudParameters = {
      scaleWithMaximumSize: true,
      scaleX: 300,
      scaleY: 250,
      maximumSizeX: 25,
      maximumSizeY: 25,
      maximumSizeZ: 25,
      renderSlice: true, // if false, renders the entire surface of the ellipsoid
      slice: 0.36,
      brightness: 1.0,
      color: "White",
      colors: ["White", "Red", "Green", "Blue", "Yellow", "Gray"],
    };

    const cloud = clouds.add({
      position: position,
      scale: new Cesium.Cartesian2(
        cloudParameters.scaleX,
        cloudParameters.scaleY
      ),
      maximumSize: new Cesium.Cartesian3(
        cloudParameters.maximumSizeX,
        cloudParameters.maximumSizeY,
        cloudParameters.maximumSizeZ
      ),
      color: getColor(cloudParameters.color),
      slice: cloudParameters.renderSlice ? cloudParameters.slice : -1.0,
      brightness: cloudParameters.brightness,
    });

  }
}
