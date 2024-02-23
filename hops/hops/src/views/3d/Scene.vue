<template>
    <div :id="id" class="room-container"></div>
</template>
<script>
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { createMultiMaterialObject } from 'three/examples/jsm/utils/SceneUtils.js';

const tcImg = require('../../../static/images/tc.jpg');
const serverImg = require('../../../static/images/server.png');
const serverBackImg = require('../../../static/images/server-back.png');

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight - 10; // 
export default {
    props: {
        showServer: {
            type: Boolean
        },
        id: {
            type: String,
            default: 'container'
        },
        model: {
            type: [Array],
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            scene: null,  //场景对象
            camera: null,  //相机对象
            renderer: null,  //渲染器对象
            projector: null,
            mesh: null,  //网格模型对象
            controls:null ,//创建轨道控制器对象
            keyboard: null,
            clock: null,
            angle : 0,
            stats: null,
            openModel: null,
            serverList: [],
            targetList: [],
            clearList: [],
            curHoverUUID: null,
            mouse: { x: 0, y: 0 },
            myReq: null,
            ambientLight: null, //环境光
            directionalLight: null, //方向光
        }
    },
    mounted() {
        this.init();
        this.animate()
    },
    methods: {
        init() {
            // standard global variables
            var container = document.getElementById(this.id);

            this.keyboard = new KeyboardState();
            this.clock = new THREE.Clock();

            // SCENE
            this.scene = new THREE.Scene();
            // CAMERA
            var VIEW_ANGLE = 50, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 2000;
            
            this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
            this.scene.add(this.camera);
            
            if(this.showServer) {
                this.camera.position.set(0,300,550);
            } else {
                this.camera.position.set(0,80,200);
            }
            
            if(this.showServer) {
                let tween = new TWEEN.Tween(this.camera.position).to({x: 0, y: 80, z: 200}, 1500);
                tween.start();
            } else {
                let tween = new TWEEN.Tween(this.camera.position).to({x: 0, y: 300, z: 550}, 1500);
                tween.start();
            }
            
            // camera.position.z = 5;

            // RENDERER
            //renderer = new THREE.WebGLRenderer();
            this.renderer = new THREE.WebGLRenderer({
                alpha: true, // canvas是否包含alpha (透明度) 默认为 false
                antialias: true,
                precision: 'highp'
            });
            // this.renderer.setClearAlpha(0.0);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default
            this.renderer.physicallyCorrectLights = true;
            // this.renderer.gammaInput = true;
            // this.renderer.gammaOutput = true;
            // this.renderer.toneMapping = THREE.ReinhardToneMapping;

            // 能达到非常理想的场景效果.
            this.renderer.toneMappingExposure = Math.pow( 0.68, 5.0 );
            
            //创建一个光源
            this.createLight();

            // const sphereGeometry = new THREE.SphereGeometry( 5, 32, 50 );
            // const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
            // const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
            // sphere.castShadow = true; //default is false
            // sphere.receiveShadow = false; //default
            // sphere.position.set(0, 20, 20);
            // this.scene.add( sphere );

            // 加大环境光
            // mAmbientLight.intensity =10.8;

            this.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
            container.appendChild( this.renderer.domElement );
            
            // CONTROLS
            this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
            
            // STATS
            // this.stats = new Stats();
            // this.stats.domElement.style.position = 'absolute';
            // this.stats.domElement.style.top = '0px';
            // this.stats.domElement.style.zIndex = 100;
            // container.appendChild( this.stats.domElement );
            
            // initialize object to perform world/screen calculations
            this.projector = new THREE.Projector();

            this.initModel();

            // when the mouse moves, call the given function
            document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
            
            // when the mouse moves, call the given function
            document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );

        },
        initModel() {

            // FLOOR
            this.createFloor(620, 300);
            // this.createMirrors(600, 300);
            if(!this.showServer) {
                //后
                this.createGlassWall(610, 80, 10, 0, 41, -150, 0, 0, 0);
                //右
                this.createGlassWall(310, 80, 10, 310, 41, 0, 0, Math.PI / 2, 0);
                //左
                this.createGlassWall(310, 80, 10, -310, 41, 0, 0, -Math.PI / 2, 0);
                //前
                this.createGlassWall(610, 80, 10, 0, 41, 150, 0, 0, 0, true);

                this.createGlassWall(20, 80, 20, 0, 41, -140, 0, 0, 0, true);
                this.createGlassWall(20, 80, 20, 0, 41, 140, 0, 0, 0, true);

                // this.createGlassWall(720, 96, 0, 41, -200, 0, 0, 0);
                // this.createGlassWall(400, 96, 360, 41, 0, 0, Math.PI / 2, 0);
                // this.createGlassWall(400, 96, -360, 41, 0, 0, -Math.PI / 2, 0);
                // this.createGlassWall(720, 96, 0, 41, 200, 0, 0, 0, true);
            }

            // 创建机柜

            for (var i=0; i < this.model.length; i++) {
                var c = this.model[i].cabinet;
                this.createCabinet(c.size.w, c.size.h, c.size.d, c.position.x, c.position.y, c.position.z, c);
            }
        },
        createLight(){

            // 环境光
            this.ambientLight = new THREE.AmbientLight(0xffffff, 1) // 创建环境光
            this.scene.add(this.ambientLight) // 将环境光添加到场景

            this.directionalLight = new THREE.DirectionalLight(0xffffff) // 创建方向光
            this.directionalLight.position.set(20, 380, 60) // 设置方向光源位置

            this.directionalLight.castShadow = true
            this.directionalLight.shadow.radius = 100

            this.directionalLight.shadow.mapSize.width = 1024
            this.directionalLight.shadow.mapSize.height = 1024
            // 方向光投影近点、远点更新
            this.directionalLight.shadow.camera.near = 5
            this.directionalLight.shadow.camera.far = 500

            // 方向光投影边界更新
            this.directionalLight.shadow.camera.top = 320
            this.directionalLight.shadow.camera.bottom = -320
            this.directionalLight.shadow.camera.left = -400
            this.directionalLight.shadow.camera.right = 400
            this.directionalLight.shadow.camera.radius = 120

            this.scene.add(this.directionalLight)

            // 创建辅助工具
            this.lightHelper = new THREE.DirectionalLightHelper(this.directionalLight)
            this.scene.add(this.lightHelper)

            this.shadowCameraHelper = new THREE.CameraHelper(
                this.directionalLight.shadow.camera
            )
            this.scene.add(this.shadowCameraHelper)

            this.scene.add(new THREE.AxesHelper(20))
        },
        createCabinet(w, h, d, px, py, pz, c) {
            var cabinet = {};
            
            // 机柜的后
            var geometry = new THREE.BoxGeometry(w, h, 2);
            var meterial = new THREE.MeshLambertMaterial( { color: 0x5d5e5f } );
            
            var back = new THREE.Mesh( geometry, meterial );

            back.position.x = px;
            back.position.y = py + h / 2 + 1;
            back.position.z = pz - d / 2 + 2;
            back.castShadow = true;
            back.receiveShadow = false;
            
            back.hover = (o) => {
                this.hoverCabinet(o.container);
            }
            back.container = cabinet;

            this.targetList.push(back);
            this.scene.add(back);
            cabinet.back = back;
          
            // 机柜的左、右
            var geometry = new THREE.BoxGeometry(w, h, 2);
            var meterial = new THREE.MeshLambertMaterial( { color: 0x5d5e5f } );
            
            var left = new THREE.Mesh( geometry, meterial );
            var right = new THREE.Mesh( geometry, meterial );
            
            left.position.x = px + w / 2 -1;
            left.position.y = py + h / 2 + 1;
            left.position.z = pz;
            left.rotation.y = Math.PI / 2;
            left.castShadow = true;
            left.receiveShadow = false;

            right.position.x = px - w / 2 +1;
            right.position.y = py + h / 2 + 1;
            right.position.z = pz;
            right.rotation.y = -Math.PI / 2;
            right.castShadow = true;
            right.receiveShadow = false;
            
            left.hover = (o) => {
              this.hoverCabinet(o.container);
            }
            left.container = cabinet;
            right.hover = (o) => {
              this.hoverCabinet(o.container);
            }
            right.container = cabinet;

            this.targetList.push(left);
            this.targetList.push(right);
            this.scene.add(left);
            this.scene.add(right);
            
            cabinet.left = left;
            cabinet.right = right;
            
            // 机柜的底部、顶部
            var geometry = new THREE.BoxGeometry(w, 2, d);
            var meterial = new THREE.MeshBasicMaterial( { color: 0x5d5e5f} );
            
            var top = new THREE.Mesh( geometry, meterial );
            var bottom = new THREE.Mesh( geometry, meterial );
            
            top.position.x = px;
            top.position.y = py + h + 2;
            top.position.z = pz;
            top.castShadow = true;
            top.receiveShadow = false;
            
            bottom.position.x = px;
            bottom.position.y = py + 2;
            bottom.position.z = pz;
            
            top.hover = (o) => {
                this.hoverCabinet(o.container);
            }
            top.container = cabinet;
            bottom.hover = (o) => {
                this.hoverCabinet(o.container);
            }
            bottom.container = cabinet;
            
            this.targetList.push(top);
            this.targetList.push(bottom);
            this.scene.add(top);
            this.scene.add(bottom);
            
            cabinet.top = top;
            cabinet.bottom = bottom;
            
            // 机柜门
            var geometry = new THREE.BoxGeometry(w, h, 2);
            var meterial = new THREE.MeshLambertMaterial( { color: 0x000000, opacity: 0.7, transparent: true } );
            
            var front = new THREE.Mesh( geometry, meterial );
            
            front.position.x = px;
            front.position.y = py + h / 2 + 1;
            front.position.z = pz + d / 2;
            if(this.showServer) {
                front.rotation.y = Math.PI * 3 / 5;
                front.position.x += w / 2 + 3;
                front.position.z += d / 2;
            }
            front.toggle = (o) => {
              if ( o.rotation.y == 0 ) {
                o.rotation.y = o.rotation.y + Math.PI * 3 / 5;
                o.position.x = o.position.x + w / 2 + 3;
                o.position.z = o.position.z + d / 2;
                
                this.openCabinet(o.container);
                // this.camera.position.set(0, 200, 300)
                this.scene.remove(this.clearList[0])
                this.scene.remove(this.clearList[1])
              } else {
                o.rotation.y = o.rotation.y - Math.PI * 3 / 5;
                o.position.x = o.position.x - w / 2 - 3;
                o.position.z = o.position.z - d / 2;
                
                // 关闭机柜门时，将机柜中的服务器收起
                for (var i=0; i<o.container.servers.length; i++) {
                  o.container.servers[i].toggle(o.container.servers[i], false);
                }
                // this.camera.position.set(0, 200, 500)
                this.scene.add(this.clearList[0])
                this.scene.add(this.clearList[1])
                // this.camera.lookAt(this.scene.position);

                this.closeCabinet(o.container);
              }
            }
            front.hover = (o) => {
                this.hoverCabinet(o.container);
            }
            front.container = cabinet;
            
            this.scene.add(front);
            this.targetList.push(front);
            
            cabinet.front = front;
            
            // 
            cabinet.servers = [];
            // 服务器的厚度默认为 4， 服务器之间的间隔为 9
            const s_h = 5;
            const s_t = 7;
            if (c && c.servers) {
              cabinet.info = c;
              for (var i=0; i<c.servers.length; i++) {
                var server = this.createServer(w-s_h, s_h, d-s_h, px, py + (s_t*(i+1)), pz+2);
                server.container = cabinet;
                server.info = c.servers[i];
                cabinet.servers.push(server);
              }
            }
            
            return cabinet;
        },
        createServer(w, h, d, px, py, pz) {
            // 服务器
            var texture = new THREE.TextureLoader().load( serverImg );
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
            texture.repeat.set( 1, 1 );

            var texture_back = new THREE.TextureLoader().load( serverBackImg );
            texture_back.wrapS = texture_back.wrapT = THREE.RepeatWrapping; 
            texture_back.repeat.set( 1, 1 );

            var geometry = new THREE.BoxGeometry(w, h, d);
            //var material = new THREE.MeshBasicMaterial( { map: texture } );
            // Create an array of materials to be used in a cube, one for each side
            var materialArray = [];
            // order to add materials: x+,x-,y+,y-,z+,z-
            materialArray.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x999999, shininess: 10} ) );
            materialArray.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x999999, shininess: 10} ) );
            materialArray.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x999999, shininess: 10} ) );
            materialArray.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x999999, shininess: 10} ) );
            materialArray.push( new THREE.MeshBasicMaterial( { map: texture } ) );
            materialArray.push( new THREE.MeshBasicMaterial( { map: texture_back } ) );

            var server = new THREE.Mesh( geometry, materialArray );
            
            server.position.x = px;
            server.position.y = py;
            server.position.z = pz;
            
            server.toggle = (o, openOrClose) => {
              // 关闭同一机柜中的其他服务器
              for (var i=0; i<o.container.servers.length; i++) {
                if ( o === o.container.servers[i] ) continue;
                if ( o.container.servers[i].position.z == pz ) {
                } else {
                  o.container.servers[i].position.z = o.container.servers[i].position.z - d / 2;
                  // 
                  this.closeServer(o.container.servers[i]);
                }
              }
              
              if ( o.position.z == pz ) {
                if ( openOrClose == null || openOrClose ) {
                  o.position.z = o.position.z + d / 2;
                  // 打开服务器时，处理其他逻辑
                  this.openServer(o);
                }
              } else {
                if ( openOrClose == null || !openOrClose ) {
                  o.position.z = o.position.z - d / 2;
                  // 关上服务器时，处理其他逻辑
                  this.closeServer(o);
                }
              }
            }
            server.hover = (o) => {
              this.hoverServer(o);
            }
            
            this.scene.add(server);
            this.serverList.push(server);
            
            return server;
        },
        createFloor(width, height) {
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load( tcImg, map => {
                map.wrapS = THREE.RepeatWrapping;
                map.wrapT = THREE.RepeatWrapping;
                map.anisotropy = 4;
                map.repeat.set( 4, 4 );
                const floorMat = new THREE.MeshStandardMaterial( {
                    roughness: 0.4,
                    color: 0xffffff,
                    transparent: true,
                    metalness: 0.2,
                    bumpScale: 0.0005,
                    map: map
                } );
                // const floorMat = new THREE.MeshStandardMaterial( { color: 0xffffff} )

                const floorGeometry = new THREE.BoxGeometry(width, height, 1, 1, 1, 1);
                const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
                floorMesh.receiveShadow = true;
                floorMesh.rotation.x = -Math.PI / 2.0;
                this.scene.add(floorMesh);
            } );
            
        },
        createGlassWall(w, h, t, px, py, pz, rx, ry, rz, clear) {
            var geometry = new THREE.BoxGeometry(w, h, t);
            var materialArray = [];
            // order to add materials: x+,x-,y+,y-,z+,z-
            //左墙面,反转
            //mater正方体 右-左-上-下-前-后
            if(px === -310) {
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0xaeadad, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0xaeadad, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0xdedddd, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0xaeadad, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0x807f7f, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0xaeadad, side: THREE.DoubleSide } ) );
            } else {
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0xaeadad, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0x807f7f, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0xdedddd, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0x807f7f, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0xaeadad, side: THREE.DoubleSide } ) );
                materialArray.push( new THREE.MeshBasicMaterial( { color: 0x807f7f, side: THREE.DoubleSide } ) );
            }
            // var material = new THREE.MeshFaceMaterial( materialArray );
            geometry.computeVertexNormals();
            var glassW = new THREE.Mesh( geometry, materialArray );
            glassW.castShadow = true;
            glassW.receiveShadow = true;
            glassW.position.x = px;
            glassW.position.y = py;
            glassW.position.z = pz;
            // glassW.receiveShadow = true;
            
            glassW.rotation.y = ry;
            
            this.scene.add(glassW);
            if(clear) {
                this.clearList.push(glassW);
            } else {
                this.targetList.push(glassW);
            }
            
            return glassW;
        },
        createMirrors(width, height) {
            //创建平镜面，映射到地面上
            let geometry = new THREE.PlaneGeometry(width, height);

            let groundMirror = new Reflector(geometry, {
                clipBias: 0.03,
                textureWidth: window.innerWidth * window.devicePixelRatio,
                textureHeight: window.innerHeight * window.devicePixelRatio,
                color: 0x777777,
                recursion: 1
            });
            groundMirror.position.y = 0;
            groundMirror.rotateX(-Math.PI / 2);
            this.scene.add(groundMirror);
        },
        // 处理服务器打开、关闭时，信息的展示和隐藏
        openServer(o) {
            console.log('open:'+o.container.info.id+','+o.container.info.name+'--'+o.info.id+','+o.info.name);
        },
        closeServer(o) {
            console.log('close:'+o.container.info.id+','+o.container.info.name+'--'+o.info.id+','+o.info.name);
        },
          // 处理机柜打开、关闭时，信息的展示和隐藏
        openCabinet(o) {
            console.log(o.info);
            this.openModel = o.info;
            if(!this.showServer) {
                setTimeout(() => {
                    this.$emit('handlerClick', [{cabinet: this.openModel}]);
                }, 200)
            }
        },
        closeCabinet(o) {
            console.log('close:'+o.info.id+','+o.info.name);
            if(this.showServer) {
                setTimeout(() => {
                    this.$emit('handlerClick', [{cabinet: this.openModel}]);
                }, 200)
            }
        },
          // 处理鼠标HHover服务器时，服务器信息的内容渲染
        hoverServer(o) {
            this.openHover(o.info.uuid, () => {
              // show info
              console.log('open:'+o.container.info.id+','+o.container.info.name+'--'+o.info.id+','+o.info.name);
            });
        },
          // 处理鼠标HHover机柜时，机柜信息的内容渲染
        hoverCabinet(o) {
            this.openHover(o.info.uuid, () => {
              // show info
              console.log('hover:'+o.info.id+','+o.info.name);
            });
        },
          // 鼠标Hover时的通用方法
        openHover(hoverUUID, callback) {
            if (this.curHoverUUID == hoverUUID) return;
            this.curHoverUUID = hoverUUID;
            
            // 显示Div等操作
            
            // 回调
            callback();
        },
        closeHover() {
            this.curHoverUUID = null;
            
            // 隐藏Div等操作
        },
        onDocumentMouseMove( event ) {
            // the following line would stop any other event handler from firing
            // (such as the mouse's TrackballControls)
            // event.preventDefault();

            // update the mouse variable
            this.mouse.x = ( event.clientX / SCREEN_WIDTH ) * 2 - 1;
            this.mouse.y = - ( event.clientY / SCREEN_HEIGHT ) * 2 + 1;
            
            // find intersections

            // create a Ray with origin at the mouse position
            //   and direction into the scene (camera direction)
            var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
            this.projector.unprojectVector( vector, this.camera );
            var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );

            // create an array containing all objects in the scene with which the ray intersects
            var intersects = ray.intersectObjects( this.targetList );

            // if there is one (or more) intersections
            if ( intersects.length > 0 )
            {
                //console.log("Hit @ " + toString( intersects[0].point ) );
                // change the color of the closest face.
                //intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
                //intersects[ 0 ].object.geometry.colorsNeedUpdate = true;

                var o = intersects[ 0 ].object;
                if (typeof o.hover == 'function') {
                    o.hover(o);
                } else {
                    this.closeHover();
                }
            }
        },
          
        onDocumentMouseDown( event ) {
            // the following line would stop any other event handler from firing
            // (such as the mouse's TrackballControls)
            // event.preventDefault();

            //console.log("Click.");

            // update the mouse variable
            this.mouse.x = ( event.clientX / SCREEN_WIDTH ) * 2 - 1;
            this.mouse.y = - ( event.clientY / SCREEN_HEIGHT ) * 2 + 1;

            // find intersections

            // create a Ray with origin at the mouse position
            //   and direction into the scene (camera direction)
            var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
            this.projector.unprojectVector( vector, this.camera );
            var ray = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
            
            // create an array containing all objects in the scene with which the ray intersects
            var intersects = ray.intersectObjects( this.targetList );
            var interServer = ray.intersectObjects( this.serverList );

            if( interServer.length > 0) {
                var o = interServer[ 0 ].object;
                if (typeof o.toggle == 'function') {
                  o.toggle(o);
                }
                // this.focusServer(interServer[0])
            }

            // if there is one (or more) intersections
            if ( intersects.length > 0 )
            {
                //console.log("Hit @ " + toString( intersects[0].point ) );
                // change the color of the closest face.
                // intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
                // intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
                
                var o = intersects[ 0 ].object;
                if (typeof o.toggle == 'function') {
                  o.toggle(o);
                }
            }
        },

        focusServer(intersects) {
                    let boxMaxY = new THREE.Box3().setFromObject(intersects.object).max.y

                    let distance = boxMaxY + 10
                    let angel = Math.PI / 5

                    let position = {
                        x: intersects.object.position.x + Math.cos(angel) * distance,
                        y: intersects.object.position.y,
                        z: intersects.object.position.z + Math.sin(angel) * distance
                    }
                    try {
                        // this.controls.pan( new THREE.Vector3( position.x, position.y, position.z ) );
                        let tween = new TWEEN.Tween(this.camera.position).to(position, 1500)
                        // let tween1 = new TWEEN.Tween(this.controls.target).to(intersects.object.position, 1500)

                        // this.controls.enabled = false;
                        // tween.onComplete(() => {
                        //     this.controls.enabled = true;
                        // })

                        tween.start()
                        // tween1.start()
                    }
                    catch(err) {
                        // this.controls.enabled = true;
                    }
        },
        animate() {
            this.myReq = requestAnimationFrame( this.animate );
            TWEEN.update();
            this.update();
            this.render();
        },
        update() {
            this.keyboard.update();

            var moveDistance = 50 * this.clock.getDelta(); 

            if ( this.keyboard.pressed("left") || this.keyboard.pressed("A") ) 
              this.camera.translateX( -5 );

            if ( this.keyboard.pressed("right") || this.keyboard.pressed("D") ) 
                this.camera.translateX(  5 );
            
            if ( this.keyboard.pressed("up") || this.keyboard.pressed("W") ) 
                this.camera.translateZ( -5 );

            if ( this.keyboard.pressed("down") || this.keyboard.pressed("S") ) 
                this.camera.translateZ(  5 );

            if ( this.keyboard.pressed("R") ) 
                this.camera.translateY( -5 );

            if ( this.keyboard.pressed("F") ) 
                this.camera.translateY(  5 );
            
            if ( this.keyboard.pressed("Q") )
                this.controls.pan( new THREE.Vector3( -10, 0, 0 ) );

            if ( this.keyboard.pressed("E") )
                this.controls.pan( new THREE.Vector3(  10, 0, 0 ) );

            /*
            if ( keyboard.down("R") )
              mesh.material.color = new THREE.Color(0xff0000);
            if ( keyboard.up("R") )
              mesh.material.color = new THREE.Color(0x0000ff);
            */
            
            this.controls.update();
            // this.stats.update();
        },
        render() {
            var vector = this.camera.position.clone();
            console.log(vector.x, vector.y, vector.z);
            // this.directionalLight.position.set(vector.x, vector.y, vector.z); //点光源位置
            this.renderer.render( this.scene, this.camera );
        },
        clearCache(arr){
            console.log(arr);
            for (const mesh of arr) {
                mesh.geometry.dispose()
                mesh.material.dispose();
                // mesh.material.forEach(m => {
                //     m.dispose();
                // })
            }
            
        },
    // 清空场景，包括 scene 场景下的动画，子物体，renderer,camera,control，以及自己使用过的变量置空处理 等
        clearScene() {

            cancelAnimationFrame(this.myReq);

            this.clearCache(this.targetList);

            // 场景中的参数释放清理或者置空等
            this.renderer.forceContextLoss();
            this.renderer.dispose();
            this.flows = [];
            this.scene = null;
            this.camera = null;
            this.controls = null;
            this.renderer.domElement = null;
            this.renderer = null;
            this.sceneDomElement = null;
            console.log('clearScene');
            document.removeEventListener( 'mousedown', this.onDocumentMouseDown, false );
            document.removeEventListener( 'mousemove', this.onDocumentMouseMove, false );
        }
    },
    beforeDestroy() {
        this.clearScene();
    },
    watch: {
        showServer: function(val) {
            if(!val) {
                this.clearScene();
            }
        }
    }
}
</script>
<style scoped>
    .room-container {
        width: 100%;
        height: 100%;
        outline: none;
        background-image: linear-gradient(#4884a6, #06325f);
    }
</style>