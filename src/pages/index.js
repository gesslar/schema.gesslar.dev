import React, {useState, useCallback} from 'react';
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

const STREAM_COUNT = 12;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const pickSnippet = () => {
  const source = schemaStrings[Math.floor(Math.random() * schemaStrings.length)].text;
  const lines = source.split('\n');
  const length = Math.max(6, Math.floor(randomBetween(8, 14)));
  const start = Math.floor(randomBetween(0, Math.max(lines.length - length, 1)));

  return lines.slice(start, start + length).join('\n');
};

const buildStream = (index) => {
  const baseSpacing = 100 / STREAM_COUNT;
  const jitter = randomBetween(-4, 4);
  const left = Math.min(92, Math.max(2, index * baseSpacing + jitter));

  return {
    id: index,
    left,
    snippet: pickSnippet(),
    duration: randomBetween(16, 32),
    delay: randomBetween(-12, 6),
    blur: randomBetween(0, 2.2),
  };
};

export default function Home() {
  const [streams, setStreams] = useState(() =>
    Array.from({length: STREAM_COUNT}, (_unused, idx) => buildStream(idx)),
  );

  const refreshSnippet = useCallback((id) => {
    setStreams((prev) =>
      prev.map((stream) => (stream.id === id ? {...stream, snippet: pickSnippet()} : stream)),
    );
  }, []);

  return (
    <Layout
      title="Schema Stream"
      description="schema.gesslar.dev — submerged schema stream"
    >
      <main className={styles.page}>
        <div className={styles.matrixLayer} aria-hidden>
          <div className={styles.waterline} />
          <div className={styles.scanlines} />
          {streams.map((stream) => (
            <div
              key={stream.id}
              className={styles.stream}
              style={{
                left: `${stream.left}%`,
                animationDuration: `${stream.duration}s`,
                animationDelay: `${stream.delay}s`,
                filter: `blur(${stream.blur}px)`,
              }}
              onAnimationIteration={() => refreshSnippet(stream.id)}
            >
              <div className={styles.code}>{stream.snippet}</div>
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
      </main>
    </Layout>
  );
}
