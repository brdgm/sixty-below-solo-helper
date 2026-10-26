<template>
  <div v-for="(item, index) in items" :key="index" class="alert alert-warning notice mt-3 mb-0" role="status">
    <AppIcon v-if="item.icon" type="misc" :name="item.icon" class="icon"/>
    <span v-if="item.notice.type == 'not-possible'" v-html="t('botActionNotice.not-possible', {
        action:t(`rules.action.${item.notice.action}.title`), reason:t(`notPossibleReason.${item.notice.reason}`)})"></span>
    <span v-else v-html="t(`botActionNotice.${item.notice.type}`, {count:item.notice.starLimit})"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/structure/AppIcon.vue'
import { BotActionNotice } from '@/services/BotActions'
import BotActionNoticeType from '@/services/enum/BotActionNoticeType'

const NOTICE_ICONS : Partial<Record<BotActionNoticeType, string>> = {
  [BotActionNoticeType.UPGRADE]: 'upgrade',
  [BotActionNoticeType.EXPEDITION_LEVEL]: 'expedition-track'
}

/**
 * Notices of important automated effects of Arka's turn (Upgrade, Expedition Level, action not possible).
 */
export default defineComponent({
  name: 'BotActionNotices',
  components: {
    AppIcon
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
  props: {
    notices: {
      type: Array as PropType<BotActionNotice[]>,
      required: true
    }
  },
  computed: {
    items() : NoticeItem[] {
      return this.notices.map(notice => ({ notice, icon: NOTICE_ICONS[notice.type] }))
    }
  }
})

interface NoticeItem {
  notice: BotActionNotice
  icon?: string
}
</script>

<style lang="scss" scoped>
.notice {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-width: 40rem;
  .icon {
    height: 2rem;
  }
}
</style>
