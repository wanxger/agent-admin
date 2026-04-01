import { spawn, ChildProcess } from 'node:child_process';

let agentProcess: ChildProcess | null = null;

export const getAgentProcess = () => {
  if (!agentProcess) {
    agentProcess = spawn('opencode', ['acp'], {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    agentProcess.on('exit', () => {
      agentProcess = null;
    });
  }

  return agentProcess;
};
