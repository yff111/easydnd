<script lang="ts" setup>
import { createDragDrop } from 'dnd-ts'
import { moveItemsToArrayMutate, reorderItems } from 'dnd-ts/utils'
import { onMounted, onUnmounted, ref } from 'vue'

interface Card { id: string, name: string }
interface Column { id: string, title: string, cards: Card[] }

const columns = ref<Column[]>([
  {
    id: 'col-1',
    title: 'Backlog',
    cards: [
      { id: 'card-1', name: 'Research competitors' },
      { id: 'card-2', name: 'Write project brief' },
      { id: 'card-3', name: 'Collect requirements' },
    ],
  },
  {
    id: 'col-2',
    title: 'In Progress',
    cards: [
      { id: 'card-4', name: 'Design database schema' },
      { id: 'card-5', name: 'Build login flow' },
    ],
  },
  {
    id: 'col-3',
    title: 'Done',
    cards: [
      { id: 'card-6', name: 'Set up repository' },
      { id: 'card-7', name: 'Configure CI' },
    ],
  },
])

function findColumnById(id: string) {
  return columns.value.find(c => c.id === id)!
}

const board = ref<HTMLElement | null>(null)

let columnsInstance: ReturnType<typeof createDragDrop> | undefined
let cardsInstance: ReturnType<typeof createDragDrop> | undefined

onMounted(() => {
  // Reorders whole columns. Only ever triggered from `.column-handle`, and
  // `.column` never overlaps with the cards instance's own dragElementSelector
  // below, so a card drag is never mistaken for a column drag (and vice
  // versa) even though both instances share the same `board` container.
  columnsInstance = createDragDrop(board.value!, {
    dragElementSelector: '.column',
    dropElementSelector: '.column',
    handleSelector: '.column-handle',
    vertical: false,
    addClasses: true,
    indicator: { offset: 6 },
    onDragEnd({ dragElements, dropElement, position }) {
      if (!dropElement)
        return
      const index = Number.parseInt(dropElement.getAttribute('data-index')!)
      const selectedColumns = dragElements.map(e => findColumnById(e.getAttribute('data-id')!))
      if (position === 'after')
        columns.value = reorderItems(columns.value, selectedColumns, index + 1)
      else if (position === 'before')
        columns.value = reorderItems(columns.value, selectedColumns, index)
    },
  })

  // A single instance covering every column's card list, so cards can be
  // dragged both within a column and across columns - no per-column
  // instance needed.
  cardsInstance = createDragDrop(board.value!, {
    dragElementSelector: '.list-item',
    addClasses: true,
    indicator: { offset: 2 },
    dragImage: { minElements: 1 },
    dropPositionFn: ({ dragElement, dropElement }) => {
      const isDropElementParent = dropElement.getAttribute('data-parent-id') === null
      const isOwnChild = dropElement.contains(dragElement)
      return isOwnChild ? 'in' : isDropElementParent ? 'in' : 'around'
    },
    onDragEnd({ dragElements, dropElement, position }) {
      if (!dropElement)
        return
      const sourceColumn = findColumnById(dragElements[0].getAttribute('data-parent-id')!)
      const draggedCards = dragElements.map(
        e => sourceColumn.cards.find(c => c.id === e.getAttribute('data-id'))!,
      )

      if (position === 'in') {
        const targetColumn = findColumnById(dropElement.getAttribute('data-id')!)
        if (targetColumn === sourceColumn) {
          sourceColumn.cards = reorderItems(sourceColumn.cards, draggedCards, 0)
        }
        else {
          sourceColumn.cards = moveItemsToArrayMutate(sourceColumn.cards, targetColumn.cards, draggedCards, 0)
        }
        return
      }

      const targetColumn = findColumnById(dropElement.getAttribute('data-parent-id')!)
      const index = Number.parseInt(dropElement.getAttribute('data-index')!)
      const targetIndex = position === 'after' ? index + 1 : index

      if (targetColumn === sourceColumn) {
        sourceColumn.cards = reorderItems(sourceColumn.cards, draggedCards, targetIndex)
      }
      else {
        sourceColumn.cards = moveItemsToArrayMutate(sourceColumn.cards, targetColumn.cards, draggedCards, targetIndex)
      }
    },
  })
})

onUnmounted(() => {
  columnsInstance?.destroy()
  cardsInstance?.destroy()
})
</script>

<template>
  <div ref="board" class="demo" style="display: flex; gap: 12px; padding: 10px">
    <div
      v-for="(column, index) in columns"
      :key="column.id"
      class="column"
      :data-id="column.id"
      :data-index="index"
      style="
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        background: #fff;
        border: 1px solid #eee;
        border-radius: 8px;
      "
    >
      <div
        class="column-handle"
        style="
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          cursor: grab;
          font-weight: 600;
          border-bottom: 1px solid #eee;
        "
      >
        <img src="/handle.svg">
        <span>{{ column.title }}</span>
      </div>
      <div style="padding: 8px; min-height: 60px">
        <ul class="list">
          <li
            v-for="(card, cardIndex) in column.cards"
            :key="card.id"
            :data-id="card.id"
            :data-index="cardIndex"
            :data-parent-id="column.id"
            class="list-item"
            style="margin-bottom: 4px"
          >
            <img src="/handle.svg">
            <span>{{ card.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
