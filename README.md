# IOT-Applications

This repository looks into the work that has been done in the IOT community, problems with the current solutions and also looks into the implementation aspect of the frameworks developed.

## Frameworks and Data Formats
The ppts in the repository gives a brief description and key attractors of the work done by different organizations. The primary focus the organisations is to provide methods that allows to connect the IOT devices to the internet. Some of the organisations focus on providing solutions that are interoperable, i.e support data of various devices that have different data formats.

### Frameworks 

- CoAP (Constrained Application Protocol) - https://datatracker.ietf.org/doc/html/rfc7252
- IPSO (Internet Protocol of Smart Objects) - https://omaspecworks.org/develop-with-oma-specworks/ipso-smart-objects/
  - LwM2M (LightWeight Machine-to-Machine) - https://www.openmobilealliance.org/release/LightweightM2M/Lightweight_Machine_to_Machine-v1_1-OMASpecworks.pdf
  - LwM2M Application Layer Security (OSCORE) - https://openmobilealliance.org/documents/whitepapers/OMA-WP-e2e_Sec_IoT-20191024-A.pdf
    
- WOT Abstract Architecture (Web of Things) - https://www.w3.org/TR/wot-architecture/
  - Web Thing Model - https://www.w3.org/submissions/wot-model/
  - WOT Binding Templates - https://www.w3.org/TR/wot-binding-templates/
    
- OneDM - https://onedm.org/
  - Interoperability between different Data Formats - https://onedm.org/conversion/
  - Code to convert from SDF to IPSO - https://github.com/EricssonResearch/ipso-odm/tree/master
    
- HATEOAS (Hypermedia as the Engine of Application State) -
  - Source 1 - https://en.wikipedia.org/wiki/HATEOAS
  - Source 2 - https://www.w3.org/WoT/IG/wiki/images/0/07/HATEOAS_20160126.pdf

- Semantic Sensor Network Ontology (SSN) - https://www.w3.org/TR/vocab-ssn/#ice-core

### Data Formats

- CBOR (Concise Binary Object Representation) - https://cbor.io/
  - Trying out CBOR - https://cbor.me/

- SenML (Sensor Measurement Lists) - https://datatracker.ietf.org/doc/html/rfc8428
- JSON - LD (Linked Data) - 
  - Source 1 - https://json-ld.org/
  - Source 2 - https://www.slideshare.net/gkellogg1/jsonld-and-mongodb
  - Source 3 - https://www.w3.org/TR/json-ld/#named-graphs

- SDF(Semantic Definition Format) - https://datatracker.ietf.org/doc/draft-ietf-asdf-sdf/
  - Examples of SDF - https://github.com/one-data-model/playground/tree/master

## Some Existing Implementations

Running a LwM2M server on a microcontroller - https://www.youtube.com/watch?v=-DlmF70aKLQ&t=965s
  - Official Website -  https://liveobjects.orange-business.com/#/liveobjects
  - Deployed LwM2M server simulation - https://leshan.eclipseprojects.io/#/clients
  - Code for the simulated LwM2M Server - https://github.com/eclipse-leshan/leshan/tree/f23254c85928bf0eba54c10b515b36ef050a6959
    
Projects that implemented the Web of Things (WOT) Architecture -  https://www.infoq.com/articles/web-of-things-iot-apps/ 
The above article describes 2 projects **Mozilla WebThings** and the **Eclipse project** which use the schema published by WOT to describe a Thing (device). This utilizes the JSON-LD data format and also allows to create a virtual thing ( basically a server that represents a device and streams the device information in JSON-LD format).

- Mozilla WebThing - https://webthings.io
  - Developer Documentation - https://webthings.io/docs/
  - Schema - https://webthings.io/schemas/
 
- Eclipse Project - https://projects.eclipse.org/projects/iot.thingweb
  - node-wot (for creating a simulated thing using node js) - https://github.com/eclipse-thingweb/node-wot
  - Online Things (for testing some sample virtual things) - https://www.thingweb.io/services
 
## Experimentation 

To test out WOT, we created several virtual things using the webThings library and connected the things to openHab (https://www.openhab.org/).

OpenHab is an automation tool that connects to things (devices) and runs custom automation code written by the user. To start out with openHab and setup the code, checkout the following tutorial - https://www.openhab.org/docs/tutorial/

### Steps to Integrate the Virtual Thing with OpenHab 

To be updated

## Problems with the Current Solutions

Most of the solutions focus on connecting devices that use different frameworks to a single unified framework and its majorly for the properties of the device. To perform automation, we need to write multiple if - else statements to cover all the scenarios that are possible. This is a cumbersome and inefficient process and it also doesn't take into account the environment in which the devices are setup. To tackle this problem, people have started to look into integrating AI with IOT to create an AI Planner.

The AI Planner takes the data from the device and the actions it can perform, and returns a sequence of actions that should be performed to reach a desirable state.

Some AI Planner papers - 

  - AI Planning-Based Service Modeling for the Internet of Things By Quentin Bahers -  https://uu.diva-portal.org/smash/get/diva2:792338/FULLTEXT01.pdf
  - Collaborative Decision Making in IoT Network forSustainable Smart Cities: An Artificial Intelligence Planning Method Based Solution - https://www.warse.org/IJATCSE/static/pdf/file/ijatcse041042021.pdf
