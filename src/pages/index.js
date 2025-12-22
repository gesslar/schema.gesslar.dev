import React, {useState, useCallback, useMemo} from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';

import aliasesSchema from '@site/static/schemas/muddler/v1/aliases.json';
import keysSchema from '@site/static/schemas/muddler/v1/keys.json';
import scriptsSchema from '@site/static/schemas/muddler/v1/scripts.json';
import timersSchema from '@site/static/schemas/muddler/v1/timers.json';
import bedocActionSchema from '@site/static/schemas/bedoc/v1/bedoc-action.json';

const schemaStrings = [
  {id: 'aliases', text: JSON.stringify(aliasesSchema, null, 2)},
  {id: 'keys', text: JSON.stringify(keysSchema, null, 2)},
  {id: 'scripts', text: JSON.stringify(scriptsSchema, null, 2)},
  {id: 'timers', text: JSON.stringify(timersSchema, null, 2)},
  {id: 'bedoc-action', text: JSON.stringify(bedocActionSchema, null, 2)},
];

const BLOCK_COUNT = 3;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const pickSnippet = () => {
  const source = schemaStrings[Math.floor(Math.random() * schemaStrings.length)].text;
  const lines = source.split('\n');
  const length = Math.max(5, Math.floor(randomBetween(6, 10)));
  const start = Math.floor(randomBetween(0, Math.max(lines.length - length, 1)));

  return lines.slice(start, start + length).join('\n');
};

const ALL_POSITIONS = [
  {top: '8%', left: '5%'},
  {top: '15%', right: '8%'},
  {top: '35%', left: '3%'},
  {top: '42%', right: '12%'},
  {top: '58%', left: '10%'},
  {top: '65%', right: '6%'},
  {top: '78%', left: '7%'},
  {top: '85%', right: '10%'},
  {top: '25%', left: '50%'},
  {top: '72%', right: '45%'},
];

const getRandomPosition = () => {
  return ALL_POSITIONS[Math.floor(Math.random() * ALL_POSITIONS.length)];
};

const getUnusedPosition = (usedPositions) => {
  const available = ALL_POSITIONS.filter(pos => 
    !usedPositions.some(used => used.top === pos.top && used.left === pos.left && used.right === pos.right)
  );
  return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : getRandomPosition();
};

const buildBlock = (index, usedPositions = []) => {
  const position = getUnusedPosition(usedPositions);
  return {
    id: index,
    ...position,
    snippet: pickSnippet(),
  };
};

export default function Home() {
  // Generate initial blocks with unique positions
  const [blocks, setBlocks] = useState(() => {
    const initialBlocks = [];
    for (let i = 0; i < BLOCK_COUNT; i++) {
      initialBlocks.push(buildBlock(i, initialBlocks));
    }
    return initialBlocks;
  });

  // When a block finishes animating, reposition it with new content
  const handleAnimationIteration = useCallback((blockId) => {
    setBlocks(prev => {
      const otherBlocks = prev.filter(b => b.id !== blockId);
      const newPosition = getUnusedPosition(otherBlocks);
      return prev.map(block => 
        block.id === blockId 
          ? {...block, ...newPosition, snippet: pickSnippet()}
          : block
      );
    });
  }, []);

  return (
    <Layout
      title="schema.gesslar.dev"
      description="schema.gesslar.dev — schema hosting and reference"
    >
      <main className={styles.page}>
        <div className={styles.matrixLayer} aria-hidden="true">
          {/* <div className={styles.waterline} /> */}
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className={styles.block}
              onAnimationIteration={() => handleAnimationIteration(block.id)}
              style={{
                top: block.top,
                left: block.left,
                right: block.right,
                animationDelay: `${idx * 1.2}s`,
              }}
            >
              <div className={styles.code}>{block.snippet}</div>
            </div>
          ))}
        </div>

        <section className={styles.hero}>
          <div className={styles.titleStack}>
            <h1 className={styles.title} data-text="schema.gesslar.dev">
              schema.gesslar.dev
            </h1>
          </div>
        </section>

        <section className={styles.about}>
          <div className={styles.aboutContent}>
            <h2>What are schemas?</h2>
            <p>
              Schemas define the structure and rules for your data formats. They provide validation, 
              autocomplete, and inline documentation right in your editor — catching errors before 
              you run your code.
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✓</span>
                <div>
                  <strong>Validation</strong>
                  <p>Catch errors as you type with real-time structure checking</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✨</span>
                <div>
                  <strong>Autocomplete</strong>
                  <p>Smart suggestions for properties, values, and types</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📖</span>
                <div>
                  <strong>Documentation</strong>
                  <p>Inline help and examples without leaving your editor</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
