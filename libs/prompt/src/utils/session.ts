import { getAcpConnection } from './connection.js';
import * as acp from '@agentclientprotocol/sdk';

export interface GetSessionParams {
  cwd?: string;
  sessionId?: string;
  mcpServers?: acp.McpServer[];
}

interface GetSessionRes {
  sessionId: string;
}

type GetSession = (params: GetSessionParams) => Promise<GetSessionRes>;

export const getSession: GetSession = async (params) => {
  const { cwd = process.cwd(), mcpServers = [], sessionId: parmasSessionId } = params;

  let sessionId = parmasSessionId;

  const connection = await getAcpConnection();

  if (sessionId) {
    const loadSessionRes = await connection.loadSession({
      cwd,
      mcpServers,
      sessionId
    });
  } else {
    const newSessionRes = await connection.newSession({
      cwd,
      mcpServers
    });

    console.debug(`new session id: ${newSessionRes.sessionId}`);

    const { sessionId: newSessionResultSessionId } = newSessionRes;

    sessionId = newSessionResultSessionId;
  }

  if (!sessionId) {
    throw new Error('invalid session id');
  }

  const res: GetSessionRes = {
    sessionId
  };

  return res;
};
