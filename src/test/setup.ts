
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend vitest's expect method with jest-dom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
});

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
