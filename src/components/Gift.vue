<template>
  <div :class="['gift-container', displayType, { 'autoTurn': isRunning }]">
    <div
      :class="['gift', config.style]"
      v-for="(gift, index) in config.gifts"
      :key="index"
      :style="`transform: rotateX(${(rotate) * index}deg) translateZ(${translateZ}px)`">
      <template v-if="gift.type === 'text'">{{ gift.name }}</template>
      <template v-if="gift.type === 'image'">
        <img :src="gift.path" :height="config.height">
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Gift',
  props: {
    trigger: {
      type: Date,
      default: false
    },
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isRunning: false,
      currentDeg: 0,
      targetDeg: 0,
      giftsDeg: []
    }
  },
  computed: {
    displayType () {
      return this.config.run3D ? 'three-dimension' : 'flat'
    },
    rotate () {
      return 360 / this.config.gifts.length
    },
    translateZ () {
      return (this.config.height / 2) / Math.tan((this.rotate / 2 / 180) * Math.PI)
    }
  },
  watch: {
    config: {
      handler () {
        this.setConfig()
      },
      deep: true
    },
    trigger () {
      this.autoTurn()
    },
    isRunning () {
      if (this.isRunning) {
        setTimeout(() => {
          this.autoTurnStop()
        }, this.config.duration + 200)
      }
    }
  },
  mounted () {
    this.setConfig()
    this.logGiftsDeg()
  },
  destroyed () {
  },
  methods: {
    logGiftsDeg () {
      // 紀錄獎品角度
      this.config.gifts.forEach((gift, index) => {
        this.giftsDeg[index] = {
          from: index === 0 ? 0 : this.giftsDeg[index - 1].to,
          to: index === 0 ? this.rotate : this.giftsDeg[index - 1].to + this.rotate,
          name: gift.name
        }
      })
    },
    setConfig () {
      // 將config的變數們寫入CSS變數中
      this.$el.style.setProperty('--rotateY', `${this.config.rotateY}deg`)
      this.$el.style.setProperty('--duration', `${this.config.duration}ms`)
      this.$el.style.setProperty('--fontSize', `${this.config.fontSize}px`)
      this.$el.style.setProperty('--height', `${this.config.height}px`)
      this.$el.style.setProperty('--width', `${this.config.width}px`)
      this.$el.style.setProperty('--currentDeg', `-${this.currentDeg}deg`)
    },
    autoTurn () {
      // 取得隨機角度(預設至少跑5圈)
      let randomDeg = (Math.random() * 360) + (360 * 5)
      randomDeg -= randomDeg % this.rotate // 減去餘數，避免有高低不一的狀況
      this.targetDeg = randomDeg
      // 取得隨機回彈角度
      const randomRollBackDeg = this.config.rollback
        ? Math.random() * this.config.rollback + 1
        : 1
      // 設定轉動角度
      this.$el.style.setProperty('--targetDeg', `-${this.targetDeg}deg`)
      this.$el.style.setProperty('--rollBackDeg', `${randomRollBackDeg}`)
      // 執行轉動
      this.isRunning = true
    },
    autoTurnStop () {
      // 把結束時的角度設定為當前角度
      this.currentDeg = this.targetDeg % 360
      this.$el.style.setProperty('--currentDeg', `-${this.currentDeg}deg`)
      // 顯示獎品資料(結束角度 + 單片角度/2)
      let giftName = null
      const endDeg = this.currentDeg + (this.rotate / 2)
      this.giftsDeg.forEach((gift) => {
        if (endDeg >= gift.from && endDeg <= gift.to) {
          giftName = gift.name
        }
      })
      // 宣告轉動結束
      this.isRunning = false
      this.$emit('finished', giftName) // 告訴上層已經轉完
    }
  }
}
</script>

<style lang="scss">
.gift-container {
  /* 變數區 START */
  $width: var(--width);
  $height: var(--height);
  $fontSize: var(--fontSize);
  //
  $duration: var(--duration);
  $rotateY: var(--rotateY);
  $targetDeg: var(--targetDeg);
  $currentDeg: var(--currentDeg);
  $rollBackDeg: var(--rollBackDeg);
  /* 變數區 END*/
  * {
    box-sizing: border-box;
  }
  perspective: 999999px;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  margin-right: $width;
  transform-style: preserve-3d;
  .gift {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: $width;
    height: $height;
    border: 1px solid #333;
    background-color: #fff;
    font-size: $fontSize;
    img {
      padding: 1px;
    }
  }

  &.flat {
    transform: rotateX($currentDeg);
    &.autoTurn {
      transition: $duration ease-in-out;
      transform: rotateX($targetDeg);
    }
  }

  &.three-dimension {
    transform: rotateY($rotateY) rotateX($currentDeg);
    &.autoTurn {
      transition: $duration cubic-bezier(0.1, 0, 0, $rollBackDeg);
      transform: rotateY($rotateY) rotateX($targetDeg);
    }
  }
}
</style>
