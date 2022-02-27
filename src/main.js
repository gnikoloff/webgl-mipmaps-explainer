import { mat4, vec3 } from 'gl-matrix'
import { Pane } from 'tweakpane'

import { createProgram, mapToRange } from './helpers'
import { makeCustomMipmapTexture } from './make-custom-mipmap-texture'
import { makeMipmapTexture } from './make-mipmap-texture'

import VERTEX_SHADER from './shader.vert'
import FRAGMENT_SHADER from './shader.frag'

import './style.css'

// prettier-ignore
const PLANE_VERTICES = new Float32Array([
   // position   uv
   1.0,  1.0,    1.0, 1.0,
  -1.0,  1.0,    0.0, 1.0,
   1.0, -1.0,    1.0, 0.0,
  -1.0, -1.0,    0.0, 0.0,
])

const MIN_FILTER_MODES = [
  { value: 0x2600, text: 'gl.NEAREST' },
  { value: 0x2601, text: 'gl.LINEAR' },
  { value: 0x2700, text: 'gl.NEAREST_MIPMAP_NEAREST' },
  { value: 0x2701, text: 'gl.LINEAR_MIPMAP_NEAREST' },
  { value: 0x2702, text: 'gl.NEAREST_MIPMAP_LINEAR' },
  { value: 0x2703, text: 'gl.LINEAR_MIPMAP_LINEAR' },
]

const SHARED_PARAMS = {
  playAnim: true,
}
const ORTHO_PLANE_PARAMS = {
  customMipmaps: false,
  shouldRender: true,
  uvScale: 1,
  mipBias: 0,
  msaa: true,
}
const PERSP_PLANE_PARAMS = {
  customMipmaps: false,
  shouldRender: true,
  useAnisotropyFiltering: true,
  uvScale: 3,
  mipBias: 0,
  msaa: true,
}

let updateRafID
let rafID
let nowTime = 0
let oldTime = 0
let elapsedTime = 0

const $canvas = document.getElementById('c')

/** @type {WebGL2RenderingContext} */
const gl = $canvas.getContext('webgl2', { antialias: true })
gl.anisotropyExtension =
  gl.getExtension('EXT_texture_filter_anisotropic') ||
  gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
  gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
