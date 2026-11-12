<script setup>
defineProps({
  columns: { type: Array, required: true }, // [{ key, label, align? }]
  rows: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
  emptyText: { type: String, default: 'Belum ada data.' }
})
defineEmits(['row-click'])
</script>

<template>
  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="column.align">{{ column.label }}</th>
          <th v-if="$slots.actions" class="right">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!rows.length">
          <td class="table-empty" :colspan="columns.length + ($slots.actions ? 1 : 0)">{{ emptyText }}</td>
        </tr>
        <tr v-for="row in rows" :key="row[rowKey]" @click="$emit('row-click', row)">
          <td v-for="column in columns" :key="column.key" :class="column.align">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">{{ row[column.key] }}</slot>
          </td>
          <td v-if="$slots.actions" class="right"><slot name="actions" :row="row" /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
