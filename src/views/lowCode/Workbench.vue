<script setup lang="ts">
import LowCodeAside from './aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import OperationPanel from '@/views/lowCode/main/OperationPanel.vue'
import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'
import { ref } from 'vue'
import { useScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const {
  x,
  y
} = useScroll(el)

const store = useConfigStore()
</script>
<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2 !z-100" :height="store.headerHeight+'px'">
      {{ x }} {{ y }}
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0">
        <div
            class="relative  h-full shadow border-solid border-1">
          <div
              ref="el"
               class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-scroll overflow-x-hidden">
            <div class="absolute w-full h-full">
              <VisualNodeHelper :scrollY="y">
              </VisualNodeHelper>
              <OperationPanel>
              </OperationPanel>
            </div>
          </div>
        </div>

        <!--                <div class="h-auto">-->
        <!--                  <div class="!bg-gray-100 w-full shadow border-solid border-1 absolute">-->
        <!--                    <div class="absolute w-full h-full">-->
        <!--                      <VisualNodeHelper>-->
        <!--                      </VisualNodeHelper>-->
        <!--                    </div>-->
        <!--                    <div class="absolute w-full h-full">-->
        <!--                      <OperationPanel>-->
        <!--                      </OperationPanel>-->
        <!--                    </div>-->
        <!--                  </div>-->
        <!--                </div>-->
      </el-main>
      <el-aside class="border-l-1">右侧边栏</el-aside>
    </el-container>
  </el-container>
</template>
<style>
::-webkit-scrollbar {
  width: 6px;
  height: 8px;
}

/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}

</style>
