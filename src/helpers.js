// math
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

export const mapToRange = (current, inMin, inMax, outMin, outMax) => {
  const mapped =
    ((current - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  return clamp(mapped, outMin, outMax)
}

// gl utils
export const createShader = (gl, shaderType, shaderSource) => {
  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader
  }
  const errorMessage = `
    Error in ${shaderType === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'} shader:
    ${gl.getShaderInfoLog(shader)}
  `
  gl.deleteShader(shader)
  throw new Error(errorMessage)
}

export const createProgram = (gl, vertexShaderSource, fragmentShaderSource) => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  )

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  gl.detachShader(program, vertexShader)
  gl.deleteShader(vertexShader)
  gl.detachShader(program, fragmentShader)
  gl.deleteShader(fragmentShader)

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program
  }
  const err = new Error(
    `Error linking program: ${gl.getProgramInfoLog(program)}`,
  )
  gl.deleteProgram(program)
  throw err
}

export default createProgram
