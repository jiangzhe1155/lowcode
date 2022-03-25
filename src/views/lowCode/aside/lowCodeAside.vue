<script setup lang="ts">
import { Operation, PieChart } from '@element-plus/icons-vue'
import { useConfigStore } from '/src/stores/constant'

const store = useConfigStore()
let h = (document.documentElement.clientHeight || document.body.clientHeight) - 100
console.log(h)
</script>
<template>
  <el-aside class="!h-full" :width="store.asideWidth +'px'">
    <el-menu :collapse="true" class="!w-full">
      <el-menu-item index="1">
        <el-icon>
          <Operation/>
        </el-icon>
        <div v-show="false">asdsad</div>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon>
          <PieChart/>
        </el-icon>
        <template #title>组件库</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
  <el-card class="box-card absoluute" :style="{height:h+'px',left:store.asideWidth+'px'}">

  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LowCodeAside'
})

</script>

<style scoped>

</style>
