<script setup lang="ts">
import { Ref } from 'vue'
import {
  Card, CardProp
} from '@/views/designer/service/component'
import { usePropsWatcher } from '@/views/designer/service/propsWatcher'
import SwitchConfig from '@/views/designer/config/SwitchConfig.vue'
import StringConfig from '@/views/designer/config/StringConfig.vue'
import VariableConfig from '@/views/designer/config/VariableConfig.vue'
import ItemLabel from '@/views/designer/config/panel/ItemLabel.vue'
import PropValueSetter from '@/views/designer/config/panel/PropValueSetter.vue'
import Item from '@/views/designer/config/panel/Item.vue'
import ItemContainer from '@/views/designer/config/panel/ItemContainer.vue'

const props = defineProps<{
  component: Ref<Card>
}>()

const { config } = usePropsWatcher(() => new CardProp(), props.component)

</script>

<template>
  <ItemContainer class="px-12px">
    <Item>
      <ItemLabel fixed>开启头部</ItemLabel>
      <div class="flex-grow">
        <SwitchConfig :prop="config.enableHeader"></SwitchConfig>
      </div>
    </Item>

    <Item v-if="config.enableHeader.options[config.enableHeader.idx]">
      <ItemLabel fixed>标题</ItemLabel>
      <div class="flex-grow">
        <StringConfig :prop="config.title"></StringConfig>
        <VariableConfig :prop="config.title"></VariableConfig>
      </div>
      <PropValueSetter :prop="config.title"></PropValueSetter>
    </Item>
  </ItemContainer>
</template>

<style scoped>
</style>
