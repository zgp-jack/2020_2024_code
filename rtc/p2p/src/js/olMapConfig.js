import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';


let maptype = 1;        //0表示部署的离线瓦片地图，1表示OSM,2表示使用Arcgis在线午夜蓝地图服务

let streetmap = () => {
    let maplayer = null;
    switch(maptype) {
        case 1:
            //geoserver-OSM地图
            maplayer=new TileLayer({
                source: new TileWMS({
                    url: '/map/geoserver/map01/wms',
                    params: {
                        'FORMAT': 'image/png',
                        'VERSION': '1.1.1',  
                        "STYLES": '',
                        "LAYERS": sessionStorage.map_name || 'map01:color_city',
                        "exceptions": 'application/vnd.ogc.se_inimage',
                    }
                })
            })
        break;
    }
    return maplayer;
}
const center = (sessionStorage.map_center || '104.0658437756991, 30.540039207504112').split(',');
var mapconfig = {
    x: center[0],     //中心点经度和纬度
    y: center[1],
    zoom: 14,          //地图缩放级别
    streetmap: streetmap,
};

export default mapconfig
