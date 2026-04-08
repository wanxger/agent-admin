import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export interface ConfigSources {
  configFilePath: string;
  configCwd?: string;
  configAgent?: string;
  cliCwd?: string;
  cliAgent?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationError {
  type: 'cwd_conflict' | 'agent_conflict' | 'missing_tasks' | 'invalid_yaml' | 'cwd_not_found';
  message: string;
  details?: Record<string, unknown>;
}

export class ConfigValidator {
  constructor() {}

  validate(sources: ConfigSources): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const resolvedConfigCwd = sources.configCwd ? resolve(sources.configCwd) : '';
    const resolvedCliCwd = sources.cliCwd ? resolve(sources.cliCwd) : '';
    if (sources.cliCwd && sources.configCwd && resolvedCliCwd !== resolvedConfigCwd) {
      warnings.push(
        `⚠️  配置冲突: 配置文件和命令行参数都指定了 cwd\n` +
          `   配置文件: ${sources.configCwd}\n` +
          `   命令行参数: ${sources.cliCwd}\n` +
          `   优先使用: 命令行参数 (${sources.cliCwd})`
      );
    }

    if (sources.cliAgent && sources.configAgent && sources.cliAgent !== sources.configAgent) {
      warnings.push(
        `⚠️  配置冲突: 配置文件和命令行参数都指定了 agent\n` +
          `   配置文件: ${sources.configAgent}\n` +
          `   命令行参数: ${sources.cliAgent}\n` +
          `   优先使用: 命令行参数 (${sources.cliAgent})`
      );
    }

    const effectiveCwd = sources.cliCwd || sources.configCwd;
    if (effectiveCwd && !existsSync(resolve(effectiveCwd))) {
      errors.push(`❌ 错误: 工作目录不存在\n` + `   路径: ${effectiveCwd}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateTaskCount(taskCount: number, hasConfigFile: boolean): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!hasConfigFile && taskCount === 0) {
      errors.push(`❌ 错误: 未指定任务\n` + `   请提供配置文件 (aa.yaml) 或使用 --task 参数`);
    } else if (taskCount === 0) {
      errors.push(`❌ 错误: 配置文件中缺少任务列表或任务列表为空\n` + `   请在配置文件中添加 tasks 字段`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateYamlError(error: unknown, filePath: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    errors.push(
      `❌ 错误: 配置文件格式无效\n` +
        `   文件: ${filePath}\n` +
        `   错误: ${error instanceof Error ? error.message : String(error)}`
    );

    return {
      isValid: false,
      errors,
      warnings
    };
  }
}
