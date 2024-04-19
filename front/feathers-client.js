import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import auth from '@feathersjs/authentication-client';
import io from "socket.io-client";

window.PROTOCOL = window.location.protocol.replace(":", "");
window.HOSTNAME = window.location.host;

const socket = io(`${window.PROTOCOL}://${window.HOSTNAME}`, {transports: ['websocket']});

const feathersClient = feathers()
    .configure(socketio(socket, {
        timeout: 30000
    }))
    .configure(auth({ storage: window.localStorage }));

window.$feathers = feathersClient;

export default feathersClient
