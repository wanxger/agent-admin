import { describe, it, expect } from 'vitest';
import { ConfigValidator } from './config-validator.js';
import { cwd } from 'node:process';

describe('ConfigValidator', () => {
  const validator = new ConfigValidator();

  describe('validate - 配置冲突检测', () => {
    it('相同 cwd 值时不应生成警告', () => {
      const result = validator.validate({
        configFilePath: '/path/to/config.yaml',
        configCwd: cwd(),
        cliCwd: cwd(),
        cliAgent: undefined
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('应该检测到 agent 冲突并生成警告', () => {
      const result = validator.validate({
        configFilePath: '/path/to/config.yaml',
        configAgent: 'config-agent',
        cliAgent: 'cli-agent',
        cliCwd: undefined
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toContain('配置冲突');
      expect(result.warnings[0]).toContain('agent');
    });

    it('应该检测到 agent 冲突', () => {
      const result = validator.validate({
        configFilePath: '/path/to/config.yaml',
        configCwd: cwd(),
        cliCwd: cwd(),
        configAgent: 'config-agent',
        cliAgent: 'cli-agent'
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
    });

    it('无冲突时应返回验证通过', () => {
      const result = validator.validate({
        configFilePath: '/path/to/config.yaml',
        configCwd: cwd(),
        cliAgent: 'cli-agent'
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('validate - 配置优先级规则', () => {
    it('命令行参数应优先于配置文件', () => {
      const result = validator.validate({
        configFilePath: '/path/to/config.yaml',
        configCwd: cwd(),
        cliCwd: cwd(),
        configAgent: 'config-agent',
        cliAgent: 'cli-agent'
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(1);
    });

    it('仅配置文件时应正常工作', () => {
      const result = validator.validate({
        configFilePath: '/path/to/config.yaml',
        configCwd: cwd(),
        configAgent: 'config-agent'
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('仅命令行参数时应正常工作', () => {
      const result = validator.validate({
        configFilePath: '/path/to/config.yaml',
        cliCwd: cwd(),
        cliAgent: 'cli-agent'
      });

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('validateTaskCount - 配置完整性验证', () => {
    it('任务列表为空且无配置文件时应返回错误', () => {
      const result = validator.validateTaskCount(0, false);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('未指定任务');
    });

    it('任务列表为空但有配置文件时应返回错误', () => {
      const result = validator.validateTaskCount(0, true);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('缺少任务列表');
    });

    it('任务列表不为空时应返回验证通过', () => {
      const result = validator.validateTaskCount(3, true);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('命令行任务应正常工作', () => {
      const result = validator.validateTaskCount(1, false);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateYamlError - YAML 错误处理', () => {
    it('应该返回包含错误信息的验证结果', () => {
      const error = new Error('Invalid YAML syntax');
      const result = validator.validateYamlError(error, '/path/to/config.yaml');

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('配置文件格式无效');
      expect(result.errors[0]).toContain('Invalid YAML syntax');
    });
  });
});
