#version 300 es
precision highp float;

uniform sampler2D uAutoMipmapTexture;
uniform float uUVScale;
uniform vec2 uTexOffset;
uniform float uMipBias;

in vec2 vUV;

out vec4 finalColor;

void main () {
  finalColor = texture(uAutoMipmapTexture, vUV * uUVScale + uTexOffset, uMipBias);
}
