import * as acp from '@agentclientprotocol/sdk';

export interface TestAgentOptions {
  autoRespond?: boolean;
  defaultResponse?: string;
}

export interface Session {
  sessionId: string;
  cwd?: string;
  mcpServers?: acp.McpServer[];
  messages: Array<{ type: string; data: any }>;
}

export class TestAgent implements acp.Agent {
  private server: acp.AgentSideConnection | null = null;
  private sessions: Map<string, Session> = new Map();
  private allMessages: Array<{ type: string; data: any }> = [];
  private options: TestAgentOptions;
  private customResponse: string | null = null;
  private initializeResolve: ((value: void) => void) | null = null;
  private sessionCounter = 0;
  private messageCounter = 0;

  constructor(options: TestAgentOptions = {}) {
    this.options = {
      autoRespond: false,
      defaultResponse: 'Test response',
      ...options
    };
  }

  async connect(stream: { input: ReadableStream; output: WritableStream }): Promise<void> {
    this.server = new acp.AgentSideConnection(
      (conn) => this,
      acp.ndJsonStream(stream.output as WritableStream<Uint8Array>, stream.input as ReadableStream<Uint8Array>)
    );
  }

  async initialize(params: acp.InitializeRequest): Promise<acp.InitializeResponse> {
    this.allMessages.push({ type: 'initialize', data: params });

    if (this.initializeResolve) {
      this.initializeResolve();
    }

    return {
      protocolVersion: params.protocolVersion,
      agentInfo: {
        name: 'test-agent',
        version: '1.0.0'
      }
    };
  }

  async newSession(params: acp.NewSessionRequest): Promise<acp.NewSessionResponse> {
    this.allMessages.push({ type: 'newSession', data: params });

    const sessionId = `test-session-${++this.sessionCounter}`;
    const session: Session = {
      sessionId,
      cwd: params.cwd,
      mcpServers: params.mcpServers,
      messages: []
    };

    this.sessions.set(sessionId, session);

    return { sessionId };
  }

  async loadSession(params: acp.LoadSessionRequest): Promise<acp.LoadSessionResponse> {
    this.allMessages.push({ type: 'loadSession', data: params });

    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }

    return {};
  }

  async prompt(params: acp.PromptRequest): Promise<acp.PromptResponse> {
    this.allMessages.push({ type: 'prompt', data: params });

    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }

    session.messages.push({ type: 'prompt', data: params });

    const responseText = this.customResponse || this.options.defaultResponse || 'Test response';

    if (this.options.autoRespond) {
      const sessionUpdate: acp.SessionNotification = {
        sessionId: params.sessionId,
        update: {
          sessionUpdate: 'agent_message_chunk',
          content: {
            type: 'text',
            text: responseText
          }
        }
      };

      this.server?.sessionUpdate(sessionUpdate);

      return {
        stopReason: 'end_turn'
      };
    }

    throw new Error('autoRespond is disabled, cannot respond to prompt');
  }

  async cancel(params: acp.CancelNotification): Promise<void> {
    this.allMessages.push({ type: 'cancel', data: params });
  }

  async authenticate(params: acp.AuthenticateRequest): Promise<acp.AuthenticateResponse | void> {
    this.allMessages.push({ type: 'authenticate', data: params });
  }

  getServerSideConnection(): acp.AgentSideConnection {
    if (!this.server) {
      throw new Error('Server not initialized. Call connect() first.');
    }
    return this.server;
  }

  getMessages(): Array<{ type: string; data: any }> {
    return this.allMessages;
  }

  getLastMessage(): { type: string; data: any } | undefined {
    return this.allMessages[this.allMessages.length - 1];
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  getSessionMessages(sessionId: string): Array<{ type: string; data: any }> {
    const session = this.sessions.get(sessionId);
    return session?.messages || [];
  }

  setResponse(text: string): void {
    this.customResponse = text;
  }

  clearResponse(): void {
    this.customResponse = null;
  }

  waitForInitialize(): Promise<void> {
    return new Promise((resolve) => {
      this.initializeResolve = resolve;
    });
  }

  reset(): void {
    this.sessions.clear();
    this.allMessages = [];
    this.customResponse = null;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const testAgent = new TestAgent({ autoRespond: true });

  testAgent.connect({
    input: process.stdin as unknown as ReadableStream,
    output: process.stdout as unknown as WritableStream
  }).catch((err) => {
    console.error('Test agent error:', err);
    process.exit(1);
  });
}
