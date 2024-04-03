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

class SpeedChangedEvent extends Event {
    constructor(thing, data) {
        super(thing, 'speedChanged', data);
    }
}

class OverheatedEvent extends Event {
    constructor(thing, data) {
        super(thing, 'overheated', data);
    }
}

class FadeAction extends Action {
    constructor(thing, input) {
        super(uuidv4(), thing, 'fade', input);
    }

    performAction() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.thing.setProperty('brightness', this.input.brightness);
                this.thing.addEvent(new OverheatedEvent(this.thing, 102));
                resolve();
            }, this.input.duration);
        });
    }
}


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

function makeLampThing(name) {
    const thing = new Thing(`urn:dev:ops:my-lamp-${name}`,
    `My Lamp ${name}`,
    ['OnOffSwitch', 'Lamp'],
    `A web connected lamp ${name}`);

    thing.addProperty(
        new Property(thing,
            'on',
            new Value(true), {
                '@type': 'OnOffProperty',
                title: 'On/Off',
                type: 'boolean',
                description: `Whether the lamp ${name} is turned on`,
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

    thing.addAvailableAction(
        'fade', {
            title: 'Fade',
            description: `Fade the lamp ${name} to a given level`,
            input: {
                type: 'object',
                required: [
                    'brightness',
                    'duration',
                ],
                properties: {
                    brightness: {
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
        FadeAction);

    thing.addAvailableEvent(
        'overheated', {
            description: `The lamp ${name} has exceeded its safe operating temperature`,
            type: 'number',
            unit: 'degree celsius',
        });

    return thing;
}


function makeFanThing(name) {
    const thing = new Thing(`urn:dev:ops:my-fan-${name}`,
        `My Fan ${name}`,
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

    thing.addAvailableEvent(
        'speedChanged', {
            description: `The fan ${name} speed has changed`,
            type: 'integer',
            unit: 'percent',
        });

    return thing;
}

function runServer() {
    const thing0 = makeLampThing("0");
    const thing1 = makeFanThing("1");

    const things = new MultipleThings([thing0, thing1]);

    const server = new WebThingServer(things, 8889);
    process.on('SIGINT', () => {
        server.stop().then(() => process.exit()).catch(() => process.exit());
    });

    server.start().catch(console.error);
}

runServer();
