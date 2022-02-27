

#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform float uUVScale;
uniform vec2 uTexOffset;
uniform float uMipBias;
uniform float uMSAAMixFactor;
uniform vec2 uMSAAUVOffsets;

in vec2 vUV;

out vec4 finalColor;

void main () {
  vec2 scaledOffsetedUVs = vUV * uUVScale + uTexOffset;
  finalColor = texture(uTexture, scaledOffsetedUVs, uMipBias);

  // // Ordered Grid Super-Sampling (OGSS
  // vec2 dx = dFdx(vUV) * 0.25; // horizontal offset
  // vec2 dy = dFdy(vUV) * 0.25; // vertical offset
  // // supersampled 2x2 ordered grid
  // vec4 msaaColor = vec4(0.0);
  // msaaColor += texture(uTexture, scaledOffsetedUVs + dx + dy, uMipBias);
  // msaaColor += texture(uTexture, scaledOffsetedUVs - dx + dy, uMipBias);
  // msaaColor += texture(uTexture, scaledOffsetedUVs + dx - dy, uMipBias);
  // msaaColor += texture(uTexture, scaledOffsetedUVs - dx - dy, uMipBias);
  // msaaColor *= 0.25;

  // per pixel partial derivatives
  vec2 dx = dFdx(vUV); // horizontal offset
  vec2 dy = dFdy(vUV); // vertical offset
  // rotated grid uv offsets
  // vec2 uMSAAUVOffsets = vec2(0.125 * 2.5, 0.375 * 2.5);
  vec2 offsetUV = vec2(0.0);
  // supersampled using 2x2 rotated grid
  vec4 msaaColor = vec4(0.0);
  offsetUV = scaledOffsetedUVs + uMSAAUVOffsets.x * dx + uMSAAUVOffsets.y * dy;
  msaaColor += texture(uTexture, offsetUV, uMipBias);
  offsetUV = scaledOffsetedUVs - uMSAAUVOffsets.x * dx - uMSAAUVOffsets.y * dy;
  msaaColor += texture(uTexture, offsetUV, uMipBias);
  offsetUV = scaledOffsetedUVs + uMSAAUVOffsets.y * dx - uMSAAUVOffsets.x * dy;
  msaaColor += texture(uTexture, offsetUV, uMipBias);
  offsetUV = scaledOffsetedUVs - uMSAAUVOffsets.y * dx + uMSAAUVOffsets.x * dy;
  msaaColor += texture(uTexture, offsetUV, uMipBias);
  msaaColor *= 0.25;

  finalColor = mix(finalColor, msaaColor, uMSAAMixFactor);
}
