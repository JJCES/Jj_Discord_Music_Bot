import { Event } from '../interface/Types';
import Client from '../Class';

const event: Event = {
    once: false,
    execute: (client: Client, Message: string) => {
        console.warn(Message);
    }
};

export default event;