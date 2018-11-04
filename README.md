# Slot Machine

![image](https://github.com/guahsu/Vue-SlotMachine/blob/master/demo.png?raw=true)  

這次又用了Vue + CSS寫一個吃角子老虎機來玩，  
很多想法繼承年初寫的[大轉盤](https://github.com/guahsu/Vue-TurnTable/)，  
主要藉由CSS 3D做獎項的主體，透過JS寫入CSS變數來更改起始與結束的旋轉角度，  
也一樣有寫成可以透過Config來調節獎項內容與樣式。
  
原始碼有附上部分程式備註，歡迎隨意修改使用，  
若有發現錯誤或更好的做法也希望能告知:D!  

## 完整版
- 連結：[https://guahsu.io/Vue-SlotMachine/dist/#/](https://guahsu.io/Vue-SlotMachine/dist/#/)  
- SourceCode：[https://github.com/guahsu/Vue-SlotMachine/tree/master/src/components](https://github.com/guahsu/Vue-SlotMachine//tree/master/src/components)  

## 基礎模式DEMO
- 連結：[https://guahsu.io/Vue-SlotMachine/dist/#/demo](https://guahsu.io/Vue-SlotMachine/dist/#/demo)  
- SourceCode：[https://github.com/guahsu/Vue-SlotMachine/tree/master/src/demo](https://github.com/guahsu/Vue-SlotMachine//tree/master/src/demo)  

## 使用方式  
可以把Components裡面的Gift單獨取出使用，方式如下：
```html
<Gift
  @finished="isFinished"
  :trigger="trigger"
  :config="config">
</Gift>
```
## 參數說明：
### trigger
觸發轉動  
範例：觸發按鈕function：將會每次按下時因date變動觸發轉動  
```javascript
turn () {
  this.trigger = new Date()
},
```
### @finished  
當旋轉完畢後會回傳結果，需使用function接住結果  
範例：當旋轉完畢後印出結果  
```javascript
isFinished (val) {
  console.log(val)
}
```
> 也可以參考基礎模式Demo中，將所有結果接回來做歷史清單

### config  
```javascript
{
  style: 'Class',    // 選填: 自定義獎項的class
  run3D: false,      // 選填: 顯示為3D模式
  rotateY: -25,      // 選填: 若開啟run3D，需填入Y軸角度
  rollback: 0.3,     // 選填：填入0.1 ~ 1 決定最後隨機回滾的最大角度(0~360)
  duration: 4000,    // 轉動時間(ms)
  fontSize: 100,     // 顯示的文字大小，影響type為text的獎項
  height: 100,       // gift的高度
  width: 200,        // gift的寬度
  gifts: [
    {        
      type: 'text',  // text || image
      name: 'hello', // 獎項名稱
      path: ''       // 圖片路徑(type為image時使用)
    }
  ]
}
```
### 簡單的使用範例：   
設置三組0~9的選項，  
透當結束時過觀察轉盤的class來判斷是否已轉完，把結果存下來。  
```html
<template>
  <div id="SlotMachine">
    <div class="container">
      <Gift
        v-for="(config, index) in configs"
        @finished="isFinished"
        :trigger="trigger"
        :config="config"
        :key="index">
      </Gift>
    </div>
    <button
      class="start"
      @click="turn"
      :disabled="disabled">
      START
    </button>
  </div>
</template>

<script>
import Gift from './Gift'
export default {
  name: 'SlotMachine',
  components: {
    Gift
  },
  data () {
    return {
      trigger: null,
      disabled: false,
      configs: [
        {
          duration: 4000,
          fontSize: 100,
          height: 100,
          width: 200,
          gifts: Array.from(new Array(10), (val, index) => { return { type: 'text', name: index } })
        },
        {
          duration: 5000,
          fontSize: 100,
          height: 100,
          width: 200,
          gifts: Array.from(new Array(10), (val, index) => { return { type: 'text', name: index } })
        },
        {
          duration: 6000,
          fontSize: 100,
          height: 100,
          width: 200,
          gifts: Array.from(new Array(10), (val, index) => { return { type: 'text', name: index } })
        }
      ],
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
      console.log(this.resultHistory)
    }
  }
}
</script>

<style lang="scss">
#SlotMachine {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .container {
    display: flex;
  }
  .start {
    position: absolute;
    bottom: 10vh;
    padding: 15px 30px;
    outline: none;
    border: none;
    border-radius: 10px;
    background-color: #4DA1FF;
    color: #ffffff;
    cursor: pointer;
    transition: 150ms;
    user-select: none;
    &:disabled {
      background-color: #ddd;
      cursor: not-allowed;
    }
  }
}
</style>
```

## TODO
加上自訂選項設置介面

## Licence
open source and released under the MIT Licence.