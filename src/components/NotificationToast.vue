<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success', // 'success', 'error', 'warning', 'info'
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000 // 5 segundos
  }
});

const emit = defineEmits(['close']);

const visible = ref(true);

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close();
    }, props.duration);
  }
});

const close = () => {
  visible.value = false;
  emit('close');
};

const getIcon = () => {
  switch (props.type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '✅';
  }
};
</script>

<template>
  <Transition name="slide">
    <div v-if="visible" :class="['notification', `notification-${type}`]">
      <span class="notification-icon">{{ getIcon() }}</span>
      <span class="notification-message">{{ message }}</span>
      <button @click="close" class="notification-close" aria-label="Fechar notificação">
        ✕
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.notification {
  position: fixed;
  top: 80px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 9999;
  animation: slideIn 0.3s ease;
}

.notification-success {
  background-color: #d4edda;
  border-left: 4px solid #28a745;
  color: #155724;
}

.notification-error {
  background-color: #f8d7da;
  border-left: 4px solid #dc3545;
  color: #721c24;
}

.notification-warning {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  color: #856404;
}

.notification-info {
  background-color: #d1ecf1;
  border-left: 4px solid #17a2b8;
  color: #0c5460;
}

.notification-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 0.95rem;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: inherit;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
  flex-shrink: 0;
}

.notification-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .notification {
    top: 70px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>
