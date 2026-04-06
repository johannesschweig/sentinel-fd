<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { sendMessage } from '@/mqtt'



const selectedId = ref(0)
const messages = ['triggered', 'idle', 'deactivated', 'disarmed', 'armed', 'unknown']

const selectedMessage = ref(messages[0])

function sendMessageFromForm(id?: string | PointerEvent, msg?: string) {
  // If called from a click handler, the first argument may be a PointerEvent — ignore it.
  if (id && typeof id !== 'string') {
    id = undefined
  }
  const idToSend = id || selectedId.value.toString()
  const messageToSend = msg || selectedMessage.value || 'disarmed'

  sendMessage(idToSend, messageToSend)
}

function sendInitMessages() {
  sendMessage('101', 'armed')
  sendMessage('102', 'disarmed')
  sendMessage('103', 'disarmed')
  sendMessage('104', 'disarmed')
  sendMessage('201', 'disarmed')
  sendMessage('202', 'disarmed')
  sendMessage('203', 'armed')
  sendMessage('204', 'disarmed')
  // sendMessage('101001', 'unknown')
  // sendMessage('101002', 'unknown')
  // sendMessage('101003', 'unknown')
  // sendMessage('101004', 'unknown')
}
</script>

<template>
  <div class="p-4">
    <div class="mb-8">
      <button @click="sendInitMessages"
        class="bg-white border border-text-500 text-blue-800 px-3 py-1 rounded hover:bg-blue-100 mb-6">
        Initalize States
      </button>
      <div class="flex gap-2 flex-wrap items-center">
        <input v-model="selectedId" class="border px-2 py-1 rounded" />

        <select v-model="selectedMessage" class="border px-2 py-1 rounded">
          <option v-for="msg in messages" :key="msg" :value="msg">{{ msg }}</option>
        </select>

        <button @click="sendMessageFromForm" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  </div>
</template>
