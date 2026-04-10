import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const sidebars: SidebarsConfig = {
  mainSidebar: [
    'intro',
    'installation',
    'quick-start',
    {
      type: 'category',
      label: '配置',
      items: ['configuration', 'config-file']
    },
    {
      type: 'category',
      label: '使用指南',
      items: ['usage', 'test-agent']
    }
  ]
};

export default sidebars;