gl.maxAnisotropy = gl.anisotropyExtension
  ? gl.getParameter(gl.anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
  : 1

const pane = new Pane()
pane.element.parentNode.style.setProperty('width', '450px')
pane.element.parentNode.style.setProperty('max-width', '98%')

pane
  .addInput(SHARED_PARAMS, 'playAnim', {
    label: 'Play Animation',
  })
  .on('change', ({ value }) => {
    nowTime = performance.now() / 1000
    oldTime = performance.now() / 1000
    if (value) {
      updateRafID = requestAnimationFrame(updateFrame)
    } else {
      cancelAnimationFrame(updateRafID)
    }
  })
pane
  .addButton({
    title: 'Disable All Optimisations',
  })
  .on('click', () => {
    ORTHO_PLANE_PARAMS.msaa = false
    orthoPlaneMinFilterChooser.value = gl.LINEAR

    PERSP_PLANE_PARAMS.msaa = false
    PERSP_PLANE_PARAMS.useAnisotropyFiltering = false
    perspPlaneMinFilterChooser.value = gl.LINEAR

    pane.refresh()
  })
pane
  .addButton({
    title: 'Enable All Optimisations',
  })
  .on('click', () => {
    ORTHO_PLANE_PARAMS.msaa = true
    orthoPlaneMinFilterChooser.value = gl.LINEAR_MIPMAP_LINEAR

    PERSP_PLANE_PARAMS.msaa = true
    PERSP_PLANE_PARAMS.useAnisotropyFiltering = true
    perspPlaneMinFilterChooser.value = gl.LINEAR_MIPMAP_LINEAR

    pane.refresh()
  })
pane.addSeparator()
const orthoPlaneFolder = pane.addFolder({
  title: 'Orthographic Plane',
})
orthoPlaneFolder.addInput(ORTHO_PLANE_PARAMS, 'shouldRender', {
  label: 'Should Render',
})
orthoPlaneFolder.addInput(ORTHO_PLANE_PARAMS, 'customMipmaps', {
  label: 'Debug Mipmaps',
})
const orthoPlaneMinFilterChooser = orthoPlaneFolder.addBlade({
  view: 'list',
  label: 'Min Filter Mode',
  options: MIN_FILTER_MODES,
  value: 0x2703, // gl.LINEAR_MIPMAP_LINEAR
})
orthoPlaneMinFilterChooser.on('change', ({ value }) => {
  gl.bindTexture(gl.TEXTURE_2D, orthoAutoMipmapTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, value)

  gl.bindTexture(gl.TEXTURE_2D, orthoCustomMipmapTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, value)
})
orthoPlaneFolder
  .addInput(ORTHO_PLANE_PARAMS, 'uvScale', {
    label: 'UV Scale',
    min: 1,
    max: 10,
    step: 0.5,
  })
  .on('change', ({ value }) => {
    gl.useProgram(orthoPlaneState.program)
    gl.uniform1f(orthoPlaneState.uniforms.uUVScale, value)
  })
orthoPlaneFolder
  .addInput(ORTHO_PLANE_PARAMS, 'mipBias', {
    label: 'Mip Bias',
    min: 0,
    max: 10,
    step: 0.025,
  })
  .on('change', ({ value }) => {
    gl.useProgram(orthoPlaneState.program)
    gl.uniform1f(orthoPlaneState.uniforms.uMipBias, value)
  })
orthoPlaneFolder
  .addInput(ORTHO_PLANE_PARAMS, 'msaa', {
    label: 'Multi Sample Anti-Aliasing',
  })
  .on('change', ({ value }) => {
    gl.useProgram(orthoPlaneState.program)
    gl.uniform1f(orthoPlaneState.uniforms.uMSAAMixFactor, value ? 1 : 0)
  })

const perpPlaneFolder = pane.addFolder({
  title: 'Perspective Plane',
})
perpPlaneFolder.addInput(PERSP_PLANE_PARAMS, 'shouldRender', {
  label: 'Should Render',
})
perpPlaneFolder.addInput(PERSP_PLANE_PARAMS, 'customMipmaps', {
  label: 'Debug Mipmaps',
})
const perspPlaneMinFilterChooser = perpPlaneFolder.addBlade({
  view: 'list',
  label: 'Min Filter Mode',
  options: MIN_FILTER_MODES,
  value: 0x2703, // gl.LINEAR_MIPMAP_LINEAR
})
perspPlaneMinFilterChooser.on('change', ({ value }) => {
  gl.bindTexture(gl.TEXTURE_2D, perspAutoMipmapTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, value)

  gl.bindTexture(gl.TEXTURE_2D, perspCustomMipmapTexture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, value)
})
perpPlaneFolder
  .addInput(PERSP_PLANE_PARAMS, 'uvScale', {
    label: 'UV Scale',
    min: 1,
    max: 50,
    step: 0.5,
  })
  .on('change', ({ value }) => {
    gl.useProgram(perspPlaneState.program)
    gl.uniform1f(perspPlaneState.uniforms.uUVScale, value)
  })
perpPlaneFolder
  .addInput(PERSP_PLANE_PARAMS, 'mipBias', {
    label: 'Mip Bias',
    min: 0,
    max: 10,
    step: 0.025,
  })
  .on('change', ({ value }) => {
    gl.useProgram(perspPlaneState.program)
    gl.uniform1f(perspPlaneState.uniforms.uMipBias, value)
  })
if (gl.maxAnisotropy > 1) {
  perpPlaneFolder
    .addInput(PERSP_PLANE_PARAMS, 'useAnisotropyFiltering', {
      label: `Turn on Anisotropy Filtering (${gl.maxAnisotropy}x)`,
    })
    .on('change', ({ value }) => {
      gl.texParameterf(
        gl.TEXTURE_2D,
        gl.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,
        value ? gl.maxAnisotropy : 1,
      )
    })
}
perpPlaneFolder
  .addInput(PERSP_PLANE_PARAMS, 'msaa', {
    label: 'Multi Sample Anti-Aliasing',
  })
  .on('change', ({ value }) => {
    gl.useProgram(perspPlaneState.program)
    gl.uniform1f(perspPlaneState.uniforms.uMSAAMixFactor, value ? 1 : 0)
  })

const orthoAutoMipmapTexture = makeMipmapTexture(gl)
const orthoCustomMipmapTexture = makeCustomMipmapTexture(gl)

const perspAutoMipmapTexture = makeMipmapTexture(gl)
const perspCustomMipmapTexture = makeCustomMipmapTexture(gl)

const orthoPlaneState = {}
const perspPlaneState = {}

// create and setup ortho plane
{
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const aUV = gl.getAttribLocation(program, 'aUV')

  const vao = gl.createVertexArray()

  const interleavedBuffer = gl.createBuffer()

  gl.bindVertexArray(vao)

  gl.bindBuffer(gl.ARRAY_BUFFER, interleavedBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, PLANE_VERTICES, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(
    aPosition,
    2,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT,
  )

  gl.enableVertexAttribArray(aUV)
  gl.vertexAttribPointer(
    aUV,
    2,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT,
  )

  gl.bindVertexArray(null)

  const projectionMatrix = mat4.create()
  mat4.ortho(projectionMatrix, -1, 1, 1, -1, 0.1, 30)

  const eyePos = vec3.fromValues(0, 0, 1)
  const lookAt = vec3.fromValues(0, 0, 0)
  const up = vec3.fromValues(0, 1, 0)
  const viewMatrix = mat4.create()
  mat4.lookAt(viewMatrix, eyePos, lookAt, up)

  const projectionViewMatrix = mat4.create()
  mat4.mul(projectionViewMatrix, projectionMatrix, viewMatrix)

  const modelMatrix = mat4.create()

  const uProjectionViewMatrix = gl.getUniformLocation(
    program,
    'uProjectionViewMatrix',
  )
  const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix')
  const uTexture = gl.getUniformLocation(program, 'uTexture')
  const uUVScale = gl.getUniformLocation(program, 'uUVScale')
  const uTexOffset = gl.getUniformLocation(program, 'uTexOffset')
  const uMipBias = gl.getUniformLocation(program, 'uMipBias')
  const uMSAAMixFactor = gl.getUniformLocation(program, 'uMSAAMixFactor')

  gl.useProgram(program)

  gl.uniformMatrix4fv(uProjectionViewMatrix, false, projectionViewMatrix)
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix)
  gl.uniform1i(uTexture, 0)
  gl.uniform1f(uUVScale, ORTHO_PLANE_PARAMS.uvScale)
  gl.uniform2f(uTexOffset, 0, 0)
  gl.uniform1f(uMipBias, 0)
  gl.uniform1f(uMSAAMixFactor, 1)

  gl.useProgram(null)

  orthoPlaneState.program = program
  orthoPlaneState.vao = vao
  orthoPlaneState.uniforms = {
    uProjectionViewMatrix,
    uModelMatrix,
    uTexture,
    uUVScale,
    uTexOffset,
    uMipBias,
    uMSAAMixFactor,
  }
  orthoPlaneState.matrix = {
    projectionViewMatrix,
    modelMatrix,
  }
}

// create and setup perspective plane
{
  const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const aUV = gl.getAttribLocation(program, 'aUV')

  const vao = gl.createVertexArray()

  const interleavedBuffer = gl.createBuffer()

  gl.bindVertexArray(vao)

  gl.bindBuffer(gl.ARRAY_BUFFER, interleavedBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, PLANE_VERTICES, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(
    aPosition,
    2,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    0 * Float32Array.BYTES_PER_ELEMENT,
  )

  gl.enableVertexAttribArray(aUV)
  gl.vertexAttribPointer(
    aUV,
    2,
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT,
  )

  gl.bindVertexArray(null)

  const projectionMatrix = mat4.create()
  mat4.perspective(
    projectionMatrix,
    (45 * Math.PI) / 180,
    innerWidth / innerHeight,
    0.1,
    30,
  )

  const eyePos = vec3.fromValues(0, -3, 0.5)
  const lookAt = vec3.fromValues(0, 0, 0)
  const up = vec3.fromValues(0, 1, 0)
  const viewMatrix = mat4.create()
  mat4.lookAt(viewMatrix, eyePos, lookAt, up)

  const projectionViewMatrix = mat4.create()
  mat4.mul(projectionViewMatrix, projectionMatrix, viewMatrix)

  const modelMatrix = mat4.create()
  mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(3, 3, 1))

  const uProjectionViewMatrix = gl.getUniformLocation(
    program,
    'uProjectionViewMatrix',
  )
  const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix')
  const uTexture = gl.getUniformLocation(program, 'uTexture')
  const uUVScale = gl.getUniformLocation(program, 'uUVScale')
  const uTexOffset = gl.getUniformLocation(program, 'uTexOffset')
  const uMipBias = gl.getUniformLocation(program, 'uMipBias')
  const uMSAAMixFactor = gl.getUniformLocation(program, 'uMSAAMixFactor')

  gl.useProgram(program)

  gl.uniformMatrix4fv(uProjectionViewMatrix, false, projectionViewMatrix)
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix)
  gl.uniform1i(uTexture, 0)
  gl.uniform1f(uUVScale, PERSP_PLANE_PARAMS.uvScale)
  gl.uniform2f(uTexOffset, 0, 0)
  gl.uniform1f(uMipBias, 0)
  gl.uniform1f(uMSAAMixFactor, 1)

  gl.useProgram(null)

  perspPlaneState.program = program
  perspPlaneState.vao = vao
  perspPlaneState.uniforms = {
    uProjectionViewMatrix,
    uModelMatrix,
    uTexture,
    uUVScale,
    uTexOffset,
    uMipBias,
    uMSAAMixFactor,
  }
  perspPlaneState.matrix = {
    projectionViewMatrix,
    modelMatrix,
  }
  perspPlaneState.texOffsetY = 0
}

