'use strict'

const pixi = PIXI // eslint-disable-line no-undef
const AppMake = pixi.Application
const loader = pixi.loader
const Texture = pixi.Texture
const BaseTexture = pixi.BaseTexture
const TileSprite = pixi.extras.TilingSprite
const Rect = pixi.Rectangle
const display = pixi.display
const Group = display.Group
const Layer = display.Layer

const width = 1920
const height = 1080

const app = new AppMake(width, height, {
  transparent: true,
  antialias: true
})
app.stage = new display.Stage()
const stage = app.stage

const fogSprites = []
const numberOfRows = 108
const pixelSize = 10
const pngWidth = 500
const pngHeight = numberOfRows * pixelSize

document.body.appendChild(app.view)

loader.load(setup)

const state = shift
const bgG = new Group(-1, false)
function setup () {
  stage.group.enableSort = true

  nodecg.sendMessage('ready') // eslint-disable-line no-undef
  nodecg.listenFor('pngGenerated', pngImageData => { // eslint-disable-line no-undef
    const bt = new BaseTexture.fromImage(pngImageData) // eslint-disable-line new-cap
    bt.on('update', () => {
      for (let rowIndex = 0; rowIndex < pngHeight; rowIndex += pixelSize) {
        const tFrame = new Rect(
          0, rowIndex,
          pngWidth, pixelSize
        )
        const ts = new TileSprite(new Texture(bt, tFrame), app.screen.width, pixelSize)
        stage.addChild(ts)
        ts.y = rowIndex
        const seconds = (124 - (rowIndex / pixelSize) * (120 / numberOfRows)) / 25
        ts.mvSpeed = pngWidth / seconds / 60
        ts.parentGroup = bgG
        fogSprites.push(ts)
      }

      stage.addChild(new Layer(bgG))
      app.ticker.add(delta => active(delta))
    })
  })
}

function active (delta) {
  state(delta)
}

function shift (delta) {
  fogSprites.forEach(fs => {
    fs.tilePosition.x -= fs.mvSpeed * delta
  })
}
