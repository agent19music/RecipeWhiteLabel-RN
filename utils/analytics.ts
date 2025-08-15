export function track(name: string, props?: Record<string, any>) {
  // Deterministic, local analytics stub
  const payload = props ? JSON.stringify(props) : '';
  // eslint-disable-next-line no-console
  console.log(`[analytics] ${name}${payload ? ' ' + payload : ''}`);
}

