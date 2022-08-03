Что интересного нашел

По документации 

про Entity
https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/

по OSM Buildings
https://cesium.com/platform/cesium-ion/content/cesium-osm-buildings/
https://cesium.com/ion/stories/viewer/?id=2f0131ab-3948-4467-947c-411d5705a116
https://taginfo.openstreetmap.org/keys
https://cesium.com/platform/cesium-ion/content/bing-maps-imagery/
https://github.com/CesiumGS/3d-tiles/tree/main/specification/Styling

По коду
1. Инструменты рисования
Создание линий и полигонов на 3д карте
https://sandcastle.cesium.com/?src=Drawing%20on%20Terrain.html&label=All

2. Промис, ожидающий загрузки изображения
   https://sandcastle.cesium.com/?src=Billboards.html&label=All
124 строка

3. У Entitities есть интересное свойство
heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,


возможные значения:
   /**
  * The position is absolute.
    */
    NONE = 0,
    /**
  * The position is clamped to the terrain.
    */
    CLAMP_TO_GROUND = 1,
    /**
  * The position height is the height above the terrain.
    */
    RELATIVE_TO_GROUND = 2

4. Слайдер, разделяющий слои на два экрана
   https://sandcastle.cesium.com/?src=Imagery%20Layers%20Split.html&label=Tutorials
