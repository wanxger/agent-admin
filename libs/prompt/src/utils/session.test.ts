import { getSession } from './session.js';

const skipIntegration = !process.env.TEST_INTEGRATION;

describe('getSession', () => {
  describe('创建新会话', () => {
    test.skipIf(skipIntegration)('应该成功创建新会话并返回 sessionId', async () => {
      const params = {
        cwd: '/tmp/test-workdir',
        mcpServers: []
      };

      const result = await getSession(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
      expect(typeof result.sessionId).toBe('string');
      expect(result.sessionId.length).toBeGreaterThan(0);
    });

    test.skipIf(skipIntegration)('应该在指定 cwd 下创建新会话', async () => {
      const customCwd = '/tmp/custom-workdir';
      const params = {
        cwd: customCwd,
        mcpServers: []
      };

      const result = await getSession(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
    });

    test.skipIf(skipIntegration)('应该支持 mcpServers 参数', async () => {
      const params = {
        cwd: '/tmp/test-workdir',
        mcpServers: [
          {
            name: 'test-server',
            command: 'node',
            args: ['--version']
          }
        ]
      };

      const result = await getSession(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBeDefined();
    });
  });

  describe('加载现有会话', () => {
    test.skipIf(skipIntegration)('应该成功加载现有会话', async () => {
      const existingSessionId = 'test-session-id';
      const params = {
        cwd: '/tmp/test-workdir',
        sessionId: existingSessionId,
        mcpServers: []
      };

      const result = await getSession(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBe(existingSessionId);
    });

    test.skipIf(skipIntegration)('应该在指定 cwd 下加载现有会话', async () => {
      const existingSessionId = 'test-session-id-2';
      const customCwd = '/tmp/custom-workdir';
      const params = {
        cwd: customCwd,
        sessionId: existingSessionId,
        mcpServers: []
      };

      const result = await getSession(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBe(existingSessionId);
    });

    test.skipIf(skipIntegration)('应该支持 mcpServers 参数加载现有会话', async () => {
      const existingSessionId = 'test-session-id-3';
      const params = {
        cwd: '/tmp/test-workdir',
        sessionId: existingSessionId,
        mcpServers: [
          {
            name: 'test-server',
            command: 'node',
            args: ['--version']
          }
        ]
      };

      const result = await getSession(params);

      expect(result).toBeDefined();
      expect(result.sessionId).toBe(existingSessionId);
    });
  });
});
