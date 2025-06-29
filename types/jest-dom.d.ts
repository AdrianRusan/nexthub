import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveValue(value: string | number | string[]): R
      toBeVisible(): R
      toBeChecked(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveClass(className: string): R
      toHaveAttribute(attributeName: string, value?: string): R
      toHaveTextContent(text: string | RegExp): R
      toBeEmptyDOMElement(): R
      toHaveFocus(): R
    }
  }
}