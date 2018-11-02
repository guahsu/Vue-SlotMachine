<template>
  <div id="DemoSlotMachine" @click.self="openResultHistory = false">
    <div :class="['resultHistory', {'openResultHistory' : openResultHistory }]">
      <div class="result" v-for="(result, index) in resultHistory" :key="index">{{ `Round${index + 1}: ${result}` }}</div>
    </div>
    <!--  -->
    <div class="container">
      <Gift
        v-for="(config, index) in configs"
        @finished="isFinished"
        :trigger="trigger"
        :config="config"
        :key="index">
      </Gift>
    </div>
    <!--  -->
    <div class="settings">
      <button
        class="btn"
        @click="turn"
        :disabled="disabled">
        START
      </button>
      <button
        class="btn"
        @click="openResultHistory = true">
        Result History
      </button>
      <input
        type="checkbox"
        class="displayType"
        @change="changeDisplayMode"
        :disabled="disabled">
    </div>
    <!--  -->
  </div>
</template>

<script>
import Gift from './Gift'
export default {
  name: 'DemoSlotMachine',
  components: {
    Gift
  },
  data () {
    return {
      run3D: true,
      trigger: null,
      disabled: false,
      configs: [
        {
          run3D: false,
          rotateY: -25,
          duration: 4000,
          rollback: 0.3,
          fontSize: 100,
          height: 100,
          width: 200,
          gifts: Array.from(new Array(10), (val, index) => { return { type: 'text', name: index } })
        },
        {
          run3D: false,
          rotateY: -25,
          duration: 5000,
          rollback: 0.3,
          fontSize: 100,
          height: 100,
          width: 200,
          gifts: Array.from(new Array(10), (val, index) => { return { type: 'text', name: index } })
        },
        {
          run3D: false,
          rotateY: -25,
          duration: 6000,
          rollback: 0.3,
          fontSize: 100,
          height: 100,
          width: 200,
          gifts: Array.from(new Array(10), (val, index) => { return { type: 'text', name: index } })
        }
      ],
      openResultHistory: false,
      result: [],
      resultHistory: []
    }
  },
  methods: {
    turn () {
      this.disabled = true
      this.trigger = new Date()
    },
    isFinished (val) {
      const autoTurnList = this.$el.querySelectorAll('.autoTurn')
      this.result.push(val)
      if (autoTurnList.length === 1) {
        this.disabled = false
        this.resultHistory.push(this.result)
        this.result = []
      }
    },
    changeDisplayMode (e) {
      this.configs.forEach(item => (item.run3D = e.target.checked))
    }
  }
}
</script>

<style lang="scss" scoped>
#DemoSlotMachine {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .container {
    display: flex;
  }
  .settings {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 5vh;
    .btn {
      margin-right: 20px;
      padding: 15px 30px;
      outline: none;
      border: none;
      border-radius: 10px;
      background-color: #42b983;
      color: #ffffff;
      font-size: 16px;
      cursor: pointer;
      transition: 0.15s;
      user-select: none;
      &:disabled {
        background-color: #ddd;
        cursor: not-allowed;
      }
    }
    .displayType {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      &::after {
        position: absolute;
        display: block;
        left: 100%;
        margin-left: 10px;
        font-size: 16px;
        content: '3D模式';
        white-space: nowrap;
      }
      &:disabled {
        background-color: #ddd;
        cursor: not-allowed;
      }
    }
  }
  .resultHistory {
    position: absolute;
    transform: translateZ(99999px);
    z-index: 999;
    min-width: 300px;
    height: 400px;
    padding: 20px;
    border: solid 5px #333;
    border-radius: 30px;
    background-color: #fff;
    box-shadow: 5px 5px 15px rgba(0,0,0,0.4);
    opacity: 0;
    transition: 0.5s;
    overflow-y: auto;
    visibility: hidden;
    .result {
      padding: 15px;
      list-style: none;
      font-size: 30px;
    }
    &.openResultHistory {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
