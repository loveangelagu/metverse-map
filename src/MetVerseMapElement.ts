import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MetVerseMap } from './MetVerseMap'
import type { MetVerseMapProps } from './types'

const OBSERVED_ATTRS = [
  'header', 'border-color', 'accent', 'secondary', 'primary',
  'text-color', 'text-muted', 'font-family',
  'width', 'height', 'min-height',
  'show-activity', 'show-stats',
] as const

class MetVerseMapElement extends HTMLElement {
  private root: Root | null = null
  private mountPoint: HTMLDivElement | null = null
  private _props: Partial<MetVerseMapProps> = {}

  static get observedAttributes() {
    return [...OBSERVED_ATTRS]
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' })

    // Reset styles inside shadow DOM
    const style = document.createElement('style')
    style.textContent = `
      :host { display: block; }
      * { box-sizing: border-box; }
    `
    shadow.appendChild(style)

    this.mountPoint = document.createElement('div')
    shadow.appendChild(this.mountPoint)
    this.root = createRoot(this.mountPoint)

    this.render()
  }

  disconnectedCallback() {
    this.root?.unmount()
    this.root = null
    this.mountPoint = null
  }

  attributeChangedCallback() {
    this.render()
  }

  /** Set props programmatically (for advanced JS usage) */
  setProps(props: Partial<MetVerseMapProps>) {
    this._props = { ...this._props, ...props }
    this.render()
  }

  private render() {
    if (!this.root) return

    const props: MetVerseMapProps = {
      ...this._props,
      headerText: this.getAttribute('header') ?? this._props.headerText,
      width: this.getAttribute('width') ?? this._props.width ?? '100%',
      height: this.getAttribute('height') ?? this._props.height ?? 'auto',
      minHeight: this.hasAttribute('min-height')
        ? parseInt(this.getAttribute('min-height')!, 10)
        : this._props.minHeight,
      showActivityPanel: this.hasAttribute('show-activity')
        ? this.getAttribute('show-activity') !== 'false'
        : this._props.showActivityPanel,
      showStats: this.hasAttribute('show-stats')
        ? this.getAttribute('show-stats') !== 'false'
        : this._props.showStats,
      theme: {
        ...this._props.theme,
        ...(this.getAttribute('border-color') && { border: this.getAttribute('border-color')! }),
        ...(this.getAttribute('accent') && { accent: this.getAttribute('accent')! }),
        ...(this.getAttribute('secondary') && { secondary: this.getAttribute('secondary')! }),
        ...(this.getAttribute('primary') && { primary: this.getAttribute('primary')! }),
        ...(this.getAttribute('text-color') && { text: this.getAttribute('text-color')! }),
        ...(this.getAttribute('text-muted') && { textMuted: this.getAttribute('text-muted')! }),
        ...(this.getAttribute('font-family') && { fontFamily: this.getAttribute('font-family')! }),
      },
    }

    this.root.render(createElement(MetVerseMap, props))
  }
}

// Register the custom element
if (typeof customElements !== 'undefined' && !customElements.get('metverse-map')) {
  customElements.define('metverse-map', MetVerseMapElement)
}

// Also export a mount function for imperative usage
export function mount(
  element: HTMLElement,
  options: Partial<MetVerseMapProps> = {},
): { update: (opts: Partial<MetVerseMapProps>) => void; destroy: () => void } {
  const root = createRoot(element)
  let currentProps = options

  function render() {
    root.render(createElement(MetVerseMap, currentProps as MetVerseMapProps))
  }

  render()

  return {
    update(opts: Partial<MetVerseMapProps>) {
      currentProps = { ...currentProps, ...opts }
      render()
    },
    destroy() {
      root.unmount()
    },
  }
}
