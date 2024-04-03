const { Servient } = require("@node-wot/core");
const { HttpServer } = require("@node-wot/binding-http");

const servient = new Servient();
servient.addServer(new HttpServer({ port: 8890 }));

servient.start().then(async (WoT) => {
    let count = 0;
    const exposingThing = await WoT.produce({
        title: "Counter",
        description: "A simple counter thing",
        properties: {
            count: {
                type: "integer",
                description: "current counter value",
                observable: true,
                readOnly: true
            }
        },
        actions: {
            increment: {
                description: "increment counter value",
            }
        },
        events: {
            countChanged: {
                description: "emitted when the count changes",
                data: {
                    type: "integer"
                }
            }
        }
    });

    exposingThing.setPropertyReadHandler("count", () => { return count; });
    exposingThing.setActionHandler("increment", () => {
        count++;
        exposingThing.emitPropertyChange("count");
        exposingThing.emitEvent("countChanged", count); // Emitting the event when count changes
    });

    await exposingThing.expose();
    // now you can interact with the thing via http://localhost:8890/counter

}).catch((error) => {
    console.error("Error starting servient:", error);
});
