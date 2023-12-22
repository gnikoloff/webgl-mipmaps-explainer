import{t as te,c as P,o as re,f as U,l as w,m as W,p as oe,s as H,i as ne,r as ae}from"./vendor.94a1ba37.js";const ie=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerpolicy&&(n.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?n.credentials="include":r.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}};ie();const se=(t,o,i)=>Math.min(Math.max(t,o),i),C=(t,o,i,a,r)=>{const n=(t-o)*(r-a)/(i-o)+a;return se(n,a,r)},Y=(t,o,i)=>{const a=t.createShader(o);if(t.shaderSource(a,i),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS))return a;const r=`
    Error in ${o===t.VERTEX_SHADER?"Vertex":"Fragment"} shader:
    ${t.getShaderInfoLog(a)}
  `;throw t.deleteShader(a),new Error(r)},k=(t,o,i)=>{const a=Y(t,t.VERTEX_SHADER,o),r=Y(t,t.FRAGMENT_SHADER,i),n=t.createProgram();if(t.attachShader(n,a),t.attachShader(n,r),t.linkProgram(n),t.detachShader(n,a),t.deleteShader(a),t.detachShader(n,r),t.deleteShader(r),t.getProgramParameter(n,t.LINK_STATUS))return n;const s=new Error(`Error linking program: ${t.getProgramInfoLog(n)}`);throw t.deleteProgram(n),s},ce=innerWidth,ue=innerHeight,fe=["#f39c12","#2980b9","#27ae60","#d35400","#7f8c8d","#bdc3c7","#1abc9c","red","blue","green"],me=(t,o,i)=>{const a=document.createElement("canvas"),r=a.getContext("2d");a.width=t*devicePixelRatio,a.height=o*devicePixelRatio,r.fillStyle="#000",r.fillRect(0,0,t,o);const n=t/innerWidth,s=o/innerHeight,_=4*n,E=800,x=innerHeight<innerWidth?E*n:E*s;r.strokeStyle="#fff",r.lineWidth=_;const d=5,T=5,f=t/d,m=o/T;r.strokeRect(0,0,t,o),r.textAlign="center",r.textBaseline="middle",r.font=`${x}px sans-serif`,r.fillStyle=fe[i];for(let l=1;l<d;l++){const p=l*f;r.beginPath(),r.moveTo(p,0),r.lineTo(p,o),r.stroke()}for(let l=1;l<T;l++){const p=l*m;r.beginPath(),r.moveTo(0,p),r.lineTo(t,p),r.stroke()}return r.fillText(i,t/2,o/2),a},$=(t,o=ce,i=ue)=>{o=Math.min(o,t.MAX_TEXTURE_SIZE),i=Math.min(i,t.MAX_TEXTURE_SIZE);const a=t.createTexture();t.bindTexture(t.TEXTURE_2D,a);let r=o,n=i,s=0;for(;r>=2||n>=2;){r=o*Math.pow(.5,s),n=i*Math.pow(.5,s),r=r<1?Math.ceil(r):r,n=n<1?Math.ceil(n):n;const R=me(r,n,s);t.texImage2D(t.TEXTURE_2D,s,t.RGB,r,n,0,t.RGB,t.UNSIGNED_BYTE,R),s++}return t.texParameterf(t.TEXTURE_2D,t.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t.maxAnisotropy),t.bindTexture(t.TEXTURE_2D,null),a},le=innerWidth,de=innerHeight,G=(t,o=le,i=de)=>{o=Math.min(o,t.MAX_TEXTURE_SIZE),i=Math.min(i,t.MAX_TEXTURE_SIZE);const a=document.createElement("canvas"),r=a.getContext("2d");a.width=o,a.height=i,r.fillStyle="#000",r.fillRect(0,0,o,i);const n=4,s=o/innerWidth,R=n*s;r.strokeStyle="#fff",r.lineWidth=R;const _=5,E=5,x=o/_,d=i/E;r.strokeRect(0,0,o,i);for(let f=1;f<_;f++){const m=f*x;r.beginPath(),r.moveTo(m,0),r.lineTo(m,i),r.stroke()}for(let f=1;f<E;f++){const m=f*d;r.beginPath(),r.moveTo(0,m),r.lineTo(o,m),r.stroke()}const T=t.createTexture();return t.bindTexture(t.TEXTURE_2D,T),t.texImage2D(t.TEXTURE_2D,0,t.RGB,o,i,0,t.RGB,t.UNSIGNED_BYTE,a),t.texParameterf(t.TEXTURE_2D,t.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t.maxAnisotropy),t.generateMipmap(t.TEXTURE_2D),t.bindTexture(t.TEXTURE_2D,null),T};var j=`#version 300 es

uniform mat4 uProjectionViewMatrix;
uniform mat4 uModelMatrix;

in vec4 aPosition;
in vec2 aUV;

out vec2 vUV;

void main () {
  gl_Position = uProjectionViewMatrix * uModelMatrix * aPosition;
  vUV = aUV;
}`,q=`#version 300 es
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

  
  
  
  
  
  
  
  
  
  

  
  vec2 dx = dFdx(vUV); 
  vec2 dy = dFdy(vUV); 
  
  
  vec2 offsetUV = vec2(0.0);
  
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
}`;const Z=new Float32Array([1,1,1,1,-1,1,0,1,1,-1,1,0,-1,-1,0,0]),z=[{value:9728,text:"gl.NEAREST"},{value:9729,text:"gl.LINEAR"},{value:9984,text:"gl.NEAREST_MIPMAP_NEAREST"},{value:9985,text:"gl.LINEAR_MIPMAP_NEAREST"},{value:9986,text:"gl.NEAREST_MIPMAP_LINEAR"},{value:9987,text:"gl.LINEAR_MIPMAP_LINEAR"}],O={playAnim:!0},M={customMipmaps:!0,shouldRender:!0,uvScale:1,mipBias:0,msaa:!0},A={customMipmaps:!1,shouldRender:!0,useAnisotropyFiltering:!0,uvScale:2.5,mipBias:.5,msaa:!0};let g,X=0,F=0,L=0;const I=document.getElementById("c"),e=I.getContext("webgl2",{antialias:!1});e.anisotropyExtension=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");e.maxAnisotropy=e.anisotropyExtension?e.getParameter(e.anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT):1;const b=new te.exports.Pane;b.element.parentNode.style.setProperty("width","450px");b.element.parentNode.style.setProperty("max-width","98%");b.addInput(O,"playAnim",{label:"Play Animation"}).on("change",({value:t})=>{X=performance.now()/1e3,F=performance.now()/1e3,t?g=requestAnimationFrame(N):cancelAnimationFrame(g)});const v=b.addFolder({title:"Orthographic Plane",expanded:innerWidth>800});v.addInput(M,"shouldRender",{label:"Should Render"});v.addInput(M,"customMipmaps",{label:"Debug Mipmaps"});const Ee=v.addBlade({view:"list",label:"Min Filter Mode",options:z,value:9987});Ee.on("change",({value:t})=>{e.bindTexture(e.TEXTURE_2D,K),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t),e.bindTexture(e.TEXTURE_2D,J),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t)});v.addInput(M,"uvScale",{label:"UV Scale",min:1,max:10,step:.5}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uUVScale,t)});v.addInput(M,"mipBias",{label:"Mip Bias",min:0,max:10,step:.025}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uMipBias,t)});v.addInput(M,"msaa",{label:"Multi Sample Anti-Aliasing"}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uMSAAMixFactor,t?1:0)});const S=b.addFolder({title:"Perspective Plane",expanded:innerWidth>800});S.addInput(A,"shouldRender",{label:"Should Render"});S.addInput(A,"customMipmaps",{label:"Debug Mipmaps"});const xe=S.addBlade({view:"list",label:"Min Filter Mode",options:z,value:9987});xe.on("change",({value:t})=>{e.bindTexture(e.TEXTURE_2D,B),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t),e.bindTexture(e.TEXTURE_2D,D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t)});S.addInput(A,"uvScale",{label:"UV Scale",min:1,max:50,step:.5}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uUVScale,t)});S.addInput(A,"mipBias",{label:"Mip Bias",min:0,max:10,step:.025}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uMipBias,t)});e.maxAnisotropy>1&&S.addInput(A,"useAnisotropyFiltering",{label:`Turn on Anisotropy Filtering (${e.maxAnisotropy}x)`}).on("change",({value:t})=>{e.bindTexture(e.TEXTURE_2D,B),e.texParameterf(e.TEXTURE_2D,e.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t?e.maxAnisotropy:1),e.bindTexture(e.TEXTURE_2D,D),e.texParameterf(e.TEXTURE_2D,e.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t?e.maxAnisotropy:1)});S.addInput(A,"msaa",{label:"Multi Sample Anti-Aliasing"}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uMSAAMixFactor,t?1:0)});const K=G(e),J=$(e),B=G(e),D=$(e),u={},c={};{const t=k(e,j,q),o=e.getAttribLocation(t,"aPosition"),i=e.getAttribLocation(t,"aUV"),a=e.createVertexArray(),r=e.createBuffer();e.bindVertexArray(a),e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,Z,e.STATIC_DRAW),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,0*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.bindVertexArray(null);const n=P();re(n,-1,1,1,-1,.1,30);const s=U(0,0,1),R=U(0,0,0),_=U(0,1,0),E=P();w(E,s,R,_);const x=P();W(x,n,E);const d=P(),T=e.getUniformLocation(t,"uProjectionViewMatrix"),f=e.getUniformLocation(t,"uModelMatrix"),m=e.getUniformLocation(t,"uTexture"),l=e.getUniformLocation(t,"uUVScale"),p=e.getUniformLocation(t,"uTexOffset"),y=e.getUniformLocation(t,"uMipBias"),h=e.getUniformLocation(t,"uMSAAMixFactor"),V=e.getUniformLocation(t,"uMSAAUVOffsets");e.useProgram(t),e.uniformMatrix4fv(T,!1,x),e.uniformMatrix4fv(f,!1,d),e.uniform1i(m,0),e.uniform1f(l,M.uvScale),e.uniform2f(p,0,0),e.uniform1f(y,0),e.uniform1f(h,M.msa?1:0),e.uniform2f(V,.125*(devicePixelRatio>1?devicePixelRatio*1.5:1),.375*(devicePixelRatio>1?devicePixelRatio*1.5:1)),e.useProgram(null),u.program=t,u.vao=a,u.uniforms={uProjectionViewMatrix:T,uModelMatrix:f,uTexture:m,uUVScale:l,uTexOffset:p,uMipBias:y,uMSAAMixFactor:h,uMSAAUVOffsets:V},u.matrix={projectionViewMatrix:x,modelMatrix:d}}{const t=k(e,j,q),o=e.getAttribLocation(t,"aPosition"),i=e.getAttribLocation(t,"aUV"),a=e.createVertexArray(),r=e.createBuffer();e.bindVertexArray(a),e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,Z,e.STATIC_DRAW),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,0*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.bindVertexArray(null);const n=P();oe(n,45*Math.PI/180,innerWidth/innerHeight,.1,30);const s=U(0,-3,.5),R=U(0,0,0),_=U(0,1,0),E=P();w(E,s,R,_);const x=P();W(x,n,E);const d=P();H(d,d,U(3,3,1));const T=e.getUniformLocation(t,"uProjectionViewMatrix"),f=e.getUniformLocation(t,"uModelMatrix"),m=e.getUniformLocation(t,"uTexture"),l=e.getUniformLocation(t,"uUVScale"),p=e.getUniformLocation(t,"uTexOffset"),y=e.getUniformLocation(t,"uMipBias"),h=e.getUniformLocation(t,"uMSAAMixFactor"),V=e.getUniformLocation(t,"uMSAAUVOffsets");e.useProgram(t),e.uniformMatrix4fv(T,!1,x),e.uniformMatrix4fv(f,!1,d),e.uniform1i(m,0),e.uniform1f(l,A.uvScale),e.uniform2f(p,0,0),e.uniform1f(y,A.mipBias),e.uniform1f(h,A.msaa?1:0),e.uniform2f(V,.125*(devicePixelRatio>1?devicePixelRatio*1.5:1),.375*(devicePixelRatio>1?devicePixelRatio*1.5:1)),e.useProgram(null),c.program=t,c.vao=a,c.uniforms={uProjectionViewMatrix:T,uModelMatrix:f,uTexture:m,uUVScale:l,uTexOffset:p,uMipBias:y,uMSAAMixFactor:h,uMSAAUVOffsets:V},c.matrix={projectionViewMatrix:x,modelMatrix:d},c.texOffsetY=0}ee();addEventListener("resize",ee);g=requestAnimationFrame(N);requestAnimationFrame(Q);function N(){g=requestAnimationFrame(N),X=performance.now()/1e3;const t=X-F;F=X,L+=t;const o=(1+Math.sin(Math.PI*2*L*.1))/2;if(O.playAnim){const i=C(o,0,1,-Math.PI*.25,0),a=C(o,0,1,.025,1);ne(u.matrix.modelMatrix),ae(u.matrix.modelMatrix,u.matrix.modelMatrix,i),H(u.matrix.modelMatrix,u.matrix.modelMatrix,U(a,a,1)),c.texOffsetY=L*.1}}function Q(){requestAnimationFrame(Q),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),A.shouldRender&&(e.bindVertexArray(c.vao),e.useProgram(c.program),O.playAnim&&e.uniform2f(c.uniforms.uTexOffset,0,c.texOffsetY),e.uniformMatrix4fv(c.uniforms.uModelMatrix,!1,c.matrix.modelMatrix),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,A.customMipmaps?D:B),e.bindVertexArray(c.vao),e.drawArrays(e.TRIANGLE_STRIP,0,4)),M.shouldRender&&(e.useProgram(u.program),e.uniformMatrix4fv(u.uniforms.uModelMatrix,!1,u.matrix.modelMatrix),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,M.customMipmaps?J:K),e.bindVertexArray(u.vao),e.drawArrays(e.TRIANGLE_STRIP,0,4))}function ee(){I.width=innerWidth*devicePixelRatio,I.height=innerHeight*devicePixelRatio,I.style.setProperty("width",`${innerWidth}px`),I.style.setProperty("height",`${innerHeight}px`)}
