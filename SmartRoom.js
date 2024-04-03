// Import necessary modules
const {
    Action,
    Event,
    MultipleThings,
    Property,
    Thing,
    Value,
    WebThingServer,
} = require('webthing');
const { v4: uuidv4 } = require('uuid');

// Define custom event classes
class SpeedChangedEvent extends Event {
    constructor(thing, data) {
        super(thing, 'speedChanged', data);
    }
}

// Define custom actions
class RotateAction extends Action {
    constructor(thing, input) {
        super(uuidv4(), thing, 'rotate', input);
    }

    performAction() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.thing.setProperty('speed', this.input.speed);
                this.thing.addEvent(new SpeedChangedEvent(this.thing, this.input.speed));
                resolve();
            }, this.input.duration);
        });
    }
}

// Function to create a Fan Thing
function makeFanThing(name) {
    const thing = new Thing(`urn:dev:ops:fan-${name}`,
        `Fan ${name}`,
        ['OnOffSwitch', 'Fan'],
        `A web connected fan ${name}`);

    thing.addProperty(
        new Property(thing,
            'on',
            new Value(false), {
                '@type': 'OnOffProperty',
                title: 'On/Off',
                type: 'boolean',
                description: `Whether the fan ${name} is turned on`,
            }));
    thing.addProperty(
        new Property(thing,
            'speed',
            new Value(0), {
                '@type': 'SpeedProperty',
                title: 'Speed',
                type: 'integer',
                description: `The speed of the fan ${name} from 0-100`,
                minimum: 0,
                maximum: 100,
                unit: 'percent',
            }));

    // Add the Rotate action
    thing.addAvailableAction(
        'rotate', {
            title: 'Rotate',
            description: `Change the rotation speed of the fan ${name}`,
            input: {
                type: 'object',
                required: [
                    'speed',
                    'duration',
                ],
                properties: {
                    speed: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 100,
                        unit: 'percent',
                    },
                    duration: {
                        type: 'integer',
                        minimum: 1,
                        unit: 'milliseconds',
                    },
                },
            },
        },
        RotateAction);

    // Add the SpeedChanged event
    thing.addAvailableEvent(
        'speedChanged', {
            description: `The fan ${name} speed has changed`,
            type: 'integer',
            unit: 'percent',
        });

    return thing;
}

// Function to create a Temperature Sensor Thing
function makeTemperatureSensorThing(name) {
    const thing = new Thing(`urn:dev:ops:temperature-sensor-${name}`,
        `Temperature Sensor ${name}`,
        ['TemperatureSensor'],
        `A web connected temperature sensor ${name}`);

    thing.addProperty(
        new Property(thing,
            'temperature',
            new Value(25), {
                '@type': 'TemperatureProperty',
                title: 'Temperature',
                type: 'number',
                description: `The temperature measured by sensor ${name}`,
                unit: 'degree Celsius',
            }));

    return thing;
}

// Function to create a Light Thing
function makeLightThing(name) {
    const thing = new Thing(`urn:dev:ops:light-${name}`,
        `Light ${name}`,
        ['OnOffSwitch', 'Light'],
        `A web connected light ${name}`);

    thing.addProperty(
        new Property(thing,
            'on',
            new Value(false), {
                '@type': 'OnOffProperty',
                title: 'On/Off',
                type: 'boolean',
                description: `Whether the light ${name} is turned on`,
            }));
    thing.addProperty(
        new Property(thing,
            'brightness',
            new Value(50), {
                '@type': 'BrightnessProperty',
                title: 'Brightness',
                type: 'integer',
                description: 'The level of light from 0-100',
                minimum: 0,
                maximum: 100,
                unit: 'percent',
            }));

    return thing;
}

// Function to create a Humidity Sensor Thing
function makeHumiditySensorThing(name) {
    const thing = new Thing(`urn:dev:ops:humidity-sensor-${name}`,
        `Humidity Sensor ${name}`,
        ['HumiditySensor'],
        `A web connected humidity sensor ${name}`);

    thing.addProperty(
        new Property(thing,
            'humidity',
            new Value(50), {
                '@type': 'HumidityProperty',
                title: 'Humidity',
                type: 'number',
                description: `The humidity measured by sensor ${name}`,
                unit: 'percent',
            }));

    return thing;
}

