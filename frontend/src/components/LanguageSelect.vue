<template>
    <a :href="targetPath" class="flex items-center space-x-2 w-10 h-10 rounded-full overflow-hidden" @click="toggleLanguage" data-astro-prefetch>
        <img :src="selectedFlag.src" :alt="selectedFlag.alt" class="w-20 h-20" />
    </a>
</template>

<script setup>
import { useStore } from '@nanostores/vue';
import { languageStore } from "@stores/language";
import { computed, onMounted, ref, watch } from "vue";
import { prefetch } from "astro:prefetch";
import PHFlag from '@assets/flags/ph.svg';
import USFlag from '@assets/flags/us.svg';


const $language = useStore(languageStore);
let linkRef = ref(null);

const currentPath = window.location.pathname;
let targetPath = ref(`${currentPath}${window.location.search ? '&' : '?'}lang=en-ph`);
const urlParams = new URLSearchParams(window.location.search);
const currentParamLang = ref(urlParams.get('lang') ?? 'en'); 
const currentLang = ref(currentParamLang);
const selectedFlag = ref(currentLang.value === 'en' ? USFlag : USFlag);

onMounted(() => {
    if (currentLang.value === 'en-ph') {
        targetPath.value = `${currentPath}${window.location.search.replace(/lang=en-ph&?/, '')}`;
        selectedFlag.value = PHFlag;
    } else {
        targetPath.value = `${currentPath}${window.location.search ? '&' : '?'}lang=en-ph`;
        selectedFlag.value = USFlag;
    }
    // location.href = targetPath.value;
});

const toggleLanguage = () => {
    currentLang.value = currentLang.value === 'en' ? 'en-ph' : 'en';
    languageStore.set(currentLang.value);
}

const prefetchLanguage = () => {
    prefetch(targetPath.value, { 
        lang: $language.value === 'en' ? 'en-ph' : 'en'
    });
}

</script>