import { describe, it, expect, beforeEach } from 'vitest';
import { TestAgent } from '../../src/utils/test-agent.js';

describe('TestAgent Integration Tests', () => {
  let testAgent: TestAgent;

  beforeEach(() => {
    testAgent = new TestAgent({ autoRespond: true, defaultResponse: 'Integration test response' });
  });

  describe('Parameter Passing', () => {
    it('should pass cwd parameter correctly', async () => {
      const cwd = '/test/workspace/path';

      const result = await testAgent.newSession({
        cwd,
        mcpServers: []
      });

      const messages = testAgent.getMessages();
      const newSessionMessage = messages.find((m) => m.type === 'newSession');

      expect(newSessionMessage).toBeDefined();
      expect(newSessionMessage?.data.cwd).toBe(cwd);
      expect(result.sessionId).toBeTruthy();
    });

    it('should pass mcpServers parameter correctly', async () => {
      const mcpServers = [
        {
          name: 'filesystem',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem', '/allowed/path']
        },
        {
          name: 'git',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-git']
        }
      ];

      await testAgent.newSession({
        cwd: '/test/path',
        mcpServers
      });

      const messages = testAgent.getMessages();
      const newSessionMessage = messages.find((m) => m.type === 'newSession');

      expect(newSessionMessage).toBeDefined();
      expect(newSessionMessage?.data.mcpServers).toEqual(mcpServers);
    });

    it('should pass prompt content correctly', async () => {
      const newSessionResult = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      testAgent.setResponse('Test prompt response');

      const promptResult = await testAgent.prompt({
        sessionId: newSessionResult.sessionId,
        prompt: [
          {
            type: 'text',
            text: 'Build a REST API server'
          }
        ]
      });

      const messages = testAgent.getMessages();
      const promptMessage = messages.find((m) => m.type === 'prompt');

      expect(promptMessage).toBeDefined();
      expect(promptMessage?.data.prompt).toHaveLength(1);
      expect(promptMessage?.data.prompt[0].type).toBe('text');
      expect(promptMessage?.data.prompt[0].text).toBe('Build a REST API server');
      expect(promptResult.stopReason).toBe('end_turn');
    });

    it('should pass sessionId correctly', async () => {
      const newSessionResult = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      testAgent.setResponse('Response for load session');

      const loadSessionResult = await testAgent.loadSession({
        sessionId: newSessionResult.sessionId,
        cwd: '/test/path',
        mcpServers: []
      });

      const messages = testAgent.getMessages();
      const loadSessionMessage = messages.find((m) => m.type === 'loadSession');

      expect(loadSessionMessage).toBeDefined();
      expect(loadSessionMessage?.data.sessionId).toBe(newSessionResult.sessionId);
      expect(loadSessionResult).toBeDefined();
    });
  });

  describe('Session Management', () => {
    it('should create and load session', async () => {
      const newSessionResult = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      const loadSessionResult = await testAgent.loadSession({
        sessionId: newSessionResult.sessionId,
        cwd: '/test/path',
        mcpServers: []
      });

      expect(loadSessionResult).toBeDefined();

      const messages = testAgent.getMessages();
      const sessionCreation = messages.find((m) => m.type === 'newSession');
      const sessionLoad = messages.find((m) => m.type === 'loadSession');

      expect(sessionCreation).toBeDefined();
      expect(sessionLoad).toBeDefined();
    });

    it('should handle prompt in session', async () => {
      const newSessionResult = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      testAgent.setResponse('Session prompt response');

      const promptResult = await testAgent.prompt({
        sessionId: newSessionResult.sessionId,
        prompt: [
          {
            type: 'text',
            text: 'Session prompt text'
          }
        ]
      });

      const sessionMessages = testAgent.getSessionMessages(newSessionResult.sessionId);
      expect(sessionMessages).toHaveLength(1);
      expect(sessionMessages[0].type).toBe('prompt');
      expect(promptResult.stopReason).toBe('end_turn');
    });
  });

  describe('Message Sequencing', () => {
    it('should maintain message order', async () => {
      const newSessionResult = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      testAgent.setResponse('First response');
      await testAgent.prompt({
        sessionId: newSessionResult.sessionId,
        prompt: [{ type: 'text', text: 'First prompt' }]
      });

      testAgent.setResponse('Second response');
      await testAgent.prompt({
        sessionId: newSessionResult.sessionId,
        prompt: [{ type: 'text', text: 'Second prompt' }]
      });

      const sessionMessages = testAgent.getSessionMessages(newSessionResult.sessionId);

      expect(sessionMessages).toHaveLength(2);
      expect(sessionMessages[0].data.prompt[0].text).toBe('First prompt');
      expect(sessionMessages[1].data.prompt[0].text).toBe('Second prompt');
    });

    it('should maintain unique session IDs', async () => {
      const result1 = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      const result2 = await testAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      expect(result1.sessionId).not.toBe(result2.sessionId);

      const session1Messages = testAgent.getSessionMessages(result1.sessionId);
      const session2Messages = testAgent.getSessionMessages(result2.sessionId);

      expect(session1Messages).toHaveLength(0);
      expect(session2Messages).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid session ID on loadSession', async () => {
      await expect(
        testAgent.loadSession({
          sessionId: 'invalid-session-id',
          cwd: '/test/path',
          mcpServers: []
        })
      ).rejects.toThrow('Session not found: invalid-session-id');
    });

    it('should handle prompt with invalid session', async () => {
      await expect(
        testAgent.prompt({
          sessionId: 'non-existent-session',
          prompt: [{ type: 'text', text: 'Test' }]
        })
      ).rejects.toThrow('Session not found: non-existent-session');
    });

    it('should throw when autoRespond is disabled', async () => {
      const noAutoAgent = new TestAgent({ autoRespond: false });

      const session = await noAutoAgent.newSession({
        cwd: '/test/path',
        mcpServers: []
      });

      await expect(
        noAutoAgent.prompt({
          sessionId: session.sessionId,
          prompt: [{ type: 'text', text: 'Test' }]
        })
      ).rejects.toThrow('autoRespond is disabled');
    });
  });
});
