<template>
  <div class="Custom2048">
    <canvas ref="chessBoard" width="300px" height="300px"></canvas>
    <canvas ref="tiles" width="300px" height="300px"></canvas>
  </div>
</template>
<script>
const ROW = 4
const COL = 4
const BORDER_WIDTH = 12
const CELL_WIDTH = 60

const KEYDOWN = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
}

export default {
  data () {
    return {
      emptyGrids: null,
      grids: null,
      listener: getListener.call(this)
    }
  },
  methods: {
    start () {
      this.$nextTick(() => {
        let canvas = this.$refs.tiles
        let ctx = canvas.getContext('2d')
        // 清除tiles
        ctx.clearRect(0, 0, 300, 300)
        // 初始化grids数组
        this.grids = JSON.parse(JSON.stringify(this.emptyGrids))

        // 取消事件监听
        this.eventListenerSwitch('off')
        // 添加监听事件
        this.eventListenerSwitch()

        // 随机生成数字
        this.generateGridNumber(ctx)
        this.generateGridNumber(ctx)
      })
    },
    initChessBoard () {
      this.$nextTick(() => {
        let chessBoard = this.$refs.chessBoard
        let ctx = chessBoard.getContext('2d')
        ctx.fillStyle = '#bbada0'
        ctx.fillRect(0, 0, 300, 300)
        let grids = []

        for (let i = 0; i < ROW; i++) {
          grids[i] = []
          for (let j = 0; j < COL; j++) {
            grids[i][j] = null
            let rect = this.getBoundingClientRect(i, j)
            this.drawRoundingRect({ctx, rect})
          }
        }
        this.emptyGrids = grids
      })
    },
    drawGameover (ctx) {
      let gameoverText = '游戏结束'
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(0, 0, 300, 300)
      ctx.fillStyle = 'white'
      ctx.font = 'Microsoft YaHei bold 60px'
      let text = ctx.measureText(gameoverText)
      ctx.fillText(gameoverText, 150 - text.width / 2, 150)
      this.eventListenerSwitch('off')
    },
    drawRoundingRect (options) {
      // 圆角矩形...
      let {ctx, rect, radius = 6, fillStyle = '#ccc0b3'} = options
      let {left, right, top, bottom} = rect
      ctx.fillStyle = fillStyle
      ctx.beginPath()
      ctx.moveTo(left, top + radius)
      ctx.quadraticCurveTo(left, top, left + radius, top)
      ctx.lineTo(right - radius, top)
      ctx.quadraticCurveTo(right, top, right, top + radius)
      ctx.lineTo(right, bottom - radius)
      ctx.quadraticCurveTo(right, bottom, right - radius, bottom)
      ctx.lineTo(left + radius, bottom)
      ctx.quadraticCurveTo(left, bottom, left, bottom - radius)
      ctx.closePath()
      ctx.fill()
    },
    drawGridNumber (ctx, grid) {
      let {val, rect} = grid
      let {backgroundColor, color, fontSize} = this.getNumberStyle(val)

      this.drawRoundingRect({ctx, rect, fillStyle: backgroundColor})

      // draw text
      ctx.fillStyle = color
      ctx.font = `bold ${fontSize}px Microsoft YaHei`
      let text = ctx.measureText(val)
      let x = rect.left + (rect.right - rect.left) / 2 - text.width / 2
      let y = rect.bottom - (rect.bottom - rect.top) / 2 + fontSize / 3
      ctx.fillText(grid.val, x, y)
    },
    generateGridNumber (ctx) {
      if (this.nospace()) {
        this.drawGameover(ctx)
        return
      }
      while (true) {
        let row = Math.floor(Math.random() * ROW)
        let col = Math.floor(Math.random() * COL)
        if (this.grids[row][col] === null) {
          let val = Math.ceil(Math.random() * 2) * 2
          this.grids[row][col] = {
            rect: this.getBoundingClientRect(row, col),
            val
          }
          this.drawGridNumber(ctx, this.grids[row][col])

          this.$emit('changescore', val)
          break
        }
      }
    },
    getBoundingClientRect (row, col) {
      let left = (row + 1) * BORDER_WIDTH + CELL_WIDTH * row
      let top = (col + 1) * BORDER_WIDTH + CELL_WIDTH * col
      return {
        left,
        top,
        right: left + CELL_WIDTH,
        bottom: top + CELL_WIDTH,
        height: CELL_WIDTH,
        width: CELL_WIDTH
      }
    },
    getNumberStyle (number) {
      let backgroundColor = 'black'
      let color = 'white'
      let fontSize = 46
      switch (number) {
        case 2:
          backgroundColor = '#eee4da'
          color = '#776e50'
          break
        case 4:
          backgroundColor = '#ede0c8'
          color = '#776e50'
          break
        case 8:
          backgroundColor = '#f2b179'
          break
        case 16:
          backgroundColor = '#f59563'
          break
        case 32:
          backgroundColor = '#f67c5f'
          break
        case 64:
          backgroundColor = '#f65e3b'
          break
        case 128:
          backgroundColor = '#edcf72'
          fontSize = '32'
          break
        case 256:
          backgroundColor = '#edcc61'
          fontSize = '32'
          break
        case 512:
          backgroundColor = '#9c0'
          fontSize = '32'
          break
        case 1024:
          backgroundColor = '#33b5e5'
          fontSize = '20'
          break
        case 2048:
          backgroundColor = '#09c'
          fontSize = '20'
          break
      }
      return {
        backgroundColor,
        color,
        fontSize
      }
    },
    nospace () {
      for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
          if (this.grids[i][j] === null) {
            return false
          }
        }
      }
      return true
    },
    eventListenerSwitch (sw = 'on') {
      this.$nextTick(() => {
        let canvas = this.$refs.tiles
        if (sw === 'on') {
          canvas.addEventListener('touchstart', this.listener.touchstart, false)
          canvas.addEventListener('touchend', this.listener.touchend, false)
          document.addEventListener('keydown', this.listener.keydown, false)
        } else {
          canvas.removeEventListener('touchstart', this.listener.touchstart, false)
          canvas.removeEventListener('touchend', this.listener.touchend, false)
          document.removeEventListener('keydown', this.listener.keydown, false)
        }
      })
    },
    moving (direction) {
      let ctx = this.$refs.tiles.getContext('2d')
      if (direction === 'RIGHT') {
        this.moveRight()
      } else if (direction === 'LEFT') {
        this.moveLeft()
      } else if (direction === 'UP') {
        this.moveUp()
      } else {
        this.moveDown()
      }

      ctx.clearRect(0, 0, 300, 300)
      for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
          if (this.grids[i][j]) {
            this.drawGridNumber(ctx, this.grids[i][j])
          }
        }
      }
      setTimeout(() => {
        this.generateGridNumber(ctx)
      }, 200)
    },
    moveLeft () {
      for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
          let currentTile = this.grids[i][j]
          let i1 = i + 1
          while (i1 < ROW) {
            let mergeTile = this.mergeTile({currentTile, row: i, col: j}, {i: i1, j})
            if (mergeTile === true) {
              break
            } else {
              currentTile = mergeTile
              i1++
            }
          }
        }
      }
    },
    moveRight () {
      for (let i = ROW - 1; i >= 0; i--) {
        for (let j = 0; j < COL; j++) {
          let currentTile = this.grids[i][j]
          let i1 = i - 1
          while (i1 >= 0) {
            let mergeTile = this.mergeTile({currentTile, row: i, col: j}, {i: i1, j})
            if (mergeTile === true) {
              break
            } else {
              currentTile = mergeTile
              i1--
            }
          }
        }
      }
    },
    moveUp () {
      for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
          let currentTile = this.grids[i][j]
          let j1 = j + 1
          while (j1 < COL) {
            let mergeTile = this.mergeTile({currentTile, row: i, col: j}, {i, j: j1})
            if (mergeTile === true) {
              break
            } else {
              currentTile = mergeTile
              j1++
            }
          }
        }
      }
    },
    moveDown () {
      for (let i = 0; i < ROW; i++) {
        for (let j = COL - 1; j >= 0; j--) {
          let currentTile = this.grids[i][j]
          let j1 = j - 1
          while (j1 >= 0) {
            let mergeTile = this.mergeTile({currentTile, row: i, col: j}, {i, j: j1})
            if (mergeTile === true) {
              break
            } else {
              currentTile = mergeTile
              j1--
            }
          }
        }
      }
    },
    mergeTile (current, neighbor) {
      let {currentTile, row, col} = current
      let {i, j} = neighbor
      let isMerge = false
      if (currentTile) {
        if (this.grids[i][j]) {
          if (this.grids[i][j].val === currentTile.val) {
            currentTile.val = currentTile.val * 2
            this.grids[i][j] = null
          }
          isMerge = true
        }
      } else if (this.grids[i][j]) {
        currentTile = this.grids[i][j]
        this.grids[i][j] = null
      }
      if (currentTile) {
        this.grids[row][col] = {
          val: currentTile.val,
          rect: this.getBoundingClientRect(row, col)
        }
      }
      if (isMerge) {
        return true
      }
      return currentTile
    }
  },
  mounted () {
    this.initChessBoard()
    this.$on('movingtiles', this.moving)

    // 开始游戏
    this.start()
  }
}

