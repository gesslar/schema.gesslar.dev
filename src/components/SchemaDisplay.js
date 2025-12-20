import CodeBlock from '@theme/CodeBlock';

export default function SchemaDisplay({ schema, schemaUrl }) {
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <strong>Schema URL:</strong>{' '}
        <a href={schemaUrl} target="_blank" rel="noopener noreferrer">
          {schemaUrl}
        </a>
      </div>

      <h2>Schema Definition</h2>
      <CodeBlock language="json">
        {JSON.stringify(schema, null, 2)}
      </CodeBlock>

      {schema.properties && (
        <>
          <h2>Properties</h2>
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(schema.properties).map(([key, prop]) => (
                <tr key={key}>
                  <td><code>{key}</code></td>
                  <td><code>{prop.type || prop.const || 'object'}</code></td>
                  <td>{schema.required?.includes(key) ? '✓' : ''}</td>
                  <td>{prop.description || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
