import { mat4, vec3 } from 'gl-matrix'
import createProgram, { mapToRange } from './helpers'
import './style.css'

import VERTEX_SHADER from './shader.vert'
import FRAGMENT_SHADER from './shader.frag'

// prettier-ignore
const PLANE_VERTICES = new Float32Array([
   // position   uv
   1.0,  1.0,    1.0, 1.0,
  -1.0,  1.0,    0.0, 1.0,
   1.0, -1.0,    1.0, 0.0,
  -1.0, -1.0,    0.0, 0.0,
])

let oldTime = 0

const $canvas = document.getElementById('c')

/** @type {WebGL2RenderingContext} */
const gl = $canvas.getContext('webgl2')

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
  mat4.ortho(projectionMatrix, -1, 1, -1, 1, 0.1, 30)

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

  gl.useProgram(program)

  gl.uniformMatrix4fv(uProjectionViewMatrix, false, projectionViewMatrix)
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix)

  gl.useProgram(null)

  orthoPlaneState.program = program
  orthoPlaneState.vao = vao
  orthoPlaneState.uniforms = {
    uProjectionViewMatrix,
    uModelMatrix,
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

  const eyePos = vec3.fromValues(0, -5, 2)
  const lookAt = vec3.fromValues(0, 0, 0)
  const up = vec3.fromValues(0, 1, 0)
  const viewMatrix = mat4.create()
  mat4.lookAt(viewMatrix, eyePos, lookAt, up)

  const projectionViewMatrix = mat4.create()
  mat4.mul(projectionViewMatrix, projectionMatrix, viewMatrix)

  const modelMatrix = mat4.create()
  mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(10, 3, 1))

  const uProjectionViewMatrix = gl.getUniformLocation(
    program,
    'uProjectionViewMatrix',
  )
  const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix')

  gl.useProgram(program)

  gl.uniformMatrix4fv(uProjectionViewMatrix, false, projectionViewMatrix)
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix)

  gl.useProgram(null)

  perspPlaneState.program = program
  perspPlaneState.vao = vao
  perspPlaneState.uniforms = {
    uProjectionViewMatrix,
    uModelMatrix,
  }
  perspPlaneState.matrix = {
    projectionViewMatrix,
    modelMatrix,
  }
}

sizeCanvas()
addEventListener('resize', sizeCanvas)
requestAnimationFrame(renderFrame)

function renderFrame(ts) {
  ts /= 1000
  const dt = ts - oldTime
  oldTime = ts

  requestAnimationFrame(renderFrame)

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(0.1, 0.1, 0.1, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // lifted from https://stackoverflow.com/a/3018582
  const pulse = (1 + Math.sin(Math.PI * 2 * ts * 0.1)) / 2

  // draw perspective floor plane
  {
    const rotation = mapToRange(pulse, 0, 1, 0, Math.PI * 0.25)
    const scale = mapToRange(pulse, 0, 1, 0.1, 1)

    // mat4.identity(perspPlaneState.matrix.modelMatrix)
    // mat4.rotateZ(
    //   perspPlaneState.matrix.modelMatrix,
    //   perspPlaneState.matrix.modelMatrix,
    //   rotation,
    // )

    // mat4.scale(
    //   perspPlaneState.matrix.modelMatrix,
    //   perspPlaneState.matrix.modelMatrix,
    //   vec3.fromValues(scale, scale, 1),
    // )

    // gl.useProgram(perspPlaneState.program)
    // gl.uniformMatrix4fv(
    //   perspPlaneState.uniforms.uModelMatrix,
    //   false,
    //   perspPlaneState.matrix.modelMatrix,
    // )

    gl.bindVertexArray(perspPlaneState.vao)

    gl.useProgram(perspPlaneState.program)
    gl.uniformMatrix4fv(
      perspPlaneState.uniforms.uModelMatrix,
      false,
      perspPlaneState.matrix.modelMatrix,
    )

    gl.bindVertexArray(perspPlaneState.vao)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  // draw ortho plane
  {
    const rotation = mapToRange(pulse, 0, 1, -Math.PI * 0.25, 0)
    const scale = mapToRange(pulse, 0, 1, 0.1, 1)

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

    gl.useProgram(orthoPlaneState.program)
    gl.uniformMatrix4fv(
      orthoPlaneState.uniforms.uModelMatrix,
      false,
      orthoPlaneState.matrix.modelMatrix,
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
