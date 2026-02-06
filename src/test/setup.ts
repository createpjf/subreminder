import '@testing-library/jest-dom'

const storage: Record<string, string> = {}

const storageMock = {
  get: vi.fn((keys: string | string[]) => {
    const keyList = typeof keys === 'string' ? [keys] : keys
    const result: Record<string, string> = {}
    for (const key of keyList) {
      if (key in storage) result[key] = storage[key]
    }
    return Promise.resolve(result)
  }),
  set: vi.fn((items: Record<string, string>) => {
    Object.assign(storage, items)
    return Promise.resolve()
  }),
  remove: vi.fn((keys: string | string[]) => {
    const keyList = typeof keys === 'string' ? [keys] : keys
    for (const key of keyList) {
      delete storage[key]
    }
    return Promise.resolve()
  }),
}

Object.defineProperty(globalThis, 'chrome', {
  value: {
    storage: {
      local: storageMock,
    },
    runtime: {
      onInstalled: { addListener: vi.fn() },
    },
    alarms: {
      create: vi.fn(),
      onAlarm: { addListener: vi.fn() },
    },
  },
  writable: true,
})
