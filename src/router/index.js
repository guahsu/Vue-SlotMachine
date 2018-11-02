import Vue from 'vue'
import Router from 'vue-router'
import DemoSlotMachine from '@/demo/SlotMachine'
import SlotMachine from '@/components/SlotMachine'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/demo',
      name: 'Demo',
      component: DemoSlotMachine
    },
    {
      path: '/',
      name: 'SlotMachine',
      component: SlotMachine

    }
  ]
})
