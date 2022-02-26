#version 300 es

uniform mat4 uProjectionViewMatrix;
uniform mat4 uModelMatrix;

in vec4 aPosition;
in vec2 aUV;

out vec2 vUV;

void main () {
  gl_Position = uProjectionViewMatrix * uModelMatrix * aPosition;
  vUV = aUV;
}
