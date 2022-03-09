<template>
  <div>
    <the-main-header />
    <main>
      <slot></slot>
    </main>
  </div>
</template>
<script setup lang="ts">
import TheMainHeader from '../../components/TheMainHeader.vue'
</script>
