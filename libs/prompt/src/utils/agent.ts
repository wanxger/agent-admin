import { ChildProcess, spawn } from 'node:child_process';

let agentProcess: ChildProcess | null = null;

export const parseAgentCommand = (command: string): [string, string[]] => {
  const parts = command.trim().split(/\s+/);
  return [parts[0], parts.slice(1)];
};

export const getAgentProcess = (command?: string) => {
  if (!agentProcess) {
    const agentCommand = command || 'opencode acp';
    const [commandName, args] = parseAgentCommand(agentCommand);

    agentProcess = spawn(commandName, args, {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    agentProcess.on('exit', () => {
      agentProcess = null;
    });
  }

  return agentProcess;
};
