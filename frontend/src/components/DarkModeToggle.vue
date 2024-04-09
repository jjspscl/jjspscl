<template>
  <div class="flex transition-opacity rounded-full items-center overflow-hidden">
    <button @click="toggleDarkMode" type="button">
      <!-- <img :src="currentIcon.src" :alt="currentIcon.alt" class="w-10 dark:bg-pinoy-cream-500" /> -->
      <!-- animate the svg that is com -->
      <div v-if="isDarkMode" v-html="moonSvg" class="w-10 h-10 animate-[fade-in-up_0.5s_ease-in-out]"></div>
      <div v-else v-html="sunSvg" class="w-10 h-10 animate-[fade-in-up_0.5s_ease-in-out]"></div>
    </button>
  </div>
</template>

<script setup>
    import { computed, onMounted, ref } from 'vue';
    import { useStore } from '@nanostores/vue';
    import moonSvg from '@assets/icons/moon.svg?raw';
    import sunSvg from '@assets/icons/sun.svg?raw';

    const isDarkMode = ref(document.documentElement.dataset.theme === 'dark');
    const root = document.querySelector('html');
    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value;
        const nextTheme =
					document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
				document.documentElement.dataset.theme = nextTheme;
				document.cookie = `theme=${nextTheme}`;
    };

    // Initialize dark mode based on user preference or system setting
    // const themePreference = localStorage.getItem('theme');
    // if (themePreference === 'dark') {
    //   isDarkMode.value = true;
    // }
</script>
