'use strict'

const pixi = PIXI // eslint-disable-line no-undef
const AppMake = pixi.Application
const loader = pixi.Loader.shared
const Texture = pixi.Texture
const BaseTexture = pixi.BaseTexture
const TileSprite = pixi.TilingSprite
const Rect = pixi.Rectangle
const Container = pixi.Container

const width = 1920
const height = 1080

const app = new AppMake({
  width,
  height,
  transparent: true,
  antialias: true
})
const stage = app.stage

const fogSprites = []
const numberOfRows = 108
const pixelSize = 10
const pngWidth = 500
const pngHeight = numberOfRows

document.body.appendChild(app.view)

const state = shift
let fogContainer
loader.load(setup)
function setup () {
  fogContainer = new Container()

  fogContainer.zIndex = 10

  stage.addChild(fogContainer)

  nodecg.sendMessage('ready') // eslint-disable-line no-undef
  nodecg.listenFor('pngGenerated', pngImageData => { // eslint-disable-line no-undef
    const bt = new BaseTexture.from(pngImageData) // eslint-disable-line new-cap
    bt.on('update', () => {
      for (let rowIndex = 0; rowIndex < pngHeight; rowIndex++) {
        const tFrame = new Rect(
          0, rowIndex,
          pngWidth, 1
        )
        const ts = new TileSprite(new Texture(bt, tFrame), app.screen.width, pixelSize)
        fogContainer.addChild(ts)
        ts.y = rowIndex * pixelSize
        const seconds = (124 - rowIndex * (120 / numberOfRows)) / 25
        ts.mvSpeed = pngWidth / seconds / 60
        fogSprites.push(ts)
      }

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
