import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'

const { version } = packageJson

export default defineManifest((env) => ({
  manifest_version: 3,
  name: env.mode === 'development' ? '[DEV] SubReminder' : 'SubReminder',
  description: 'Track and manage all your subscriptions in one place',
  version,
  action: {
    default_popup: 'src/popup/index.html',
    default_icon: {
      '16': 'public/icons/icon-16.png',
      '48': 'public/icons/icon-48.png',
      '128': 'public/icons/icon-128.png',
    },
  },
  icons: {
    '16': 'public/icons/icon-16.png',
    '48': 'public/icons/icon-48.png',
    '128': 'public/icons/icon-128.png',
  },
  permissions: ['storage', 'alarms', 'notifications', 'sidePanel'] as chrome.runtime.ManifestPermissions[],
  side_panel: {
    default_path: 'src/popup/index.html',
  },
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module' as const,
  },
}))
