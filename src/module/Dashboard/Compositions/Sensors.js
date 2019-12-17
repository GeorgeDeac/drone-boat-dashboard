import Module from "../../Module.js";
import SensorsTemplate from './Templates/Sensors.html';
import SensorItemTemplate from '../Components/Templates/SensorItem.html';

export default class extends Module {
    constructor(args) {
        super(args);
        return new Promise((resolve, reject) => {
            this.label = 'SENSORS';
            console.log(this.label, 'INIT');

            this.on('ready', () => {
                resolve(this);
            });

            this.fields = ['temperature','co2','nh3','o3','kPa','dust','dust2'];
            this.fields.forEach(i => {
               this[i] = 0;
            });

            this.target = document.getElementById('sensors');
            this.target.innerHTML = SensorsTemplate();

            this.targets = {};
            this.fields.forEach(i => {
                this.targets[i] = document.getElementById(`sensor-${i}`);
                const payload = {
                    scope: {
                        label: i,
                        value: ''
                    }
                };
                this.targets[i].innerHTML = SensorItemTemplate(payload);
            });

            this.subscribe();
            this.draw();

            this.emit('ready');
        });
    }

    draw() {}

    update(){
        this.fields.forEach(i => {
            const target = this.targets[i].getElementsByClassName(`value`)[0];
            target.innerHTML = this[i];
        });
    }

    subscribe() {
        MQTT.subscribe('sensors');
        MQTT.on('sensors', data => {
            console.log('>>> SENSOR DATA', data);
            this.fields.forEach(i => {
                this[i] = data[i];
            });
            this.update();
        });
    }

}