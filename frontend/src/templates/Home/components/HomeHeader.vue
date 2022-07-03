<script>
import { onMounted, onUnmounted, ref } from "vue";
import Signage from "../../../components/Signage.vue";

export default {
  setup() {
    const showHeader = ref(true);
    const lastPosition = ref(0);
    const scrollOffset = ref(40);
    const onScroll = () => {
      if (window.pageYOffset < 0) {
        return;
      }
      if (Math.abs(window.pageYOffset - lastPosition.value) < scrollOffset.value) {
        return;
      }
      showHeader.value = window.pageYOffset < lastPosition.value;
      lastPosition.value = window.pageYOffset;
    };
    onMounted(() => {
      lastPosition.value = window.pageYOffset;
      window.addEventListener("scroll", onScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", onScroll);
    });
    return {
      showHeader
    };
  },
  components: { Signage }
};
</script>
<style lang="scss" scoped>
@import '../../../styles/colors.scss';
nav {
    display: flex;
    position: fixed;
    width: 100%;
    min-height: 1rem;
    transform: translateY(0);
    transition: transform 300ms linear;
    padding: 10px 0;
}
.is-hidden {
    transform: translateY(-100%);
}
.signage-container {
    display: flex;
    margin: 0 auto;
}
.home {
    background-color: $FIERY-ORANGE;
}
.about {
    background: $LG-WHITE-PUNCH;
    color: black;
    padding: 0 5px;
}

.blog {
    background-color: $DAIRY-CREAM;
    color: black;
}
/* MOBILE */
// @media (max-width: 800px) {
//     nav {
//         bottom: 0;
//         transform: 0;
//     transform: translateY(0);
//         transition: transform 300ms linear;
//     }
//     .is-hidden {
//         transform: translateY(100%);;
//     }

// }
</style>

<template>
    <nav class="home-header" :class="{ 'is-hidden': !showHeader }">
        <div class="signage-container">
            <Signage title="ABOUT" link="#about-me" class="home"/>
            <Signage title="PROJECTS" link="#projects" class="about"/>
            <Signage title="BLOG" link="/" class="blog"/>
        </div>
    </nav>
</template>
