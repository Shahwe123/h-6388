
import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

// Extend Vitest's expect method with jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock the ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock storage
class LocalStorageMock {
  private store: Record<string, string> = {};
  
  clear() {
    this.store = {};
  }
  
  getItem(key: string) {
    return this.store[key] || null;
  }
  
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  
  removeItem(key: string) {
    delete this.store[key];
  }
}

global.ResizeObserver = ResizeObserverMock;
global.localStorage = new LocalStorageMock();

// Add missing global types for jest-dom matchers
declare global {
  namespace Vi {
    interface Assertion<T = any> {
      toBeInTheDocument(): T;
      toBeVisible(): T;
      toHaveTextContent(text: string): T;
      toHaveAttribute(attr: string, value?: string): T;
      toBeDisabled(): T;
      toBeEnabled(): T;
      toBeChecked(): T;
      toBeEmptyDOMElement(): T;
      toHaveClass(className: string): T;
      toHaveFocus(): T;
      toHaveValue(value: any): T;
    }
  }
}

// Mock the URL navigation
Object.defineProperty(window, 'location', {
  writable: true,
  value: { 
    href: 'http://localhost:3000',
    pathname: '/',
    assign: vi.fn(),
    replace: vi.fn()
  }
});

// Mock Supabase Storage URL
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'test-user-id' }
          }
        }
      }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn(),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://test-storage-url.com/test-image.jpg' }
        })
      })
    },
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    }),
    removeChannel: vi.fn(),
  },
}));
