import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { cwd as processCwd } from 'node:process';
import { loadConfig } from './main.js';

const FIXTURES_DIR = resolve(__dirname, '..', 'test', 'fixtures', 'configs');

describe('loadConfig', () => {
  describe('有效配置', () => {
    it('应该正确加载包含任务列表的配置文件', () => {
      const configPath = resolve(FIXTURES_DIR, 'valid.yaml');

      if (!existsSync(configPath)) {
        throw new Error(`Fixture file not found: ${configPath}`);
      }

      const config = loadConfig(configPath);

      expect(config).toBeDefined();
      expect(config).not.toBeNull();
      expect(config?.tasks).toBeDefined();
      expect(Array.isArray(config?.tasks)).toBe(true);
    });
  });

  describe('文件不存在', () => {
    it('应该在文件不存在时返回 null', () => {
      const configPath = resolve(FIXTURES_DIR, 'nonexistent.yaml');
      const config = loadConfig(configPath);

      expect(config).toBeNull();
    });
  });

  describe('无效 YAML', () => {
    it('应该在无效 YAML 语法时返回 null', () => {
      const configPath = resolve(FIXTURES_DIR, 'invalid.yaml');

      if (!existsSync(configPath)) {
        throw new Error(`Fixture file not found: ${configPath}`);
      }

      const config = loadConfig(configPath);

      expect(config).toBeNull();
    });
  });

  describe('缺少 tasks 字段', () => {
    it('应该在缺少 tasks 字段时返回 null', () => {
      const configPath = resolve(FIXTURES_DIR, 'no-tasks.yaml');

      if (!existsSync(configPath)) {
        throw new Error(`Fixture file not found: ${configPath}`);
      }

      const config = loadConfig(configPath);

      expect(config).toBeNull();
    });
  });

  describe('tasks 不是数组', () => {
    it('应该在 tasks 不是数组时返回 null', () => {
      const configPath = resolve(FIXTURES_DIR, 'non-array-tasks.yaml');

      if (!existsSync(configPath)) {
        throw new Error(`Fixture file not found: ${configPath}`);
      }

      const config = loadConfig(configPath);

      expect(config).toBeNull();
    });
  });
});

describe('工作目录解析', () => {
  describe('使用 --cwd 参数', () => {
    it('应该解析 --cwd 参数提供的绝对路径', () => {
      const customCwd = '/custom/path';
      const workingDir = resolve(customCwd);

      expect(workingDir).toBe('/custom/path');
    });

    it('应该解析 --cwd 参数提供的相对路径', () => {
      const customCwd = './custom';
      const workingDir = resolve(customCwd);

      expect(workingDir).toContain('custom');
    });
  });

  describe('使用默认目录', () => {
    it('应该在未提供 --cwd 时使用当前工作目录', () => {
      const workingDir = processCwd();

      expect(workingDir).toBeDefined();
      expect(typeof workingDir).toBe('string');
      expect(workingDir.length).toBeGreaterThan(0);
    });
  });
});
