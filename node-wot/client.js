// client.js
// Required steps to create a servient for a client
const { Servient } = require("@node-wot/core");
const { HttpClientFactory } = require("@node-wot/binding-http");

const servient = new Servient();
servient.addClientFactory(new HttpClientFactory(null));

servient.start().then(async (WoT) => {
    const td = await WoT.requestThingDescription("http://localhost:8890/counter");
    // Then from here on you can consume the thing
    let thing = await WoT.consume(td);
    thing.observeProperty("count", async (data) => { console.log("count:", await data.value()); });
    for (let i = 0; i < 5; i++) {
        await thing.invokeAction("increment");
    }
}).catch((err) => { console.error(err); });