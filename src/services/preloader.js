import { reactive, computed } from "vue";

const state = reactive({
  songs: false,
  projects: false,
  contributions: false,
});

export const markReady = (key) => {
  if (key in state) state[key] = true;
};

export const allReady = computed(() =>
  Object.values(state).every(Boolean),
);
