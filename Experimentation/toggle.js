const { WebThing, SingleThing } = require('webthing');

class MyThing extends WebThing {
    constructor() {
        super('MyThing', 'A simple example Web Thing', ['OnOffSwitch']);
        this.addProperty(
            'on',
            {
                '@type': 'OnOffProperty',
                title: 'On/Off',
                type: 'boolean',
                description: 'Whether the light is turned on',
            },
            true,  // initialValue
            'boolean',  // type
        );
    }
}


const myThing = new MyThing();
const server = new SingleThing(myThing, 8888); // Port number: 8888
server.start();