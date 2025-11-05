// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock MediaDevices API for camera tests
global.navigator.mediaDevices = {
  getUserMedia: jest.fn(),
  enumerateDevices: jest.fn(),
}

// Mock HTMLMediaElement methods
window.HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve())
window.HTMLMediaElement.prototype.pause = jest.fn()
window.HTMLMediaElement.prototype.load = jest.fn()

// Mock Fullscreen API
document.exitFullscreen = jest.fn(() => Promise.resolve())
document.documentElement.requestFullscreen = jest.fn(() => Promise.resolve())

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Suppress console errors in tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

