<template>
  <a ref="trigger" href="#" tabindex="0" class="info-hint" :aria-label="text" @click.prevent>
    <img src="@/assets/icons/help-semi-transparent.webp" alt=""/>
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Popover } from 'bootstrap'

/**
 * Help icon that shows a hint text in a popover on click/tap, closed by the next click/tap anywhere.
 * Uses a focusable anchor with focus trigger, as recommended by Bootstrap for dismissible popovers on all devices.
 */
export default defineComponent({
  name: 'InfoHint',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  watch: {
    text(value : string) {
      const popover = this.getPopover()
      popover?.setContent({ '.popover-body': value })
    }
  },
  mounted() {
    const { trigger } = this.$refs
    if (trigger instanceof HTMLElement) {
      Popover.getOrCreateInstance(trigger, { content: this.text, trigger: 'focus', placement: 'top' })
    }
  },
  beforeUnmount() {
    this.getPopover()?.dispose()
  },
  methods: {
    getPopover() : Popover|null {
      const { trigger } = this.$refs
      return trigger instanceof HTMLElement ? Popover.getInstance(trigger) : null
    }
  }
})
</script>

<style lang="scss" scoped>
.info-hint {
  display: inline-block;
  padding: 0.25rem;
  vertical-align: middle;
  img {
    display: block;
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
