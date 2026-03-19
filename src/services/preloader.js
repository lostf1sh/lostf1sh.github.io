import { reactive, computed } from "vue";

const state = reactive({
  songs: false,
  projects: false,
  contributions: false,
});

export const preloaderState = state;

export const markReady = (key) => {
  if (key in state) state[key] = true;
};

export const loadProgress = computed(() => {
  const values = Object.values(state);
  return values.filter(Boolean).length / values.length;
});

export const allReady = computed(() =>
  Object.values(state).every(Boolean),
);
