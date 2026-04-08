import { AcpClient } from './client.js';
import { beforeEach, afterEach, vi } from 'vitest';

describe('AcpClient', () => {
  let client: AcpClient;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleDebugSpy: ReturnType<typeof vi.spyOn>;
  let processStdoutWriteSpy: ReturnType<typeof vi.spyOn>;
  let consoleDirSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    client = new AcpClient();
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    processStdoutWriteSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true as any);
    consoleDirSpy = vi.spyOn(console, 'dir').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleDebugSpy.mockRestore();
    processStdoutWriteSpy.mockRestore();
    consoleDirSpy.mockRestore();
  });

  describe('requestPermission', () => {
    describe('优先 allow_always', () => {
      it('应该优先选择 allow_always 选项', async () => {
        const params = {
          toolCall: {
            title: 'Test Tool'
          },
          options: [
            {
              kind: 'allow_once',
              name: 'Allow Once',
              optionId: '1'
            },
            {
              kind: 'allow_always',
              name: 'Allow Always',
              optionId: '2'
            },
            {
              kind: 'deny',
              name: 'Deny',
              optionId: '3'
            }
          ]
        };

        const result = await client.requestPermission(params);

        expect(result.outcome.outcome).toBe('selected');
        expect(result.outcome.optionId).toBe('2');
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Auto-approving: Allow Always (allow_always)')
        );
      });
    });

    describe('优先 allow_once', () => {
      it('应该在没有 allow_always 时选择 allow_once', async () => {
        const params = {
          toolCall: {
            title: 'Test Tool'
          },
          options: [
            {
              kind: 'allow_once',
              name: 'Allow Once',
              optionId: '1'
            },
            {
              kind: 'deny',
              name: 'Deny',
              optionId: '2'
            }
          ]
        };

        const result = await client.requestPermission(params);

        expect(result.outcome.outcome).toBe('selected');
        expect(result.outcome.optionId).toBe('1');
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Auto-approving: Allow Once (allow_once)')
        );
      });
    });

    describe('选择第一个选项', () => {
      it('应该在既没有 allow_always 也没有 allow_once 时选择第一个选项', async () => {
        const params = {
          toolCall: {
            title: 'Test Tool'
          },
          options: [
            {
              kind: 'deny',
              name: 'Deny',
              optionId: '1'
            },
            {
              kind: 'another',
              name: 'Another',
              optionId: '2'
            }
          ]
        };

        const result = await client.requestPermission(params);

        expect(result.outcome.outcome).toBe('selected');
        expect(result.outcome.optionId).toBe('1');
        expect(consoleLogSpy).toHaveBeenCalledWith(
          expect.stringContaining('Auto-approving: Deny (deny)')
        );
      });
    });
  });

  describe('sessionUpdate', () => {
    describe('处理各种事件类型', () => {
      it('应该处理 available_commands_update 事件', async () => {
        const params = {
          sessionId: 'test-session-1',
          update: {
            sessionUpdate: 'available_commands_update',
            availableCommands: [
              { name: 'command1' },
              { name: 'command2' }
            ]
          }
        };

        await client.sessionUpdate(params);

        expect(consoleDebugSpy).toHaveBeenCalledWith(
          '可用命令',
          'command1, command2'
        );
      });

      it('应该处理 agent_message_chunk 事件（text 类型）', async () => {
        const params = {
          sessionId: 'test-session-2',
          update: {
            sessionUpdate: 'agent_message_chunk',
            content: {
              type: 'text',
              text: 'Hello, world!'
            }
          }
        };

        await client.sessionUpdate(params);

        expect(processStdoutWriteSpy).toHaveBeenCalledWith('Hello, world!');
      });

      it('应该处理 agent_thought_chunk 事件', async () => {
        const params = {
          sessionId: 'test-session-3',
          update: {
            sessionUpdate: 'agent_thought_chunk',
            content: {
              type: 'text',
              text: 'Thinking...'
            }
          }
        };

        await client.sessionUpdate(params);

        expect(processStdoutWriteSpy).toHaveBeenCalledWith('Thinking...');
      });

      it('应该处理 user_message_chunk 事件', async () => {
        const params = {
          sessionId: 'test-session-4',
          update: {
            sessionUpdate: 'user_message_chunk',
            content: {
              type: 'text',
              text: 'User input'
            }
          }
        };

        await client.sessionUpdate(params);

        expect(processStdoutWriteSpy).toHaveBeenCalledWith('User input');
      });

      it('应该处理 tool_call 事件', async () => {
        const params = {
          sessionId: 'test-session-5',
          update: {
            sessionUpdate: 'tool_call',
            toolCallId: 'call-123',
            status: 'completed',
            rawOutput: { result: 'success' }
          }
        };

        await client.sessionUpdate(params);

        expect(consoleDebugSpy).toHaveBeenCalledWith(
          '工具调用 工具调用ID：call-123 状态：completed',
          { result: 'success' }
        );
      });

      it('应该处理 tool_call_update 事件', async () => {
        const params = {
          sessionId: 'test-session-6',
          update: {
            sessionUpdate: 'tool_call_update',
            toolCallId: 'call-456',
            status: 'in_progress',
            rawOutput: { progress: 50 }
          }
        };

        await client.sessionUpdate(params);

        expect(consoleDebugSpy).toHaveBeenCalledWith(
          '工具调用 工具调用ID：call-456 状态：in_progress',
          { progress: 50 }
        );
      });

      it('应该处理未知事件类型', async () => {
        const params = {
          sessionId: 'test-session-7',
          update: {
            sessionUpdate: 'unknown_event',
            data: 'some data'
          }
        };

        await client.sessionUpdate(params);

        expect(consoleDirSpy).toHaveBeenCalledWith(params.update);
      });
    });
  });

  describe('onSessionNotification', () => {
    describe('订阅和取消订阅', () => {
      it('应该成功订阅会话通知', () => {
        const sessionId = 'test-session-8';
        const callback = vi.fn();
        const unsubscribe = client.onSessionNotification(sessionId, callback);

        expect(typeof unsubscribe).toBe('function');
      });

      it('应该成功取消订阅会话通知', () => {
        const sessionId = 'test-session-9';
        const callback = vi.fn();
        const unsubscribe = client.onSessionNotification(sessionId, callback);

        unsubscribe();

        expect(typeof unsubscribe).toBe('function');
      });

      it('应该在调用时触发回调', async () => {
        const sessionId = 'test-session-10';
        const callback = vi.fn();
        const unsubscribe = client.onSessionNotification(sessionId, callback);

        await new Promise(resolve => setTimeout(resolve, 100));
        unsubscribe();
      });
    });
  });
});
