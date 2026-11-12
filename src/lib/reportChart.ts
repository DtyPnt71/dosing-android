import { getChartScale, outsideSpecification, validChartValue } from './chartScale'
import { formatPercent } from './utils'
import type { Language, Material, Sample } from './types'

/**
 * Reproduces the on-screen sample chart as a high-resolution PNG.
 * html2pdf/html2canvas embeds PNG data reliably in Android WebView even
 * when the optional chart on the app home screen is collapsed.
 */
export function renderReportChartImage(
  samples: Sample[],
  material: Material | null,
  language: Language,
): string {
  const { low, high, target, band, bottom, top, ticks } = getChartScale(samples, material)
  const scale = 2
  const width = 600
  const height = 294
  const left = 57
  const right = width - 18
  const plotTop = 38
  const plotBottom = 247
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas rendering is unavailable for the report chart')
  const ctx = context
  ctx.scale(scale, scale)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)

  const locale = language === 'de' ? 'de-DE' : 'en-US'
  const percent = (v: number) => formatPercent(v, locale)
  const tickFormat = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
    notation: top >= 10000 ? 'compact' : 'standard',
  })
  const x = (i: number) => left + (right - left) * (i + .5) / 5
  const y = (v: number) => plotBottom - (v - bottom) / (top - bottom) * (plotBottom - plotTop)

  const line = (x1: number, y1: number, x2: number, y2: number, color: string, weight = 1, dash: number[] = []) => {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = weight
    ctx.setLineDash(dash)
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // Light tolerance band behind the grid, just like the interactive chart.
  if (band) {
    ctx.fillStyle = '#e7f5ef'
    ctx.fillRect(left, y(high!), right - left, y(low!) - y(high!))
  }

  ctx.font = '12px Arial, sans-serif'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (const tick of ticks) {
    line(left, y(tick), right, y(tick), '#e2e8f0')
    ctx.fillStyle = '#334155'
    ctx.fillText(tickFormat.format(tick), left - 9, y(tick))
  }
  if (band) {
    line(left, y(low!), right, y(low!), '#16805d', 1.4, [5, 5])
    line(left, y(high!), right, y(high!), '#16805d', 1.4, [5, 5])
  }
  if (target !== null) {
    line(left, y(target), right, y(target), '#315b96', 2, [7, 5])
  }

  if (samples.length > 1) {
    ctx.beginPath()
    ctx.strokeStyle = '#52778b'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    samples.forEach((sample, index) => {
      if (!validChartValue(sample.value)) return
      if (index === 0) ctx.moveTo(x(index), y(sample.value))
      else ctx.lineTo(x(index), y(sample.value))
    })
    ctx.stroke()
  }

  for (let i = 0; i < 5; i++) {
    const sample = samples[i]
    const px = x(i)
    if (sample && validChartValue(sample.value)) {
      const py = y(sample.value)
      ctx.lineWidth = 2
      ctx.strokeStyle = '#fff'
      if (outsideSpecification(sample.value, low, high)) {
        ctx.beginPath()
        ctx.moveTo(px, py - 7)
        ctx.lineTo(px + 7, py)
        ctx.lineTo(px, py + 7)
        ctx.lineTo(px - 7, py)
        ctx.closePath()
        ctx.fillStyle = '#b45309'
        ctx.fill()
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(px, py, 6, 0, 2 * Math.PI)
        ctx.fillStyle = '#087f96'
        ctx.fill()
        ctx.stroke()
      }
      // White text outline prevents a label from disappearing into the lines.
      ctx.font = 'bold 13px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.lineWidth = 4
      ctx.strokeStyle = '#fff'
      ctx.strokeText(percent(sample.value), px, py - 13)
      ctx.fillStyle = '#111827'
      ctx.fillText(percent(sample.value), px, py - 13)
    } else {
      ctx.font = '13px Arial, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('–', px, plotBottom - 12)
    }
    ctx.fillStyle = '#334155'
    ctx.font = '12px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${language === 'de' ? 'Probe' : 'Sample'} ${i + 1}`, px, 276)
  }

  return canvas.toDataURL('image/png')
}
