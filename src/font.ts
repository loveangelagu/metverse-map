let fontLoaded = false
let fontPromise: Promise<void> | null = null

export async function loadVT323Font(url?: string): Promise<void> {
  if (fontLoaded) return
  if (fontPromise) return fontPromise

  fontPromise = (async () => {
    const fontUrl = url ?? 'https://fonts.googleapis.com/css2?family=VT323&display=swap'

    if (fontUrl.endsWith('.woff2') || fontUrl.endsWith('.woff') || fontUrl.endsWith('.ttf')) {
      const font = new FontFace('VT323', `url(${fontUrl})`)
      await font.load()
      document.fonts.add(font)
    } else {
      // Google Fonts style URL — inject a <link> tag
      const existing = document.querySelector(`link[href="${fontUrl}"]`)
      if (!existing) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = fontUrl
        document.head.appendChild(link)
      }
      await document.fonts.load('20px VT323')
    }

    fontLoaded = true
  })()

  return fontPromise
}