function getListener () {
  let startX, startY
  return {
    touchstart: (e) => {
      // 防止滑动时，移动端页面上下抖动
      e.preventDefault()
      startX = e.touches[0].pageX
      startY = e.touches[0].pageY
    },
    touchend: (e) => {
      e.preventDefault()

      let direction = null
      let endX = e.changedTouches[0].pageX
      let endY = e.changedTouches[0].pageY
      let horizontal = endX - startX
      let vertical = endY - startY
      // 当touchend坐标偏移小于5像素时，不触发movingtiles事件。
      if (Math.abs(horizontal) <= 5 && Math.abs(vertical) <= 5) {
        return
      }
      if (Math.abs(horizontal) > Math.abs(vertical)) {
        if (horizontal > 0) {
          direction = 'RIGHT'
        } else if (horizontal < 0) {
          direction = 'LEFT'
        }
      } else if (Math.abs(horizontal) < Math.abs(vertical)) {
        if (vertical > 0) {
          direction = 'DOWN'
        } else if (vertical < 0) {
          direction = 'UP'
        }
      }
      this.$emit('movingtiles', direction)
    },
    keydown: (e) => {
      switch (e.keyCode) {
        case KEYDOWN.UP:
          this.$emit('movingtiles', 'UP')
          break
        case KEYDOWN.RIGHT:
          this.$emit('movingtiles', 'RIGHT')
          break
        case KEYDOWN.DOWN:
          this.$emit('movingtiles', 'DOWN')
          break
        case KEYDOWN.LEFT:
          this.$emit('movingtiles', 'LEFT')
          break
      }
    }
  }
}
</script>
<style lang="less">
  .Custom2048 {
    canvas {
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      display: block;
      border-radius: 6px;
    }
  }
</style>
