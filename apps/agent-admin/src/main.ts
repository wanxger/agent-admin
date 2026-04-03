#!/usr/bin/env node
import { prompt } from '@agent-admin/prompt';
import { program } from 'commander';
import { load } from 'js-yaml';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

interface DebugOptions {
  cwd: string;
  task: string;
  maxIterations?: number;
  agentCommand?: string;
}

interface TaskConfig {
  task: string;
  cwd?: string;
}

export interface Config {
  cwd?: string;
  agent?: string;
  tasks: (string | TaskConfig)[];
}

const defaultMaxIterations = 5;
const defaultParallel = 1;

export const run = async (options: DebugOptions) => {
  const { cwd: workingDir, task, maxIterations: iterations = defaultMaxIterations, agentCommand } = options;

  await mkdir(workingDir, { recursive: true });

  await prompt({
    cwd: workingDir,
    prompt: [
      {
        type: 'text',
        text: `完成开发${task}`
      }
    ]
  });

  for (let i = 0; i < iterations; i++) {
    console.log(`\n\n========== 第 ${i + 1} 次判断 ==========`);

    const judgeRes = await prompt({
      cwd: workingDir,
      prompt: [
        {
          type: 'text',
          text: `请判断${task}是否已经完成开发。
要求：
1. 检查代码是否完整、可运行
2. 检查功能是否符合描述
3. 检查是否有明显的 bug

请按以下格式回复：
【结论】完成/未完成
【原因】具体说明原因
【建议】如果不完成，说明需要改进的地方`
        }
      ]
    });

    console.log('\n判断结果:', judgeRes.message);

    if (judgeRes.message.includes('【结论】完成')) {
      console.log('\n✅ 任务已完成！');
      break;
    }

    console.log('\n🔄 继续完善...');

    await prompt({
      cwd: workingDir,
      prompt: [
        {
          type: 'text',
          text: `根据以下反馈继续完善${task}：

${judgeRes.message}

请按照建议进行改进。`
        }
      ]
    });
  }
};

export const loadConfig = (configPath: string): Config | null => {
  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = readFileSync(configPath, 'utf8');
    const config = load(content) as Config;

    if (!config.tasks || !Array.isArray(config.tasks)) {
      return null;
    }

    return config;
  } catch (err) {
    console.error(`Error loading config file ${configPath}:`, err);
    return null;
  }
};

interface ResolvedTask {
  task: string;
  cwd: string;
}

const resolveTaskCwd = (task: string | TaskConfig, projectCwd?: string, defaultCwd = cwd()): ResolvedTask => {
  if (typeof task === 'string') {
    return {
      task,
      cwd: projectCwd ? resolve(projectCwd) : defaultCwd
    };
  }

  const taskCwd = task.cwd ? resolve(task.cwd) : projectCwd ? resolve(projectCwd) : defaultCwd;

  if (!task.task) {
    throw new Error('Task config missing task name');
  }

  return {
    task: task.task,
    cwd: taskCwd
  };
};

const runTaskWithRetry = async (
  task: ResolvedTask,
  maxIterations: number,
  maxRetries: number,
  taskIndex: number,
  agentCommand?: string
) => {
  for (let retry = 0; retry <= maxRetries; retry++) {
    try {
      console.log(
        `\n========== [任务 ${taskIndex + 1}] 执行任务 ${retry > 0 ? `(重试 ${retry}/${maxRetries})` : ''} ==========`
      );
      console.log(`任务: ${task.task}`);
      console.log(`工作目录: ${task.cwd}`);
      console.log(`================================\n`);

      await run({
        cwd: task.cwd,
        task: task.task,
        maxIterations,
        agentCommand
      });

      console.log(`\n✅ [任务 ${taskIndex + 1}] 执行成功`);
      return;
    } catch (err) {
      console.error(`\n❌ [任务 ${taskIndex + 1}] 执行失败:`, err);
      if (retry >= maxRetries) {
        console.error(`\n❌ [任务 ${taskIndex + 1}] 已达到最大重试次数 ${maxRetries}，放弃`);
        throw err;
      }
      console.log(`\n🔄 [任务 ${taskIndex + 1}] 准备重试...`);
    }
  }
};

const runParallelTasks = async (
  tasks: ResolvedTask[],
  maxIterations: number,
  maxRetries: number,
  parallelCount: number,
  agentCommand?: string
) => {
  const results: Promise<void>[] = [];
  const executing = new Set<Promise<void>>();

  for (let i = 0; i < tasks.length; i++) {
    const taskPromise = runTaskWithRetry(tasks[i], maxIterations, maxRetries, i, agentCommand);

    results.push(taskPromise);
    executing.add(taskPromise);

    taskPromise.finally(() => {
      executing.delete(taskPromise);
    });

    if (executing.size >= parallelCount) {
      await Promise.race(executing);
    }
  }

  await Promise.all(results);
};

const main = async () => {
  program
    .name('agent-admin')
    .alias('aa')
    .description('Agent Admin CLI')
    .option('-c, --cwd <path>', 'Working directory')
    .option('-t, --task <task>', 'Task description')
    .option('-f, --file <path>', 'YAML configuration file')
    .option('-p, --parallel <number>', 'Number of parallel tasks', '1')
    .option('-r, --retries <number>', 'Maximum number of retries per task', '0')
    .option('-i, --iterations <number>', 'Maximum number of iterations per task', '5')
    .option('-a, --agent <command>', 'ACP agent command (default: opencode acp)');

  program.parse();

  const options = program.opts();

  const workingDir = options.cwd ? resolve(options.cwd) : cwd();
  const configFile = options.file ? resolve(options.file) : resolve(workingDir, 'aa.yaml');
  const parallelCount = parseInt(options.parallel, 10) || defaultParallel;
  const maxRetries = parseInt(options.retries, 10) || 0;
  const maxIterations = parseInt(options.iterations, 10) || defaultMaxIterations;

  let resolvedTasks: ResolvedTask[] = [];
  let agentCommand: string | undefined = undefined;

  if (options.task) {
    resolvedTasks = [{ task: options.task, cwd: workingDir }];
  } else {
    const config = loadConfig(configFile);
    if (config && config.tasks && Array.isArray(config.tasks)) {
      resolvedTasks = config.tasks.map((task) => resolveTaskCwd(task, config.cwd, workingDir));
    }
    if (config && config.agent) {
      agentCommand = config.agent;
    }
  }

  if (options.agent) {
    agentCommand = options.agent;
  }

  if (resolvedTasks.length === 0) {
    console.log('No tasks specified. Exiting.');
    process.exit(0);
  }

  console.log(`\n========== 任务配置 ==========`);
  console.log(`任务总数: ${resolvedTasks.length}`);
  console.log(`并行任务数: ${parallelCount}`);
  console.log(`最大重试次数: ${maxRetries}`);
  console.log(`最大迭代次数: ${maxIterations}`);
  console.log(`工作目录: ${workingDir}`);
  console.log(`================================\n`);

  await runParallelTasks(resolvedTasks, maxIterations, maxRetries, parallelCount, agentCommand);

  console.log('\n✅ 所有任务执行完成！');
};

if (
  process.argv[1]?.endsWith('/aa') ||
  process.argv[1]?.endsWith('/agent-admin') ||
  import.meta.url === `file://${process.argv[1]}`
) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
