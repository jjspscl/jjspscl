<template>
  <div class="flex transition-opacity rounded-full items-center overflow-hidden">
    <button @click="toggleDarkMode" type="button">
      <!-- TODO: ADD transitions animate-[fade-in-up_0.5s_ease-in-out] -->
      <div v-if="isDarkMode" v-html="moonSvg" class="w-10 h-10"></div>
      <div v-else v-html="sunSvg" class="w-10 h-10"></div>
    </button>
  </div>
</template>

<script setup>
    import { computed, onMounted, ref } from 'vue';
    import { useStore } from '@nanostores/vue';
    import { themeStore } from '@stores/theme';
    import moonSvg from '@assets/icons/moon.svg?raw';
    import sunSvg from '@assets/icons/sun.svg?raw';

    const $theme = useStore(themeStore);
    const isDarkMode = ref(document.documentElement.dataset.theme === 'dark');
    themeStore.set(isDarkMode.value ? 'dark' : 'light');
    const root = document.querySelector('html');
    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value;
        themeStore.set(isDarkMode.value ? 'dark' : 'light');
        const nextTheme =
					document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
				document.documentElement.dataset.theme = nextTheme;
				document.cookie = `theme=${nextTheme};path=/S`;
    };

    // Initialize dark mode based on user preference or system setting
    // const themePreference = localStorage.getItem('theme');
    // if (themePreference === 'dark') {
    //   isDarkMode.value = true;
    // }
</script>