sizeCanvas()
addEventListener('resize', sizeCanvas)
updateRafID = requestAnimationFrame(updateFrame)
rafID = requestAnimationFrame(renderFrame)

function updateFrame() {
  updateRafID = requestAnimationFrame(updateFrame)

  nowTime = performance.now() / 1000
  const dt = nowTime - oldTime
  oldTime = nowTime

  elapsedTime += dt

  // lifted from https://stackoverflow.com/a/3018582
  const pulse = (1 + Math.sin(Math.PI * 2 * elapsedTime * 0.1)) / 2

  if (SHARED_PARAMS.playAnim) {
    const rotation = mapToRange(pulse, 0, 1, -Math.PI * 0.25, 0)
    const scale = mapToRange(pulse, 0, 1, 0.025, 1)

    mat4.identity(orthoPlaneState.matrix.modelMatrix)
    mat4.rotateZ(
      orthoPlaneState.matrix.modelMatrix,
      orthoPlaneState.matrix.modelMatrix,
      rotation,
    )

    mat4.scale(
      orthoPlaneState.matrix.modelMatrix,
      orthoPlaneState.matrix.modelMatrix,
      vec3.fromValues(scale, scale, 1),
    )

    perspPlaneState.texOffsetY = elapsedTime * 0.1
  }
}

