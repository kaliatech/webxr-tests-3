<template>
  <div>
    <the-main-header />
    <main>
      <slot></slot>
    </main>
    <footer class="home-footer">
      <small>&copy;2022 Kaliatech</small>
    </footer>
  </div>
</template>
<script setup lang="ts">
import TheMainHeader from '../../components/TheMainHeader.vue'
</script>
