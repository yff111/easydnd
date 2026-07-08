export interface AutoScrollPluginOptions {
  /**
   * Interval (in milliseconds)
   *
   * Defaults to: 8
   */
  interval: number
  /**
   * Maximum scroll distance per interval tick (in pixels), reached when the
   * cursor is at/past the container's edge. Scroll speed ramps up smoothly
   * as the cursor approaches the edge within `threshold`.
   *
   * Defaults to: 4
   */
  steps: number
  /**
   * Distance to the outer bounds of the scrollable container that triggers
   * auto-scrolling.
   *
   * Defaults to: 100
   */
  threshold: number
}