function renderFrame() {
  rafID = requestAnimationFrame(renderFrame)

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(0, 0, 0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // draw perspective floor plane
  if (PERSP_PLANE_PARAMS.shouldRender) {
    gl.bindVertexArray(perspPlaneState.vao)

    gl.useProgram(perspPlaneState.program)

    if (SHARED_PARAMS.playAnim) {
      gl.uniform2f(
        perspPlaneState.uniforms.uTexOffset,
        0,
        perspPlaneState.texOffsetY,
      )
    }

    gl.uniformMatrix4fv(
      perspPlaneState.uniforms.uModelMatrix,
      false,
      perspPlaneState.matrix.modelMatrix,
    )

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(
      gl.TEXTURE_2D,
      PERSP_PLANE_PARAMS.customMipmaps
        ? perspCustomMipmapTexture
        : perspAutoMipmapTexture,
    )

    gl.bindVertexArray(perspPlaneState.vao)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  if (ORTHO_PLANE_PARAMS.shouldRender) {
    gl.useProgram(orthoPlaneState.program)
    gl.uniformMatrix4fv(
      orthoPlaneState.uniforms.uModelMatrix,
      false,
      orthoPlaneState.matrix.modelMatrix,
    )

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(
      gl.TEXTURE_2D,
      ORTHO_PLANE_PARAMS.customMipmaps
        ? orthoCustomMipmapTexture
        : orthoAutoMipmapTexture,
    )

    gl.bindVertexArray(orthoPlaneState.vao)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}

function sizeCanvas() {
  $canvas.width = innerWidth * devicePixelRatio
  $canvas.height = innerHeight * devicePixelRatio
  $canvas.style.setProperty('width', `${innerWidth}px`)
  $canvas.style.setProperty('height', `${innerHeight}px`)
}
