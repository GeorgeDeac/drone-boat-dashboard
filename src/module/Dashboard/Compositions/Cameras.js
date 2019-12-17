import Module from "../../Module.js";
import Camera from "../Components/Camera.js";
//import "@tensorflow/tfjs";
//import "../../../../node_modules/@tensorflow/tfjs/dist/index.js";
//import * as cocoSsd from "@tensorflow-models/coco-ssd";

import CamerasTemplate from "./Templates/Cameras.html";

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'CAMERAS';
            console.log(this.label, 'INIT');

            this.model = false;
            /*cocoSsd
                .load()
                .then(model => {
                    this.model = model;
                    this.emit('model-loaded', this.model);
                });
*/
            this.on('ready', () => {
                resolve(this);
            });

            /**
             * in firefox go to about:config an set
             * dom.storage.enabled to false
             */
            this.on('model-loaded', model => {
                console.log('>>> MODEL LOADED', model);
                this.items.forEach(camera => {
                    camera.model = model;
                });
            });

            this.items = [];
            this.target = document.getElementById('cameras');
            this.draw();

            new Camera({
                id: 'camera-front',
                url: 'http://192.168.100.177:8100/one',
                device: '/dev/video1'
            }).then(frontCamera => {
                this.frontCamera = frontCamera;
                this.items.push(frontCamera);
                return new Camera({
                    id: 'camera-rear',
                    url: 'http://192.168.100.177:8100/two',
                    device: '/dev/video0'
                });
            }).then(rearCamera => {
                this.rearCamera = rearCamera;
                this.items.push(rearCamera);
                this.subscribe();
                this.emit('ready');
            });
        });
    }

    draw() {
        this.target.innerHTML = CamerasTemplate();
    }

    subscribe() {
        MQTT.subscribe('camera');
        MQTT.on('camera', data => {
            console.log('>>>>>>>>>>>>>>>>', data);

            const camera = this.getF('device', data.device);
            ['recording', 'snapshot', 'detection'].forEach(i => {
                if (data[i] !== undefined) {
                    camera[i] = data[i];
                    console.log('>>>>', i, camera[i]);
                }
            })
        });
    }
}