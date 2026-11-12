import type { Material, Sample } from './types'

/** Shared autoscale calculations for the live chart and exported report. */
export function validChartValue(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

export function outsideSpecification(value: number, low: number | null, high: number | null) {
  return (low !== null && value < low) || (high !== null && value > high)
}

export function getChartScale(samples: Sample[], material: Material | null) {
  const low = validChartValue(material?.minPercentB) ? material.minPercentB : null
  const high = validChartValue(material?.maxPercentB) ? material.maxPercentB : null
  const target = validChartValue(material?.targetPercentB)
    ? material.targetPercentB
    : low !== null && low === high ? low : null
  const band = low !== null && high !== null && high > low
  const values = samples.map((sample) => sample.value).filter(validChartValue)
  const refs = [low, high, target].filter(validChartValue)
  const extent = [...values, ...refs]
  const minimum = extent.length ? Math.min(...extent) : 0
  const maximum = extent.length ? Math.max(...extent) : 1
  const padding = Math.max((maximum - minimum) * .3, maximum * .015, .1)
  const rawStep = Math.max(maximum - minimum + padding * 2, .5) / 4
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const step = ([1, 2, 2.5, 5, 10].find((n) => n * magnitude >= rawStep) ?? 10) * magnitude
  const bottom = Math.max(0, Math.floor((minimum - padding) / step) * step)
  const top = Math.max(bottom + 2 * step, Math.ceil((maximum + padding) / step) * step)
  const ticks = Array.from({ length: Math.round((top - bottom) / step) + 1 }, (_, i) => bottom + i * step)

  return { low, high, target, band, values, bottom, top, ticks }
}
