import{t as re,c as v,o as oe,f as S,l as Y,m as w,p as ne,s as W,i as ae,r as ie}from"./vendor.7d86c8f9.js";const se=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerpolicy&&(n.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?n.credentials="include":r.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}};se();const ue=(t,o,i)=>Math.min(Math.max(t,o),i),D=(t,o,i,a,r)=>{const n=(t-o)*(r-a)/(i-o)+a;return ue(n,a,r)},C=(t,o,i)=>{const a=t.createShader(o);if(t.shaderSource(a,i),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS))return a;const r=`
    Error in ${o===t.VERTEX_SHADER?"Vertex":"Fragment"} shader:
    ${t.getShaderInfoLog(a)}
  `;throw t.deleteShader(a),new Error(r)},H=(t,o,i)=>{const a=C(t,t.VERTEX_SHADER,o),r=C(t,t.FRAGMENT_SHADER,i),n=t.createProgram();if(t.attachShader(n,a),t.attachShader(n,r),t.linkProgram(n),t.detachShader(n,a),t.deleteShader(a),t.detachShader(n,r),t.deleteShader(r),t.getProgramParameter(n,t.LINK_STATUS))return n;const s=new Error(`Error linking program: ${t.getProgramInfoLog(n)}`);throw t.deleteProgram(n),s},ce=innerWidth,le=innerHeight,fe=["#f39c12","#2980b9","#27ae60","#d35400","#7f8c8d","#bdc3c7","#1abc9c","red","blue","green"],me=(t,o,i)=>{const a=document.createElement("canvas"),r=a.getContext("2d");a.width=t,a.height=o,r.fillStyle="#000",r.fillRect(0,0,t,o);const n=t/innerWidth,s=o/innerHeight,P=3*n,x=800,T=innerHeight<innerWidth?x*n:x*s;r.strokeStyle="#fff",r.lineWidth=P;const E=5,p=5,l=t/E,f=o/p;r.strokeRect(0,0,t,o),r.textAlign="center",r.textBaseline="middle",r.font=`${T}px Helvetica`,r.fillStyle=fe[i];for(let m=1;m<E;m++){const A=m*l;r.beginPath(),r.moveTo(A,0),r.lineTo(A,o),r.stroke()}for(let m=1;m<p;m++){const A=m*f;r.beginPath(),r.moveTo(0,A),r.lineTo(t,A),r.stroke()}return r.fillText(i,t/2,o/2),a},k=(t,o=ce,i=le)=>{o=Math.min(o,t.MAX_TEXTURE_SIZE),i=Math.min(i,t.MAX_TEXTURE_SIZE);const a=t.createTexture();t.bindTexture(t.TEXTURE_2D,a);let r=o,n=i,s=0;for(;r>=2||n>=2;){r=o*Math.pow(.5,s),n=i*Math.pow(.5,s),r=r<1?Math.ceil(r):r,n=n<1?Math.ceil(n):n;const _=me(r,n,s);t.texImage2D(t.TEXTURE_2D,s,t.RGB,r,n,0,t.RGB,t.UNSIGNED_BYTE,_),s++}return t.texParameterf(t.TEXTURE_2D,t.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t.maxAnisotropy),t.bindTexture(t.TEXTURE_2D,null),a},de=innerWidth,Ee=innerHeight,$=(t,o=de,i=Ee)=>{o=Math.min(o,t.MAX_TEXTURE_SIZE),i=Math.min(i,t.MAX_TEXTURE_SIZE);const a=document.createElement("canvas"),r=a.getContext("2d");a.width=o,a.height=i,r.fillStyle="#000",r.fillRect(0,0,o,i);const n=3,s=o/innerWidth,_=n*s;r.strokeStyle="#fff",r.lineWidth=_;const P=5,x=5,T=o/P,E=i/x;r.strokeRect(0,0,o,i);for(let l=1;l<P;l++){const f=l*T;r.beginPath(),r.moveTo(f,0),r.lineTo(f,i),r.stroke()}for(let l=1;l<x;l++){const f=l*E;r.beginPath(),r.moveTo(0,f),r.lineTo(o,f),r.stroke()}const p=t.createTexture();return t.bindTexture(t.TEXTURE_2D,p),t.texImage2D(t.TEXTURE_2D,0,t.RGB,o,i,0,t.RGB,t.UNSIGNED_BYTE,a),t.texParameterf(t.TEXTURE_2D,t.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t.maxAnisotropy),t.generateMipmap(t.TEXTURE_2D),t.bindTexture(t.TEXTURE_2D,null),p};var G=`#version 300 es

uniform mat4 uProjectionViewMatrix;
uniform mat4 uModelMatrix;

in vec4 aPosition;
in vec2 aUV;

out vec2 vUV;

void main () {
  gl_Position = uProjectionViewMatrix * uModelMatrix * aPosition;
  vUV = aUV;
}`,j=`#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform float uUVScale;
uniform vec2 uTexOffset;
uniform float uMipBias;
uniform float uMSAAMixFactor;

in vec2 vUV;

out vec4 finalColor;

void main () {
  vec2 scaledOffsetedUVs = vUV * uUVScale + uTexOffset;
  finalColor = texture(uTexture, scaledOffsetedUVs, uMipBias);

  
  
  
  
  
  
  
  
  
  

  
  vec2 dx = dFdx(vUV); 
  vec2 dy = dFdy(vUV); 
  
  vec2 uvOffsets = vec2(0.125, 0.375);
  vec2 offsetUV = vec2(0.0);
  
  vec4 msaaColor = vec4(0.0);
  offsetUV = scaledOffsetedUVs + uvOffsets.x * dx + uvOffsets.y * dy;
  msaaColor += texture(uTexture, offsetUV, uMipBias);
  offsetUV = scaledOffsetedUVs - uvOffsets.x * dx - uvOffsets.y * dy;
  msaaColor += texture(uTexture, offsetUV, uMipBias);
  offsetUV = scaledOffsetedUVs + uvOffsets.y * dx - uvOffsets.x * dy;
  msaaColor += texture(uTexture, offsetUV, uMipBias);
  offsetUV = scaledOffsetedUVs - uvOffsets.y * dx + uvOffsets.x * dy;
  msaaColor += texture(uTexture, offsetUV, uMipBias);
  msaaColor *= 0.25;

  finalColor = mix(finalColor, msaaColor, uMSAAMixFactor);
}`;const q=new Float32Array([1,1,1,1,-1,1,0,1,1,-1,1,0,-1,-1,0,0]),Z=[{value:9728,text:"gl.NEAREST"},{value:9729,text:"gl.LINEAR"},{value:9984,text:"gl.NEAREST_MIPMAP_NEAREST"},{value:9985,text:"gl.LINEAR_MIPMAP_NEAREST"},{value:9986,text:"gl.NEAREST_MIPMAP_LINEAR"},{value:9987,text:"gl.LINEAR_MIPMAP_LINEAR"}],X={playAnim:!0},M={customMipmaps:!1,shouldRender:!0,uvScale:1,mipBias:0,msaa:!0},d={customMipmaps:!1,shouldRender:!0,useAnisotropyFiltering:!0,uvScale:2,mipBias:0,msaa:!0};let g,b=0,V=0,F=0;const L=document.getElementById("c"),e=L.getContext("webgl2",{antialias:!0});e.anisotropyExtension=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");e.maxAnisotropy=e.anisotropyExtension?e.getParameter(e.anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT):1;const R=new re.exports.Pane;R.element.parentNode.style.setProperty("width","450px");R.element.parentNode.style.setProperty("max-width","98%");R.addInput(X,"playAnim",{label:"Play Animation"}).on("change",({value:t})=>{b=performance.now()/1e3,V=performance.now()/1e3,t?g=requestAnimationFrame(N):cancelAnimationFrame(g)});R.addButton({title:"Disable All Optimisations"}).on("click",()=>{M.msaa=!1,B.value=e.LINEAR,d.msaa=!1,d.useAnisotropyFiltering=!1,O.value=e.LINEAR,R.refresh()});R.addButton({title:"Enable All Optimisations"}).on("click",()=>{M.msaa=!0,B.value=e.LINEAR_MIPMAP_LINEAR,d.msaa=!0,d.useAnisotropyFiltering=!0,O.value=e.LINEAR_MIPMAP_LINEAR,R.refresh()});R.addSeparator();const y=R.addFolder({title:"Orthographic Plane",expanded:innerWidth>800});y.addInput(M,"shouldRender",{label:"Should Render"});y.addInput(M,"customMipmaps",{label:"Debug Mipmaps"});const B=y.addBlade({view:"list",label:"Min Filter Mode",options:Z,value:9987});B.on("change",({value:t})=>{e.bindTexture(e.TEXTURE_2D,z),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t),e.bindTexture(e.TEXTURE_2D,K),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t)});y.addInput(M,"uvScale",{label:"UV Scale",min:1,max:10,step:.5}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uUVScale,t)});y.addInput(M,"mipBias",{label:"Mip Bias",min:0,max:10,step:.025}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uMipBias,t)});y.addInput(M,"msaa",{label:"Multi Sample Anti-Aliasing"}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uMSAAMixFactor,t?1:0)});const U=R.addFolder({title:"Perspective Plane",expanded:innerWidth>800});U.addInput(d,"shouldRender",{label:"Should Render"});U.addInput(d,"customMipmaps",{label:"Debug Mipmaps"});const O=U.addBlade({view:"list",label:"Min Filter Mode",options:Z,value:9987});O.on("change",({value:t})=>{e.bindTexture(e.TEXTURE_2D,J),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t),e.bindTexture(e.TEXTURE_2D,Q),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t)});U.addInput(d,"uvScale",{label:"UV Scale",min:1,max:50,step:.5}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uUVScale,t)});U.addInput(d,"mipBias",{label:"Mip Bias",min:0,max:10,step:.025}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uMipBias,t)});e.maxAnisotropy>1&&U.addInput(d,"useAnisotropyFiltering",{label:`Turn on Anisotropy Filtering (${e.maxAnisotropy}x)`}).on("change",({value:t})=>{e.texParameterf(e.TEXTURE_2D,e.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t?e.maxAnisotropy:1)});U.addInput(d,"msaa",{label:"Multi Sample Anti-Aliasing"}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uMSAAMixFactor,t?1:0)});const z=$(e),K=k(e),J=$(e),Q=k(e),c={},u={};{const t=H(e,G,j),o=e.getAttribLocation(t,"aPosition"),i=e.getAttribLocation(t,"aUV"),a=e.createVertexArray(),r=e.createBuffer();e.bindVertexArray(a),e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,q,e.STATIC_DRAW),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,0*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.bindVertexArray(null);const n=v();oe(n,-1,1,1,-1,.1,30);const s=S(0,0,1),_=S(0,0,0),P=S(0,1,0),x=v();Y(x,s,_,P);const T=v();w(T,n,x);const E=v(),p=e.getUniformLocation(t,"uProjectionViewMatrix"),l=e.getUniformLocation(t,"uModelMatrix"),f=e.getUniformLocation(t,"uTexture"),m=e.getUniformLocation(t,"uUVScale"),A=e.getUniformLocation(t,"uTexOffset"),h=e.getUniformLocation(t,"uMipBias"),I=e.getUniformLocation(t,"uMSAAMixFactor");e.useProgram(t),e.uniformMatrix4fv(p,!1,T),e.uniformMatrix4fv(l,!1,E),e.uniform1i(f,0),e.uniform1f(m,M.uvScale),e.uniform2f(A,0,0),e.uniform1f(h,0),e.uniform1f(I,1),e.useProgram(null),c.program=t,c.vao=a,c.uniforms={uProjectionViewMatrix:p,uModelMatrix:l,uTexture:f,uUVScale:m,uTexOffset:A,uMipBias:h,uMSAAMixFactor:I},c.matrix={projectionViewMatrix:T,modelMatrix:E}}{const t=H(e,G,j),o=e.getAttribLocation(t,"aPosition"),i=e.getAttribLocation(t,"aUV"),a=e.createVertexArray(),r=e.createBuffer();e.bindVertexArray(a),e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,q,e.STATIC_DRAW),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,0*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.bindVertexArray(null);const n=v();ne(n,45*Math.PI/180,innerWidth/innerHeight,.1,30);const s=S(0,-3,.5),_=S(0,0,0),P=S(0,1,0),x=v();Y(x,s,_,P);const T=v();w(T,n,x);const E=v();W(E,E,S(3,3,1));const p=e.getUniformLocation(t,"uProjectionViewMatrix"),l=e.getUniformLocation(t,"uModelMatrix"),f=e.getUniformLocation(t,"uTexture"),m=e.getUniformLocation(t,"uUVScale"),A=e.getUniformLocation(t,"uTexOffset"),h=e.getUniformLocation(t,"uMipBias"),I=e.getUniformLocation(t,"uMSAAMixFactor");e.useProgram(t),e.uniformMatrix4fv(p,!1,T),e.uniformMatrix4fv(l,!1,E),e.uniform1i(f,0),e.uniform1f(m,d.uvScale),e.uniform2f(A,0,0),e.uniform1f(h,0),e.uniform1f(I,1),e.useProgram(null),u.program=t,u.vao=a,u.uniforms={uProjectionViewMatrix:p,uModelMatrix:l,uTexture:f,uUVScale:m,uTexOffset:A,uMipBias:h,uMSAAMixFactor:I},u.matrix={projectionViewMatrix:T,modelMatrix:E},u.texOffsetY=0}te();addEventListener("resize",te);g=requestAnimationFrame(N);requestAnimationFrame(ee);function N(){g=requestAnimationFrame(N),b=performance.now()/1e3;const t=b-V;V=b,F+=t;const o=(1+Math.sin(Math.PI*2*F*.1))/2;if(X.playAnim){const i=D(o,0,1,-Math.PI*.25,0),a=D(o,0,1,.025,1);ae(c.matrix.modelMatrix),ie(c.matrix.modelMatrix,c.matrix.modelMatrix,i),W(c.matrix.modelMatrix,c.matrix.modelMatrix,S(a,a,1)),u.texOffsetY=F*.1}}function ee(){requestAnimationFrame(ee),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),d.shouldRender&&(e.bindVertexArray(u.vao),e.useProgram(u.program),X.playAnim&&e.uniform2f(u.uniforms.uTexOffset,0,u.texOffsetY),e.uniformMatrix4fv(u.uniforms.uModelMatrix,!1,u.matrix.modelMatrix),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,d.customMipmaps?Q:J),e.bindVertexArray(u.vao),e.drawArrays(e.TRIANGLE_STRIP,0,4)),M.shouldRender&&(e.useProgram(c.program),e.uniformMatrix4fv(c.uniforms.uModelMatrix,!1,c.matrix.modelMatrix),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,M.customMipmaps?K:z),e.bindVertexArray(c.vao),e.drawArrays(e.TRIANGLE_STRIP,0,4))}function te(){L.width=innerWidth*devicePixelRatio,L.height=innerHeight*devicePixelRatio,L.style.setProperty("width",`${innerWidth}px`),L.style.setProperty("height",`${innerHeight}px`)}
