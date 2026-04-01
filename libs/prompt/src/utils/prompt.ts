import { PromptRequest, PromptResponse } from '@agentclientprotocol/sdk';
import { getAcpConnection } from './connection.js';
import { getSession, GetSessionParams } from './session.js';
import { getAcpClient } from './connection.js';

interface PromptParams extends Omit<PromptRequest, 'sessionId'>, GetSessionParams {}

interface PromptRes extends PromptResponse {
  sessionId: string;
  message: string;
}

type Prompt = (params: PromptParams) => Promise<PromptRes>;

export const prompt: Prompt = async (params) => {
  const { prompt, cwd, mcpServers, sessionId: paramsSessionId } = params;

  const getSessionRes = await getSession({
    cwd,
    mcpServers,
    sessionId: paramsSessionId
  });

  const { sessionId } = getSessionRes;

  const connection = await getAcpConnection();

  const client = getAcpClient();

  let message = '';

  const unsubscribe = client.onSessionNotification(sessionId, (event) => {
    if (event.type === 'agent_message_chunk' && event.data.content?.type === 'text') {
      message += event.data.content.text;
    }
  });

  const promptRes = await connection.prompt({
    sessionId,
    prompt
  });

  unsubscribe();

  const res = {
    ...promptRes,
    sessionId,
    message
  };

  return res;
};
