import { prompt } from './prompt.js';

const skipIntegration = !process.env.TEST_INTEGRATION;

describe('prompt', () => {
  describe('参数传递正确性', () => {
    test.skipIf(skipIntegration)('应该正确传递 cwd 参数参数', async () => {
      const params = {
        cwd: '/tmp/test-workdir',
        prompt: [
          {
            type: 'text',
            text: 'Test prompt'
          }
        ]
      };

      const result = await prompt(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(result.message).toBeDefined();
    });

    test.skipIf(skipIntegration)('应该正确传递 mcpServers 参数', async () => {
      const params = {
        cwd: '/tmp/test-workdir',
        mcpServers: [
          {
            name: 'test-server',
            command: 'node',
            args: ['--version']
          }
        ],
        prompt: [
          {
            type: 'text',
            text: 'Test prompt'
          }
        ]
      };

      const result = await prompt(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(result.message).toBeDefined();
    });

    test.skipIf(skipIntegration)('应该正确传递 prompt 内容', async () => {
      const params = {
        cwd: '/tmp/test-workdir',
        prompt: [
          {
            type: 'text',
            text: 'Hello, this is a test prompt'
          }
        ]
      };

      const result = await prompt(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe('string');
    });

    test.skipIf(skipIntegration)('应该正确传递 sessionId 参数（加载现有会话）', async () => {
      const existingSessionId = 'test-existing-session-id';
      const params = {
        cwd: '/tmp/test-workdir',
        sessionId: existingSessionId,
        prompt: [
          {
            type: 'text',
            text: 'Follow-up prompt'
          }
        ]
      };

      const result = await prompt(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBe(existingSessionId);
      expect(result.message).toBeDefined();
    });

    test.skipIf(skipIntegration)('应该组合传递所有参数', async () => {
      const existingSessionId = 'test-session-id-combined';
      const params = {
        cwd: '/tmp/test-workdir',
        sessionId: existingSessionId,
        mcpServers: [
          {
            name: 'test-server',
            command: 'node',
            args: ['--version']
          }
        ],
        prompt: [
          {
            type: 'text',
            text: 'Complete test prompt'
          }
        ]
      };

      const result = await prompt(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBe(existingSessionId);
      expect(result.message).toBeDefined();
      expect(typeof result.message).toBe('string');
    });
  });
});
