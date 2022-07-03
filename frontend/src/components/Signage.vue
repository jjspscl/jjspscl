<script lang="ts" setup>
export interface SignageProps {
      id: string,
      link: string,
      title: string
  }
const props = defineProps<SignageProps>();

</script>

<template>
  <div class="signage">
    <a :href="props.link" class="title">
      {{ props.title }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/colors.scss';
.signage {
  display: flex;
  min-height: 47px;
  min-width: 82px;
  background-color: $BLACKED;
  border-radius: 5px;
  margin: 0 5px;
  box-shadow: 5px 5px 5px black;
}
a {
  font-size: 35px;
  font-family: Quiapo;
  text-align: center;
}
.title {
  margin: auto;
}

/* MOBILE */
@media (max-width: 800px) {
    .signage {
      min-height: 35px;
      min-width: 60px;
    }
    a {
      font-size: 25px;
    }
}

</style>
