/**
 * Re-export the wagmi config for use with wagmi/actions.
 */
import { config } from '@/components/providers';

export function getConfig() {
  return config;
}
