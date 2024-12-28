import dotenv from 'dotenv';
import { Server } from './server';

dotenv.config();

const port = parseInt(process.env.PORT || '3000', 10);
const server = new Server(port);
server.start();
