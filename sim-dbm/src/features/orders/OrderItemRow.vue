<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import { formatRupiah } from '@/utils/format'

// Satu baris barang di form order. Harga otomatis dari harga pelanggan (readonly).
defineProps({
  item: { type: Object, required: true }, // { product_id, packing_design, quantity, unit_price }
  productOptions: { type: Array, required: true },
  designOptions: { type: Array, required: true },
  errors: { type: Object, default: () => ({}) }, // { product_id, packing_design, quantity }
  locked: { type: Boolean, default: false }
})
const emit = defineEmits(['update:item', 'remove'])
</script>

<template>
  <div class="item-row">
    <div :class="['field', { 'has-error': errors.product_id }]">
      <label>Produk</label>
      <select :value="item.product_id" :disabled="locked" @change="emit('update:item', { ...item, product_id: $event.target.value, packing_design: '' })">
        <option value="" disabled>Pilih produk</option>
        <option v-for="option in productOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <span v-if="errors.product_id" class="field-error">{{ errors.product_id }}</span>
    </div>
    <div :class="['field', { 'has-error': errors.packing_design }]">
      <label>Desain packing</label>
      <select :value="item.packing_design" :disabled="locked" @change="emit('update:item', { ...item, packing_design: $event.target.value })">
        <option value="" disabled>Pilih desain</option>
        <option v-for="option in designOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <span v-if="errors.packing_design" class="field-error">{{ errors.packing_design }}</span>
    </div>
    <div :class="['field', { 'has-error': errors.quantity }]">
      <label>Jumlah (pcs)</label>
      <input type="text" inputmode="numeric" :value="item.quantity" :disabled="locked" @input="emit('update:item', { ...item, quantity: $event.target.value })" />
      <span v-if="errors.quantity" class="field-error">{{ errors.quantity }}</span>
    </div>
    <div class="field">
      <label>Harga</label>
      <span>{{ item.unit_price ? formatRupiah(item.unit_price) : '-' }}</span>
    </div>
    <BaseButton v-if="!locked" variant="danger" small @click="emit('remove')">Hapus</BaseButton>
  </div>
</template>
