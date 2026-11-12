import { DELIVERY_NEXT_STATUS, DELIVERY_STATUS, DELIVERY_STATUS_LABELS } from '@/utils/constants'
import { todayISO } from '@/utils/date'
import { useDeliveriesStore } from '@/stores/deliveries'

export function scheduleDelivery(data) {
  return useDeliveriesStore().add({
    order_id: Number(data.order_id),
    courier_id: Number(data.courier_id),
    delivery_date: data.delivery_date,
    status: DELIVERY_STATUS.SCHEDULED,
    delivered_date: null,
    notes: data.notes ?? ''
  })
}

// Jadwal hanya bisa diubah selama belum berangkat
export function rescheduleDelivery(id, data) {
  const store = useDeliveriesStore()
  if (store.byId(id)?.status !== DELIVERY_STATUS.SCHEDULED) {
    return { ok: false, message: 'Jadwal tidak bisa diubah setelah pengiriman berangkat.' }
  }
  store.update(id, { courier_id: Number(data.courier_id), delivery_date: data.delivery_date })
  return { ok: true }
}

// Urutan: dijadwalkan -> dalam perjalanan -> terkirim
export function advanceDeliveryStatus(id, targetStatus = null) {
  const store = useDeliveriesStore()
  const delivery = store.byId(id)
  if (!delivery) return { ok: false, message: 'Pengiriman tidak ditemukan.' }
  const next = DELIVERY_NEXT_STATUS[delivery.status]
  if (!next) return { ok: false, message: 'Pengiriman sudah selesai.' }
  if (targetStatus && targetStatus !== next) {
    return {
      ok: false,
      message: `Tidak bisa dari '${DELIVERY_STATUS_LABELS[delivery.status]}' langsung ke '${DELIVERY_STATUS_LABELS[targetStatus]}'.`
    }
  }
  store.update(id, { status: next, delivered_date: next === DELIVERY_STATUS.DELIVERED ? todayISO() : null })
  return { ok: true, status: next }
}
