// const {
//     Action,
//     Event,
//     Property,
//     SingleThing,
//     Thing,
//     Value,
//     WebThingServer,
// } = require('webthing');
// const { v4: uuidv4 } = require('uuid');

// class OverheatedEvent extends Event {
//     constructor(thing, data) {
//         super(thing, 'overheated', data);
//     }
// }

// class FadeAction extends Action {
//     constructor(thing, input) {
//         super(uuidv4(), thing, 'fade', input);
//     }

//     performAction() {
//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 console.log("I'm Called")
//                 this.thing.setProperty('brightness', this.input.brightness);
//                 this.thing.addEvent(new OverheatedEvent(this.thing, 102));
//                 resolve();
//             }, this.input.duration);
//         });
//     }
// }

// function makeThing() {
//     const thing = new Thing('urn:dev:ops:my-lamp-1234',
//         'My Lamp',
//         ['OnOffSwitch', 'Light'],
//         'A web connected lamp');

//     thing.addProperty(
//         new Property(thing,
//             'on',
//             new Value(true), {
//                 '@type': 'OnOffProperty',
//                 title: 'On/Off',
//                 type: 'boolean',
//                 description: 'Whether the lamp is turned on',
//             }));
//     thing.addProperty(
//         new Property(thing,
//             'brightness',
//             new Value(50), {
//                 '@type': 'BrightnessProperty',
//                 title: 'Brightness',
//                 type: 'integer',
//                 description: 'The level of light from 0-100',
//                 minimum: 0,
//                 maximum: 100,
//                 unit: 'percent',
//             }));

//     thing.addAvailableAction(
//         'fade', {
//             title: 'Fade',
//             description: 'Fade the lamp to a given level',
//             input: {
//                 type: 'object',
//                 required: [
//                     'brightness',
//                     'duration',
//                 ],
//                 properties: {
//                     brightness: {
//                         type: 'integer',
//                         minimum: 0,
//                         maximum: 100,
//                         unit: 'percent',
//                     },
//                     duration: {
//                         type: 'integer',
//                         minimum: 1,
//                         unit: 'milliseconds',
//                     },
//                 },
//             },
//         },
//         FadeAction);

//     thing.addAvailableEvent(
//         'overheated', {
//             description: 'The lamp has exceeded its safe operating temperature',
//             type: 'number',
//             unit: 'degree celsius',
//         });

//     return thing;
// }

// function runServer() {
//     const thing = makeThing();

//     // If adding more than one thing, use MultipleThings() with a name.
//     // In the single thing case, the thing's name will be broadcast.
//     const server = new WebThingServer(new SingleThing(thing), 8888, );
//     process.on('SIGINT', () => {
//         server.stop().then(() => process.exit()).catch(() => process.exit());
//     });

//     server.start().catch(console.error);
// }

// runServer();

const {
    Action,
    Event,
    Property,
    SingleThing,
    Thing,
    Value,
    WebThingServer,
} = require('webthing');
const { v4: uuidv4 } = require('uuid');

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
                console.log("I'm Called")
                this.thing.setProperty('brightness', this.input.brightness);
                this.thing.addEvent(new OverheatedEvent(this.thing, 102));
                resolve();
            }, this.input.duration);
        });
    }
}

function makeThing() {
    const thing = new Thing('urn:dev:ops:my-lamp-1234',
        'My Lamp',
        ['OnOffSwitch', 'Light'],
        'A web connected lamp');

    thing.addProperty(
        new Property(thing,
            'on',
            new Value(true), {
                '@type': 'OnOffProperty',
                title: 'On/Off',
                type: 'boolean',
                description: 'Whether the lamp is turned on',
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
            description: 'Fade the lamp to a given level',
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
            description: 'The lamp has exceeded its safe operating temperature',
            type: 'number',
            unit: 'degree celsius',
        });

    // Periodically change brightness randomly every 5 seconds
    setInterval(() => {
        const randomBrightness = Math.floor(Math.random() * 101); // Generate a random number between 0 and 100
        thing.setProperty('brightness', randomBrightness);
    }, 5000);

    // Toggle lamp every minute
    setInterval(() => {
        const currentOnState = thing.getProperty('on').value;
        thing.setProperty('on', !currentOnState);
    }, 60000);

    return thing;
}

function runServer() {
    const thing = makeThing();

    // If adding more than one thing, use MultipleThings() with a name.
    // In the single thing case, the thing's name will be broadcast.
    const server = new WebThingServer(new SingleThing(thing), 8888, );
    process.on('SIGINT', () => {
        server.stop().then(() => process.exit()).catch(() => process.exit());
    });

    server.start().catch(console.error);
}

runServer();
