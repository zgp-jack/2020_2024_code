<template>
    <div class="map-content" :style="mapBoxStyle">
        <div :id="domId" class="olMap" ref="olMap"></div>
        <div id="mouse-position" class="mouse-position-wrapper">
            <div class="custom-mouse-position"></div>
        </div>
    </div>
</template>
<script>
    const imgPrimary = require('@/assets/fault-primary.svg');
    import "ol/ol.css";
    import { Map, View, Feature } from "ol";
    import { defaults as defaultControls, FullScreen, ScaleLine, MousePosition } from "ol/control";
    import { createStringXY } from 'ol/coordinate';
    import GeomPoint from 'ol/geom/Point'
    import VectorSource from 'ol/source/Vector';
    import VectorLayer from 'ol/layer/Vector';
    import LabelStyle from 'ol/style/Style';
    import StyleFill from 'ol/style/Fill';
    import StyleStroke from 'ol/style/Stroke';
    import IconStyle from 'ol/style/Icon';
    import TextStyle from 'ol/style/Text';
 

    import olMapConfig from '@/js/olMapConfig';
    // 散点在地图上的坐标

    export default {
        name: 'openLayerMap',
        props: {
            domId: {
                type: String,
                default: 'olMap'
            },
            mapBoxStyle: {
                type: Object,
                default: () => {
                    return {paddingTop: '0px', height: '100%'}
                }
            }
        },
        data() {
            return {
                layerIndex: 3,
                stationList: [],
                svgPrimary: null
            }
        },
        mounted() {
            
            this.$nextTick(() => {
                this.svgPrimary = this.initSvgImage();
                this.initMap();
                setTimeout(() => {
                    this.getStationList();
                }, 200);
            })
        },
        methods: {
            initMap() {
                let olMap = this.$refs.olMap;

                // 向地图添加 MousePosition
                var mousePositionControl = new MousePosition({
                    coordinateFormat: createStringXY(4),
                    //地图投影坐标系（若未设置则输出为默认投影坐标系下的坐标）
                    projection: "EPSG:4326",
                    //坐标信息显示样式类名，默认是'ol-mouse-position'
                    className: "custom-mouse-position",
                    //显示鼠标位置信息的目标容器
                    target: document.getElementById("mouse-position"),
                    //未定义坐标的标记
                    undefinedHTML: "&nbsp;"
                });

                this.map = new Map({
                    target: olMap,
                    layers: [
                        olMapConfig.streetmap()
                    ],
                    view: new View({
                        projection: "EPSG:4326",    //使用这个坐标系
                        center: [olMapConfig.x, olMapConfig.y],  //成都
                        zoom: olMapConfig.zoom,
                        minZoom: 10,
                        maxZoom: 17,
                        constrainResolution: true,
                        //无级缩放地图
                        smoothResolutionConstraint: false,
                    }),
                    pixelRatio: window.devicePixelRatio,
                    controls: defaultControls({ zoom: false }).extend([
                        new FullScreen(),
                        mousePositionControl,
                        new ScaleLine()
                    ]),
                });

                //点击取点
                this.map.on('singleclick', evt => {
                    let feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
                        return feature;
                    });
                    if(feature) {
                        return false;
                    }
                    //点击地图 
                    console.log(evt.coordinate);
                })
                this.map.on('singleclick', evt => {
                    
                })
                //图层控制
                this.map.on("moveend", evt => {
                    var zoom = this.map.getView().getZoom();  //获取当前地图的缩放级别
                    if(zoom <= 10){
                        this.layerIndex = 1;
                    }else if(zoom > 10 && zoom < 13){
                        this.layerIndex = 2;
                    } else {
                        this.layerIndex = 3;
                    }
                });
            },
            setFeatureList() {
                let list = [];
                for (const item of this.stationList) {
                     // 用于充当标注的要素
                    let labelFeature = new Feature({
                        geometry: new GeomPoint([item.longitude, item.latitude]),
                        name: item.stationName,
                        data: item
                    });
                    // 设置标注样式
                    let labelStyle = null;
                    labelStyle = new LabelStyle({
                        text: new TextStyle({
                            offsetY: 22,
                            textAlign: 'center',            //位置
                            textBaseline: 'top',         //基准线
                            font: 'normal 12px 微软雅黑',    //文字样式
                            text: `${item.stationName}`,      //文本内容
                            fill: new StyleFill({       //文本填充样式（即文字颜色)
                                color: `rgba(255,255,255, 1)`,
                                width: 4,
                            }),
                            stroke: new StyleStroke({
                                color: '#333', 
                                width: 2
                            }),
                        }),
                        image: new IconStyle({
                            img: this.svgPrimary,
                            imgSize: [200, 200],
                            scale: 0.12,
                            opacity: 1,
                            anchor: [0.5, 100],              //锚点
                            anchorOrigin:'top-right',       //锚点源
                            anchorXUnits: 'fraction',       //锚点X值单位
                            anchorYUnits: 'pixels',         //锚点Y值单位
                            offsetOrigin: 'top-right'      //偏移原点
                        }),
                    });
                    // 添加标注的样式
                    labelFeature.setStyle(labelStyle);
                    list.push(labelFeature);
                }
                if(!this.vectorLayer) {
                    this.vectorLayer = new VectorLayer({
                        source: new VectorSource()
                    });
                    this.map.addLayer(this.vectorLayer);
                } else {
                    this.vectorLayer.getSource().clear();
                }
                this.vectorLayer.getSource().addFeatures(list);
            },
            initSvgImage() {
                const image = new Image(200, 200) // 这里设置的大小为原始大小
                image.src = imgPrimary // src 为svg地址
                return image
            },
            resize() {
                setTimeout(() => {
                    this.map.updateSize();
                }, 10);
            },
            getStationList() {
                this.$axios({
                    method: 'get',
                    url: '/api/station/list',
                    params: { stationName: '' },
                }).then((res) => {
                    const data = res.data.data;
                    if (data.status === 1) {
                        this.stationList = data.data;
                        this.setFeatureList();
                    }
                });
            },
        },
        watch: {
        }
    }
</script>
<style scoped>
.map-content{
    height: 100%;
}
.olMap{
    width: 100%;
    height: calc(100% + 30px);
    position: relative;
    z-index: 998;
    background-color: #f9f9f9;
}
.olMap ::v-deep .ol-full-screen{
    right: 3.5em;
    top: 3.5em;
}
.olMap ::v-deep .ol-scale-line{
    bottom: 3.5em;
    left: 3.5em;
}
.olMap::after{
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    pointer-events: none;
}
.mouse-position-wrapper{
    width: 120px; 
    height: 29px; 
    color:#333;
    text-shadow: 0 0 2px #000;
    position: absolute; 
    right: 20px; 
    bottom: 0px; 
    z-index: 999;
}

</style>
