import * as acp from '@agentclientprotocol/sdk';
import { beforeEach, describe, expect, it } from 'vitest';
import { TestAgent } from './test-agent.js';

describe('TestAgent', () => {
  let testAgent: TestAgent;

  beforeEach(() => {
    testAgent = new TestAgent({ autoRespond: true });
  });

  describe('initialize', () => {
    it('should return initialize result with correct protocol version', async () => {
      const result = await testAgent.initialize({
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: false,
            writeTextFile: false
          },
          terminal: false
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      });

      expect(result.protocolVersion).toBe('1.0.0');
      expect(result.agentInfo?.name).toBe('test-agent');
      expect(result.agentInfo?.version).toBe('1.0.0');
    });

    it('should record initialize message', async () => {
      await testAgent.initialize({
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: false,
            writeTextFile: false
          },
          terminal: false
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      });

      const messages = testAgent.getMessages();
      expect(messages).toHaveLength(1);
      expect(messages[0].type).toBe('initialize');
      expect(messages[0].data.protocolVersion).toBe('1.0.0');
    });
  });

  describe('newSession', () => {
    it('should create a new session with unique ID', async () => {
      const result1 = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      const result2 = await testAgent.newSession({
        cwd: '/test/path2',
        mcpServers: []
      });

      expect(result1.sessionId).toBeTruthy();
      expect(result2.sessionId).toBeTruthy();
      expect(result1.sessionId).not.toBe(result2.sessionId);
    });

    it('should record session parameters', async () => {
      const mcpServers: acp.McpServer[] = [{ name: 'test-server', command: 'test-command', args: [] }];

      await testAgent.newSession({
        cwd: '/test/path',
        mcpServers
      });

      const messages = testAgent.getMessages();
      const lastMessage = messages[messages.length - 1];

      expect(lastMessage.type).toBe('newSession');
      expect(lastMessage.data.cwd).toBe('/test/path');
      expect(lastMessage.data.mcpServers).toEqual(mcpServers);
    });

    it('should store session in sessions map', async () => {
      const result = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      const session = testAgent.getSession(result.sessionId);
      expect(session).toBeDefined();
      expect(session?.sessionId).toBe(result.sessionId);
      expect(session?.cwd).toBe('/test/path');
    });
  });

  describe('loadSession', () => {
    it('should load existing session', async () => {
      const newSessionResult = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      const loadResult = await testAgent.loadSession({
        sessionId: newSessionResult.sessionId,
        cwd: '/test/path',
        mcpServers: []
      });

      expect(loadResult).toBeDefined();
    });

    it('should throw error for non-existent session', async () => {
      await expect(
        testAgent.loadSession({
          sessionId: 'non-existent-session',
          cwd: '/test/path',
          mcpServers: []
        })
      ).rejects.toThrow('Session not found: non-existent-session');
    });
  });

  describe('prompt', () => {
    it('should return response when autoRespond is enabled', async () => {
      const testAgentAuto = new TestAgent({
        autoRespond: true,
        defaultResponse: 'Custom response'
      });

      await testAgentAuto.initialize({
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: false,
            writeTextFile: false
          },
          terminal: false
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      });

      const session = await testAgentAuto.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      const result = await testAgentAuto.prompt({
        sessionId: session.sessionId,
        prompt: [
          {
            type: 'text',
            text: 'Test prompt'
          }
        ]
      });

      expect(result.stopReason).toBe('end_turn');
    });

    it('should use custom response when set', async () => {
      testAgent.setResponse('My custom response');

      await testAgent.initialize({
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: false,
            writeTextFile: false
          },
          terminal: false
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      });

      const session = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      const result = await testAgent.prompt({
        sessionId: session.sessionId,
        prompt: [
          {
            type: 'text',
            text: 'Test prompt'
          }
        ]
      });

      expect(result.stopReason).toBe('end_turn');
    });

    it('should throw error when autoRespond is disabled', async () => {
      const testAgentNoAuto = new TestAgent({ autoRespond: false });

      await testAgentNoAuto.initialize({
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: false,
            writeTextFile: false
          },
          terminal: false
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      });

      const session = await testAgentNoAuto.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      await expect(
        testAgentNoAuto.prompt({
          sessionId: session.sessionId,
          prompt: [
            {
              type: 'text',
              text: 'Test prompt'
            }
          ]
        })
      ).rejects.toThrow('autoRespond is disabled');
    });
  });

  describe('cancel', () => {
    it('should record cancel message', async () => {
      const session = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      await testAgent.cancel({ sessionId: session.sessionId });

      const messages = testAgent.getMessages();
      const lastMessage = messages[messages.length - 1];

      expect(lastMessage.type).toBe('cancel');
      expect(lastMessage.data.sessionId).toBe(session.sessionId);
    });
  });

  describe('getMessages', () => {
    it('should return all messages', async () => {
      await testAgent.initialize({
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: false,
            writeTextFile: false
          },
          terminal: false
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      });

      await testAgent.newSession({ cwd: '/test/path', mcpServers: [] });

      const messages = testAgent.getMessages();
      expect(messages).toHaveLength(2);
      expect(messages[0].type).toBe('initialize');
      expect(messages[1].type).toBe('newSession');
    });
  });

  describe('getLastMessage', () => {
    it('should return the last message', async () => {
      await testAgent.initialize({
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: false,
            writeTextFile: false
          },
          terminal: false
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      });

      await testAgent.newSession({ cwd: '/test/path', mcpServers: [] });

      const lastMessage = testAgent.getLastMessage();
      expect(lastMessage).toBeDefined();
      expect(lastMessage?.type).toBe('newSession');
    });

    it('should return undefined when no messages', () => {
      const newAgent = new TestAgent();
      expect(newAgent.getLastMessage()).toBeUndefined();
    });
  });

  describe('getSessionMessages', () => {
    it('should return messages for a specific session', async () => {
      const session = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      await testAgent.prompt({
        sessionId: session.sessionId,
        prompt: [
          {
            type: 'text',
            text: 'Test prompt'
          }
        ]
      });

      await testAgent.prompt({
        sessionId: session.sessionId,
        prompt: [
          {
            type: 'text',
            text: 'Another test prompt'
          }
        ]
      });

      const sessionMessages = testAgent.getSessionMessages(session.sessionId);
      expect(sessionMessages).toHaveLength(2);
      expect(sessionMessages[0].type).toBe('prompt');
      expect(sessionMessages[1].type).toBe('prompt');
    });

    it('should return empty array for non-existent session', () => {
      const messages = testAgent.getSessionMessages('non-existent');
      expect(messages).toHaveLength(0);
    });
  });

  describe('setResponse and clearResponse', () => {
    it('should set custom response', () => {
      testAgent.setResponse('New response');
      expect(testAgent.getMessages()).toHaveLength(0);
    });

    it('should clear custom response', () => {
      testAgent.setResponse('Custom response');
      testAgent.clearResponse();

      const defaultAgent = new TestAgent({
        autoRespond: true,
        defaultResponse: 'Default'
      });

      expect(defaultAgent.getMessages()).toHaveLength(0);
    });
  });

  describe('reset', () => {
    it('should clear all messages and sessions', async () => {
      await testAgent.initialize({
        protocolVersion: 1,
        clientCapabilities: {
          fs: {
            readTextFile: false,
            writeTextFile: false
          },
          terminal: false
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      });

      await testAgent.newSession({ cwd: '/test/path', mcpServers: [] });

      testAgent.reset();

      expect(testAgent.getMessages()).toHaveLength(0);
      expect(testAgent.getLastMessage()).toBeUndefined();
    });
  });
});
