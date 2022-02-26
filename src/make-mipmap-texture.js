const IDEAL_TEXTURE_WIDTH = innerWidth
const IDEAL_TEXTURE_HEIGHT = innerHeight

export const makeMipmapTexture = (
  gl,
  width = IDEAL_TEXTURE_WIDTH,
  height = IDEAL_TEXTURE_HEIGHT,
) => {
  width = Math.min(width, gl.MAX_TEXTURE_SIZE)
  height = Math.min(height, gl.MAX_TEXTURE_SIZE)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)

  const refLineWidth = 3
  const widthDelta = width / innerWidth
  const lineWidth = refLineWidth * widthDelta

  ctx.strokeStyle = '#fff'
  ctx.lineWidth = lineWidth

  const gridCountX = 5
  const gridCountY = 5

  const stepX = width / gridCountX
  const stepY = height / gridCountY

  ctx.strokeRect(0, 0, width, height)

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

  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    width,
    height,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    canvas,
  )

  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

  gl.generateMipmap(gl.TEXTURE_2D)

  return texture
}
