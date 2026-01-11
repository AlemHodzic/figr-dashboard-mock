// Simulated API delay for demo purposes
// Set SIMULATE_DELAY=false in production
const SIMULATE_DELAY = process.env.SIMULATE_DELAY !== 'false';
const DELAY_MS = parseInt(process.env.DELAY_MS || '1500', 10);

export function delay(ms: number = DELAY_MS): Promise<void> {
  if (!SIMULATE_DELAY) return Promise.resolve();
  return new Promise(resolve => setTimeout(resolve, ms));
}
