<template>
    <template v-for="social in socials" :key="social.name">
        <a 
          v-html="social.icon" 
          :class="`${isDark ? 'fill-white' : 'fill-black'} w-7 h-7 ml-1 stroke-2`"
          :href="social.link"
          target="_blank"
        />
    </template> 
</template>

<script setup>
import { Fragment, computed, ref, watch } from 'vue';
import { useStore } from '@nanostores/vue';
import { themeStore } from '@stores/theme';
import LinkedinIcon from '../assets/icons/linkedin.svg?raw';
import GithubIcon from '../assets/icons/github.svg?raw';
import TwitterIcon from '../assets/icons/twitter.svg?raw';

const $theme = useStore(themeStore);

const socials = ref([
  { name: "Github", icon: GithubIcon, link: "https://github.com/jjspscl" },
  {
    name: "Linkedin",
    icon: LinkedinIcon,
    link: "https://www.linkedin.com/in/jjspscl/",
  },
  { name: "Twitter", icon: TwitterIcon, link: "https://twitter.com/jjspscl" },
]);

const props = defineProps({
    icon: String
});

const isDark = ref($theme.value === 'dark');
themeStore.subscribe((value) => {
    isDark.value = value === 'dark';
});
</script>

<style>

</style>