const IDEAL_TEXTURE_WIDTH = innerWidth
const IDEAL_TEXTURE_HEIGHT = innerHeight
const MIP_COLORS = [
  '#f39c12',
  '#2980b9',
  '#27ae60',
  '#d35400',
  '#7f8c8d',
  '#bdc3c7',
  '#1abc9c',
]

const makeMipmapCanvas = (width, height, level) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  // canvas.setAttribute(
  //   'style',
  //   `
  //   max-width: 100%;
  // `,
  // )
  // document.body.appendChild(canvas)

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)

  const widthDelta = width / innerWidth
  const heightDelta = height / innerHeight

  const refLineWidth = 3
  const lineWidth = refLineWidth * widthDelta

  const refFontSize = 800
  const fontSize =
    innerHeight < innerWidth
      ? refFontSize * widthDelta
      : refFontSize * heightDelta

  ctx.strokeStyle = '#fff'
  ctx.lineWidth = lineWidth

  const gridCountX = 5
  const gridCountY = 5

  const stepX = width / gridCountX
  const stepY = height / gridCountY

  ctx.strokeRect(0, 0, width, height)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${fontSize}px Helvetica`
  ctx.fillStyle = MIP_COLORS[level]

  for (let i = 1; i < gridCountX; i++) {
    const x = i * stepX
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }

  for (let i = 1; i < gridCountY; i++) {
    const y = i * stepY
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  ctx.fillText(level, width / 2, height / 2)

  return canvas
}

export const makeCustomMipmapTexture = (
  gl,
  width = IDEAL_TEXTURE_WIDTH,
  height = IDEAL_TEXTURE_HEIGHT,
) => {
  width = Math.min(width, gl.MAX_TEXTURE_SIZE)
  height = Math.min(height, gl.MAX_TEXTURE_SIZE)

  const mipmapLevels = 5

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  let mipWidth = width
  let mipHeight = height

  let i = 0
  while (mipWidth >= 2 && mipHeight >= 2) {
    mipWidth = width * Math.pow(0.5, i)
    mipHeight = height * Math.pow(0.5, i)

    const canvas = makeMipmapCanvas(mipWidth, mipHeight, i)

    gl.texImage2D(
      gl.TEXTURE_2D,
      i,
      gl.RGB,
      mipWidth,
      mipHeight,
      0,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      canvas,
    )

    i++
  }

  return texture
}
