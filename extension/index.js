module.exports = nodecg => {
  'use strict'

  const colours = [
    [0, 0, 25, 15],
    [8, 29, 88, 0],
    [34, 94, 168, 0],
    [65, 182, 196, 50],
    [199, 233, 180, 150],
    [255, 255, 217, 200],
    [255, 255, 255, 255]
  ]
  const numberOfRows = 108
  const pixelSize = 10
  const pngWidth = 500
  const pngDepth = 256
  const pngHeight = numberOfRows
  const PNGlib = require('pnglib')
  const png = new PNGlib(pngWidth, pngHeight, pngDepth) // eslint-disable-line no-undef

  for (let rowIndex = 0; rowIndex < pngHeight; rowIndex++) {
    const rowColours = []
    let colourBlockLength = 0
    let currentColour
    for (let pixel = 0; pixel < pngWidth; pixel++) {
      if (rowColours.length === pngWidth) {
        break
      }
      if (colourBlockLength === 0) {
        colourBlockLength = pixelSize * Math.ceil(Math.random() * 3)
        currentColour = undefined
      }
      if (currentColour === undefined) {
        currentColour = colourFromPercent(rowIndex / numberOfRows * 100)
      }
      rowColours.push(currentColour)
      colourBlockLength--
    }
    for (let pixelColumn = 0; pixelColumn < pngWidth; pixelColumn++) {
      if (rowColours.length !== pngWidth) {
        break
      }
      const pngIndex = png.index(pixelColumn, rowIndex)
      const colourArray = rowColours[pixelColumn]
      png.buffer[pngIndex] = png.color(colourArray[0], colourArray[1], colourArray[2])
    }
  }

  const pngBase64 = png.getBase64()
  const pngImageData = 'data:image/png;base64,' + pngBase64

  nodecg.listenFor('ready', () => {
    nodecg.sendMessage('pngGenerated', pngImageData)
  })

  function colourFromPercent (gradientProgressPercent) {
    const bucketSize = 100 / colours.length
    // Random number between -bucketSize and bucketSize
    const randomFromBucketRange = Math.random() * (bucketSize * 2) - bucketSize

    let colorPercent = gradientProgressPercent + randomFromBucketRange

    if (colorPercent > 100) {
      colorPercent = 100
    }
    if (colorPercent < 0) {
      colorPercent = 0
    }

    const colourBands = 100 / (colours.length - 1)
    return colours[Math.round(colorPercent / colourBands)]
  }
}
