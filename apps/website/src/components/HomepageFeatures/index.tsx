import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '配置简单',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>使用 YAML 配置文件定义任务，支持批量执行和灵活的参数配置。 让 AI 代理任务管理变得简单高效。</>
    )
  },
  {
    title: '灵活的工作目录',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: <>支持项目级和任务级的工作目录设置，可以轻松管理多个项目的 AI 代理任务。</>
  },
  {
    title: '内置测试支持',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>提供内置的 Test Agent 用于开发和测试，无需实际 AI 服务即可 进行集成测试。</>
  }
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
