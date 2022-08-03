import * as Cesium from 'cesium';
import {Cesium3DTileFeature} from "cesium";

function templateRowHTML(th: any, td: any) {
  return `<tr><th>${th}</th><td>${td}</td></tr>`
}

export class PropertiesViewer {

  // Свойство HTML описание объекта
  static generateHTMLDescription(feature: Cesium3DTileFeature): Cesium.Property {
    let HTML = `<table class="cesium-infoBox-defaultTable"><tbody>`;
    const propertyNames = feature.getPropertyNames();
    const length = propertyNames.length;
    for (var i = 0; i < length; ++i) {
      var propertyName = propertyNames[i];
      const propertyValue = feature.getProperty(propertyName);
      if (!propertyValue) {
        continue;
      }
      HTML += templateRowHTML(propertyName, propertyValue)
    }
    HTML += `</tbody></table>`
    // selectedEntity принимает только на вход Property, нельзя тип string, поэтому приходится конвертировать HTML к ConstantProperty
    return new Cesium.ConstantProperty(HTML);
  }

  static mInit(viewer: Cesium.Viewer) {
    const selectedEntity = new Cesium.Entity();
    // ЧАСТЬ ПОСТПРОЦЕССИНГА НАЧАЛО
    if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)) {
      const silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
      silhouetteBlue.uniforms.length = 0.01;
      silhouetteBlue.selected = [];

      const silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      silhouetteGreen.uniforms.color = Cesium.Color.LIME;
      silhouetteGreen.uniforms.length = 0.01;
      silhouetteGreen.selected = [];

      viewer.scene.postProcessStages.add(
        Cesium.PostProcessStageLibrary.createSilhouetteStage([
          silhouetteBlue,
          silhouetteGreen,
        ])
      );

      // @ts-ignore
      viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        let feature = viewer.scene.pick(movement.endPosition);
        // console.log(feature)
        if (!Cesium.defined(feature)) {
          silhouetteGreen.selected = [];
          return;
        }
        // Выделяем объект силуэтом (зеленым)
        silhouetteGreen.selected = [feature];

      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }
    // ЧАСТЬ ПОСТПРОЦЕССИНГА КОНЕЦ


    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((result: { position: any; }) => {
      var feature = viewer.scene.pick(result.position);
      if (feature instanceof Cesium.Cesium3DTileFeature) {
        var propertyNames = feature.getPropertyNames();
        var length = propertyNames.length;
        for (var i = 0; i < length; ++i) {
          var propertyName = propertyNames[i];
          const property = feature.getProperty(propertyName);
          if (!property) {
            continue;
          }


          selectedEntity.name = feature.getProperty("addr:city");
          selectedEntity.description = this.generateHTMLDescription(feature);
          viewer.selectedEntity = selectedEntity;
          console.log(propertyName + ': ' + property);
        }
      }
      console.log('\n')
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}
