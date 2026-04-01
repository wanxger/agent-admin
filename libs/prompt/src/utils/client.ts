import readline from 'node:readline/promises';
import { EventEmitter } from 'node:events';
import * as acp from '@agentclientprotocol/sdk';

export class AcpClient implements acp.Client {
  private eventEmitter = new EventEmitter();
  async requestPermission(params: acp.RequestPermissionRequest): Promise<acp.RequestPermissionResponse> {
    console.log(`\n🔐 Permission requested: ${params.toolCall.title}`);

    let selectedOption = params.options.find((option) => option.kind === 'allow_always');
    if (!selectedOption) {
      selectedOption = params.options.find((option) => option.kind === 'allow_once');
    }
    if (!selectedOption) {
      selectedOption = params.options[0];
    }

    console.log(`Auto-approving: ${selectedOption.name} (${selectedOption.kind})`);

    return {
      outcome: {
        outcome: 'selected',
        optionId: selectedOption.optionId
      }
    };
  }

  async sessionUpdate(params: acp.SessionNotification): Promise<void> {
    const { sessionId, update } = params;

    this.eventEmitter.emit(`session:${sessionId}`, {
      type: update.sessionUpdate,
      data: update
    });

    const { sessionUpdate } = update;

    switch (sessionUpdate) {
      case 'available_commands_update': {
        console.debug('可用命令', update.availableCommands.map((command) => command.name).join(', '));
        break;
      }
      case 'agent_message_chunk':
      case 'agent_thought_chunk':
      case 'user_message_chunk': {
        const { content } = update;

        const { type } = content;

        switch (type) {
          case 'text': {
            process.stdout.write(content.text);

            break;
          }

          default: {
            console.debug('sessionUpdate agent_message_chunk type', type);

            break;
          }
        }

        break;
      }
      case 'tool_call':
      case 'tool_call_update': {
        console.debug(`工具调用 工具调用ID：${update.toolCallId} 状态：${update.status}`, update?.rawOutput);
        break;
      }
      default: {
        console.dir(update);

        break;
      }
    }
  }

  onSessionNotification(
    sessionId: string,
    callback: (event: { type: string; data: any }) => void
  ): () => void {
    this.eventEmitter.on(`session:${sessionId}`, callback);
    return () => this.eventEmitter.off(`session:${sessionId}`, callback);
  }
}
