import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
}))

// Mock Clerk authentication
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
  }),
  useAuth: () => ({
    isSignedIn: true,
    userId: 'test-user-id',
  }),
  ClerkProvider: ({ children }) => children,
  SignIn: () => <div data-testid="sign-in">Sign In</div>,
  SignUp: () => <div data-testid="sign-up">Sign Up</div>,
  UserButton: () => <div data-testid="user-button">User Button</div>,
}))

// Mock Stream Video SDK
jest.mock('@stream-io/video-react-sdk', () => ({
  useStreamVideoClient: () => ({
    call: jest.fn(() => ({
      id: 'test-call-id',
      getOrCreate: jest.fn().mockResolvedValue({}),
    })),
  }),
  useCall: () => ({
    id: 'test-call-id',
    leave: jest.fn().mockResolvedValue({}),
    getOrCreate: jest.fn().mockResolvedValue({}),
  }),
  CallControls: ({ children }) => <div data-testid="call-controls">{children}</div>,
  CallParticipantsList: ({ onClose }) => <div data-testid="participants-list" onClick={onClose}>Participants</div>,
  CallStatsButton: () => <div data-testid="call-stats">Stats</div>,
  CallingState: {
    JOINED: 'joined',
    CONNECTING: 'connecting',
    IDLE: 'idle',
    RECONNECTING: 'reconnecting',
  },
  PaginatedGridLayout: () => <div data-testid="grid-layout">Grid Layout</div>,
  SpeakerLayout: ({ participantsBarPosition }) => <div data-testid="speaker-layout" data-position={participantsBarPosition}>Speaker Layout</div>,
  useCallStateHooks: () => ({
    useCallCallingState: () => 'joined',
    useLocalParticipant: () => ({ isOwner: true }),
  }),
}))

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
  },
})

// Mock navigator clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock process.env variables for tests
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'