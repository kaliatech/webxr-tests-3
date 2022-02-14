<template>
  <div>
    <the-main-header />
    <main>
      <slot></slot>
    </main>
    <the-main-footer />
  </div>
</template>
<script setup lang="ts">
import TheMainHeader from '../../components/TheMainHeader.vue'
import TheMainFooter from '../../components/TheMainFooter.vue'
</script>
