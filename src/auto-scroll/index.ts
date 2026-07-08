import type { DragDropPlugin, Rect } from '../types'
import type { AutoScrollPluginOptions } from './types'
import { getScrollX, getScrollY } from '../utils'

function getClientCoords(event: DragEvent | MouseEvent | TouchEvent | KeyboardEvent) {
  if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
    const t = event.touches[0] ?? event.changedTouches[0]
    return { clientX: t?.clientX ?? 0, clientY: t?.clientY ?? 0 }
  }
  if (event instanceof KeyboardEvent)
    return { clientX: 0, clientY: 0 }
  return { clientX: (event as MouseEvent).clientX, clientY: (event as MouseEvent).clientY }
}

export const DEFAULTS: AutoScrollPluginOptions = {
  interval: 8,
  steps: 4,
  threshold: 100,
}

// Eases the ramp-up so it isn't imperceptibly slow right as the cursor
// crosses into the threshold zone, while still maxing out at the edge.
function intensityFromRatio(ratio: number) {
  return Math.sqrt(Math.min(Math.max(ratio, 0), 1))
}

// Returns a signed value in [-1, 1]: sign is the scroll direction, magnitude
// is how close the cursor is to the container's edge (0 outside the
// threshold zone, 1 right at/past the edge).
function computeScrollRatio(pos: number, containerStart: number, containerSize: number, threshold: number) {
  if (threshold <= 0)
    return 0
  const distFromStart = pos - containerStart
  const distFromEnd = containerStart + containerSize - pos
  if (distFromStart < threshold)
    return -intensityFromRatio((threshold - distFromStart) / threshold)
  if (distFromEnd < threshold)
    return intensityFromRatio((threshold - distFromEnd) / threshold)
  return 0
}

function autoScroll(options?: Partial<AutoScrollPluginOptions>): DragDropPlugin {
  const { interval, steps, threshold } = options
    ? { ...DEFAULTS, ...options }
    : DEFAULTS

  let scrollInterval: ReturnType<typeof setInterval> | undefined
  let currentScrollContainer: HTMLElement | Window = window
  let scrollContainerRect: Rect | DOMRect = { x: 0, y: 0, width: 0, height: 0 }

  const scroll = (scrollRatioY: number, scrollRatioX: number) => {
    clearInterval(scrollInterval)
    scrollInterval = setInterval(
      () =>
        currentScrollContainer.scrollTo({
          top: getScrollY(currentScrollContainer) + scrollRatioY * steps,
          left: getScrollX(currentScrollContainer) + scrollRatioX * steps,
        }),
      interval,
    )
  }

  const cancelScroll = () => {
    clearInterval(scrollInterval)
    scrollInterval = undefined
  }

  const updateScrollContainer = (element: HTMLElement | Window) => {
    currentScrollContainer = element
    scrollContainerRect
      = element instanceof Window
        ? { x: 0, y: 0, height: element.innerHeight, width: element.innerWidth }
        : element.getBoundingClientRect()
  }

  return {
    DragStart({ scrollContainer }) {
      updateScrollContainer(scrollContainer)
    },
    DragOver({ scrollContainer, originalEvent }) {
      if (scrollContainer !== currentScrollContainer) {
        updateScrollContainer(scrollContainer)
      }
      const { clientX, clientY } = getClientCoords(originalEvent)
      const scrollRatioY = computeScrollRatio(clientY, scrollContainerRect.y, scrollContainerRect.height, threshold)
      const scrollRatioX = computeScrollRatio(clientX, scrollContainerRect.x, scrollContainerRect.width, threshold)

      if (scrollRatioY || scrollRatioX)
        scroll(scrollRatioY, scrollRatioX)
      else cancelScroll()
    },
    DragEnd() { cancelScroll() },
  }
}

export { autoScroll }
export default autoScroll
