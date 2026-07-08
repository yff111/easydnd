# Nested Instances

A Kanban board built from two `createDragDrop()` instances sharing the same `board` container:

- One reorders whole **columns**, armed only from each column's `.column-handle`.
- One covers every card list, so cards reorder **within** and move **across** columns via a single instance.

They share a container because a card lives inside its column's DOM subtree. A card's `dragstart` bubbles up through the column, so the outer instance's `.column` selector could match it — but two guards prevent cross-talk:

- Disjoint selectors (`.column` vs. `.list-item`): a card drag can bubble to its ancestor `.column`, but never matches `.list-item` and vice versa.
- `createDragDrop` only acts on a bubbled `dragstart` if the matched element's own `draggable` is `true` — true only for the element that instance armed on `mousedown`, never an ancestor.

The card instance follows the same pattern as [Multiple Lists](/multiple-lists): `dropPositionFn` distinguishes `in` (drop into column) from `around` (reorder), and `onDragEnd` uses [`reorderItems`](/types) within a column or `moveItemsToArrayMutate` across columns.

<script setup>
  import 'dnd-ts/dist/styles.css'
  import { defineClientComponent } from 'vitepress'

  const NestedInstancesDemo = defineClientComponent(() => import('./nested-instances-demo.vue'))
</script>

**Demo**

<NestedInstancesDemo></NestedInstancesDemo>

::: code-group

<<< nested-instances-demo.vue{vue}

:::