// Function to run the server
function runServer() {
    const fan = makeFanThing("1");
    const temperatureSensor = makeTemperatureSensorThing("1");
    const light = makeLightThing("1");
    const humiditySensor = makeHumiditySensorThing("1");

    const things = new MultipleThings([fan, temperatureSensor, light, humiditySensor]);

    const server = new WebThingServer(things, 8891);
    process.on('SIGINT', () => {
        server.stop().then(() => process.exit()).catch(() => process.exit());
    });
    // setInterval(() => {
    //     // light.setProperty('brightness', Math.floor(Math.random() * 101));
    //     temperatureSensor.setProperty('temperature', Math.floor(Math.random() * 50));
    //     humiditySensor.setProperty('humidity', Math.floor(Math.random() * 101));
    // }, Math.floor(Math.random() * (10000 - 5000)) + 5000); // Random interval between 5 to 10 seconds

    let maxTemperature = 50; // Maximum temperature
    let maxHumidity = 100; // Maximum humidity
    let temperatureIncrement = maxTemperature / ((10 - 5) * 1000 / 1000); // Increment to reach max in 5 to 10 sec
    let humidityIncrement = maxHumidity / ((20 - 10) * 1000 / 1000); // Increment to reach max in 10 to 20 sec

    // Function to increase temperature uniformly
    function increaseTemperature() {
        let currentTemperature = 0;
        let temperatureInterval = setInterval(() => {
            if (currentTemperature < maxTemperature) {
                currentTemperature += temperatureIncrement;
                temperatureSensor.setProperty('temperature', Math.floor(currentTemperature));
            } else {
                clearInterval(temperatureInterval); // Stop increasing when reaching max temperature
                setTimeout(decreaseTemperature, Math.floor(Math.random() * (3000)) + 2000); // Start decreasing after a random interval
            }
        }, Math.floor(Math.random() * (3000)) + 2000);
    }

    // Function to decrease temperature uniformly
    function decreaseTemperature() {
        let currentTemperature = maxTemperature;
        let temperatureInterval = setInterval(() => {
            if (currentTemperature > 0) {
                currentTemperature -= temperatureIncrement;
                temperatureSensor.setProperty('temperature', Math.floor(currentTemperature));
            } else {
                clearInterval(temperatureInterval); // Stop decreasing when reaching min temperature
                setTimeout(increaseTemperature, Math.floor(Math.random() * (10000 - 5000)) + 5000); // Start increasing after a random interval
            }
        }, Math.floor(Math.random() * (10000 - 5000)) + 5000);
    }

    // Function to increase humidity uniformly
    function increaseHumidity() {
        let currentHumidity = 0;
        let humidityInterval = setInterval(() => {
            if (currentHumidity < maxHumidity) {
                currentHumidity += humidityIncrement;
                humiditySensor.setProperty('humidity', Math.floor(currentHumidity));
            } else {
                clearInterval(humidityInterval); // Stop increasing when reaching max humidity
                setTimeout(decreaseHumidity, Math.floor(Math.random() * (8000) + 1000)); // Start decreasing after a random interval
            }
        }, Math.floor(Math.random() * (5000)) + 1000);
    }

    // Function to decrease humidity uniformly
    function decreaseHumidity() {
        let currentHumidity = maxHumidity;
        let humidityInterval = setInterval(() => {
            if (currentHumidity > 0) {
                currentHumidity -= humidityIncrement;
                humiditySensor.setProperty('humidity', Math.floor(currentHumidity));
            } else {
                clearInterval(humidityInterval); // Stop decreasing when reaching min humidity
                setTimeout(increaseHumidity, Math.floor(Math.random() * (20000 - 10000)) + 10000); // Start increasing after a random interval
            }
        }, Math.floor(Math.random() * (20000 - 10000)) + 10000);
    }

    // Start increasing temperature and humidity
    increaseTemperature();
    increaseHumidity();

    server.start().catch(console.error);
}

// Run the server
runServer();
