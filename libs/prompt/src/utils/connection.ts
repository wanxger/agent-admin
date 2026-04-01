import { Writable, Readable } from 'node:stream';
import * as acp from '@agentclientprotocol/sdk';
import { AcpClient } from './client.js';
import { getAgentProcess } from './agent.js';

let connection: acp.ClientSideConnection | null = null;
let client: AcpClient | null = null;

export const getAcpConnection = async () => {
  if (!connection) {
    const agentProcess = getAgentProcess();

    const input = Writable.toWeb(agentProcess.stdin!);
    const output = Readable.toWeb(agentProcess.stdout!) as ReadableStream<Uint8Array>;

    client = new AcpClient();
    const stream = acp.ndJsonStream(input, output);

    connection = new acp.ClientSideConnection((_agent) => client!, stream);

    await connection.initialize({
      protocolVersion: acp.PROTOCOL_VERSION,
      clientCapabilities: {
        fs: {
          readTextFile: false,
          writeTextFile: false
        },
        terminal: false
      },
      clientInfo: {
        name: 'am',
        title: 'Agent Manager',
        version: '0.0.1'
      }
    });
  }

  return connection;
};

export const getAcpClient = () => {
  if (!client) {
    throw new Error('AcpClient not initialized. Call getAcpConnection first.');
  }
  return client;
};
