import{t as re,c as U,o as ne,f as S,l as Y,m as W,p as ae,s as H,i as ie,r as se}from"./vendor.7d86c8f9.js";const ue=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function i(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(o){if(o.ep)return;o.ep=!0;const n=i(o);fetch(o.href,n)}};ue();const ce=(t,r,i)=>Math.min(Math.max(t,r),i),C=(t,r,i,a,o)=>{const n=(t-r)*(o-a)/(i-r)+a;return ce(n,a,o)},w=(t,r,i)=>{const a=t.createShader(r);if(t.shaderSource(a,i),t.compileShader(a),t.getShaderParameter(a,t.COMPILE_STATUS))return a;const o=`
    Error in ${r===t.VERTEX_SHADER?"Vertex":"Fragment"} shader:
    ${t.getShaderInfoLog(a)}
  `;throw t.deleteShader(a),new Error(o)},k=(t,r,i)=>{const a=w(t,t.VERTEX_SHADER,r),o=w(t,t.FRAGMENT_SHADER,i),n=t.createProgram();if(t.attachShader(n,a),t.attachShader(n,o),t.linkProgram(n),t.detachShader(n,a),t.deleteShader(a),t.detachShader(n,o),t.deleteShader(o),t.getProgramParameter(n,t.LINK_STATUS))return n;const s=new Error(`Error linking program: ${t.getProgramInfoLog(n)}`);throw t.deleteProgram(n),s},fe=innerWidth,le=innerHeight,me=["#f39c12","#2980b9","#27ae60","#d35400","#7f8c8d","#bdc3c7","#1abc9c","red","blue","green"],de=(t,r,i)=>{const a=document.createElement("canvas"),o=a.getContext("2d");a.width=t,a.height=r,o.fillStyle="#000",o.fillRect(0,0,t,r);const n=t/innerWidth,s=r/innerHeight,P=4*n,x=800,T=innerHeight<innerWidth?x*n:x*s;o.strokeStyle="#fff",o.lineWidth=P;const E=5,A=5,f=t/E,l=r/A;o.strokeRect(0,0,t,r),o.textAlign="center",o.textBaseline="middle",o.font=`${T}px ui-monospace, Menlo, Monaco, 'Cascadia Mono',
          'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace',
          'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New',
          monospace`,o.fillStyle=me[i];for(let m=1;m<E;m++){const p=m*f;o.beginPath(),o.moveTo(p,0),o.lineTo(p,r),o.stroke()}for(let m=1;m<A;m++){const p=m*l;o.beginPath(),o.moveTo(0,p),o.lineTo(t,p),o.stroke()}return o.fillText(i,t/2,r/2),a},$=(t,r=fe,i=le)=>{r=Math.min(r,t.MAX_TEXTURE_SIZE),i=Math.min(i,t.MAX_TEXTURE_SIZE);const a=t.createTexture();t.bindTexture(t.TEXTURE_2D,a);let o=r,n=i,s=0;for(;o>=2||n>=2;){o=r*Math.pow(.5,s),n=i*Math.pow(.5,s),o=o<1?Math.ceil(o):o,n=n<1?Math.ceil(n):n;const _=de(o,n,s);t.texImage2D(t.TEXTURE_2D,s,t.RGB,o,n,0,t.RGB,t.UNSIGNED_BYTE,_),s++}return t.texParameterf(t.TEXTURE_2D,t.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t.maxAnisotropy),t.bindTexture(t.TEXTURE_2D,null),a},Ee=innerWidth,xe=innerHeight,G=(t,r=Ee,i=xe)=>{r=Math.min(r,t.MAX_TEXTURE_SIZE),i=Math.min(i,t.MAX_TEXTURE_SIZE);const a=document.createElement("canvas"),o=a.getContext("2d");a.width=r,a.height=i,o.fillStyle="#000",o.fillRect(0,0,r,i);const n=4,s=r/innerWidth,_=n*s;o.strokeStyle="#fff",o.lineWidth=_;const P=5,x=5,T=r/P,E=i/x;o.strokeRect(0,0,r,i);for(let f=1;f<P;f++){const l=f*T;o.beginPath(),o.moveTo(l,0),o.lineTo(l,i),o.stroke()}for(let f=1;f<x;f++){const l=f*E;o.beginPath(),o.moveTo(0,l),o.lineTo(r,l),o.stroke()}const A=t.createTexture();return t.bindTexture(t.TEXTURE_2D,A),t.texImage2D(t.TEXTURE_2D,0,t.RGB,r,i,0,t.RGB,t.UNSIGNED_BYTE,a),t.texParameterf(t.TEXTURE_2D,t.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t.maxAnisotropy),t.generateMipmap(t.TEXTURE_2D),t.bindTexture(t.TEXTURE_2D,null),A};var j=`#version 300 es

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
}`;const Z=new Float32Array([1,1,1,1,-1,1,0,1,1,-1,1,0,-1,-1,0,0]),z=[{value:9728,text:"gl.NEAREST"},{value:9729,text:"gl.LINEAR"},{value:9984,text:"gl.NEAREST_MIPMAP_NEAREST"},{value:9985,text:"gl.LINEAR_MIPMAP_NEAREST"},{value:9986,text:"gl.NEAREST_MIPMAP_LINEAR"},{value:9987,text:"gl.LINEAR_MIPMAP_LINEAR"}],O={playAnim:!0},M={customMipmaps:!0,shouldRender:!0,uvScale:1,mipBias:0,msaa:!0},d={customMipmaps:!1,shouldRender:!0,useAnisotropyFiltering:!0,uvScale:2.5,mipBias:.5,msaa:!0};let b,g=0,X=0,F=0;const L=document.getElementById("c"),e=L.getContext("webgl2",{antialias:!0});e.anisotropyExtension=e.getExtension("EXT_texture_filter_anisotropic")||e.getExtension("MOZ_EXT_texture_filter_anisotropic")||e.getExtension("WEBKIT_EXT_texture_filter_anisotropic");e.maxAnisotropy=e.anisotropyExtension?e.getParameter(e.anisotropyExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT):1;const R=new re.exports.Pane;R.element.parentNode.style.setProperty("width","450px");R.element.parentNode.style.setProperty("max-width","98%");R.addInput(O,"playAnim",{label:"Play Animation"}).on("change",({value:t})=>{g=performance.now()/1e3,X=performance.now()/1e3,t?b=requestAnimationFrame(D):cancelAnimationFrame(b)});R.addButton({title:"Disable All Optimisations"}).on("click",()=>{M.msaa=!1,B.value=e.LINEAR,d.msaa=!1,d.useAnisotropyFiltering=!1,N.value=e.LINEAR,R.refresh()});R.addButton({title:"Enable All Optimisations"}).on("click",()=>{M.msaa=!0,B.value=e.LINEAR_MIPMAP_LINEAR,d.msaa=!0,d.useAnisotropyFiltering=!0,N.value=e.LINEAR_MIPMAP_LINEAR,R.refresh()});R.addSeparator();const y=R.addFolder({title:"Orthographic Plane",expanded:innerWidth>800});y.addInput(M,"shouldRender",{label:"Should Render"});y.addInput(M,"customMipmaps",{label:"Debug Mipmaps"});const B=y.addBlade({view:"list",label:"Min Filter Mode",options:z,value:9987});B.on("change",({value:t})=>{e.bindTexture(e.TEXTURE_2D,K),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t),e.bindTexture(e.TEXTURE_2D,J),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t)});y.addInput(M,"uvScale",{label:"UV Scale",min:1,max:10,step:.5}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uUVScale,t)});y.addInput(M,"mipBias",{label:"Mip Bias",min:0,max:10,step:.025}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uMipBias,t)});y.addInput(M,"msaa",{label:"Multi Sample Anti-Aliasing"}).on("change",({value:t})=>{e.useProgram(c.program),e.uniform1f(c.uniforms.uMSAAMixFactor,t?1:0)});const v=R.addFolder({title:"Perspective Plane",expanded:innerWidth>800});v.addInput(d,"shouldRender",{label:"Should Render"});v.addInput(d,"customMipmaps",{label:"Debug Mipmaps"});const N=v.addBlade({view:"list",label:"Min Filter Mode",options:z,value:9987});N.on("change",({value:t})=>{e.bindTexture(e.TEXTURE_2D,Q),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t),e.bindTexture(e.TEXTURE_2D,ee),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,t)});v.addInput(d,"uvScale",{label:"UV Scale",min:1,max:50,step:.5}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uUVScale,t)});v.addInput(d,"mipBias",{label:"Mip Bias",min:0,max:10,step:.025}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uMipBias,t)});e.maxAnisotropy>1&&v.addInput(d,"useAnisotropyFiltering",{label:`Turn on Anisotropy Filtering (${e.maxAnisotropy}x)`}).on("change",({value:t})=>{e.texParameterf(e.TEXTURE_2D,e.anisotropyExtension.TEXTURE_MAX_ANISOTROPY_EXT,t?e.maxAnisotropy:1)});v.addInput(d,"msaa",{label:"Multi Sample Anti-Aliasing"}).on("change",({value:t})=>{e.useProgram(u.program),e.uniform1f(u.uniforms.uMSAAMixFactor,t?1:0)});const K=G(e),J=$(e),Q=G(e),ee=$(e),c={},u={};{const t=k(e,j,q),r=e.getAttribLocation(t,"aPosition"),i=e.getAttribLocation(t,"aUV"),a=e.createVertexArray(),o=e.createBuffer();e.bindVertexArray(a),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,Z,e.STATIC_DRAW),e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,0*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.bindVertexArray(null);const n=U();ne(n,-1,1,1,-1,.1,30);const s=S(0,0,1),_=S(0,0,0),P=S(0,1,0),x=U();Y(x,s,_,P);const T=U();W(T,n,x);const E=U(),A=e.getUniformLocation(t,"uProjectionViewMatrix"),f=e.getUniformLocation(t,"uModelMatrix"),l=e.getUniformLocation(t,"uTexture"),m=e.getUniformLocation(t,"uUVScale"),p=e.getUniformLocation(t,"uTexOffset"),I=e.getUniformLocation(t,"uMipBias"),h=e.getUniformLocation(t,"uMSAAMixFactor"),V=e.getUniformLocation(t,"uMSAAUVOffsets");e.useProgram(t),e.uniformMatrix4fv(A,!1,T),e.uniformMatrix4fv(f,!1,E),e.uniform1i(l,0),e.uniform1f(m,M.uvScale),e.uniform2f(p,0,0),e.uniform1f(I,0),e.uniform1f(h,1),e.uniform2f(V,.125*devicePixelRatio,.375*devicePixelRatio),e.useProgram(null),c.program=t,c.vao=a,c.uniforms={uProjectionViewMatrix:A,uModelMatrix:f,uTexture:l,uUVScale:m,uTexOffset:p,uMipBias:I,uMSAAMixFactor:h,uMSAAUVOffsets:V},c.matrix={projectionViewMatrix:T,modelMatrix:E}}{const t=k(e,j,q),r=e.getAttribLocation(t,"aPosition"),i=e.getAttribLocation(t,"aUV"),a=e.createVertexArray(),o=e.createBuffer();e.bindVertexArray(a),e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,Z,e.STATIC_DRAW),e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,0*Float32Array.BYTES_PER_ELEMENT),e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,4*Float32Array.BYTES_PER_ELEMENT,2*Float32Array.BYTES_PER_ELEMENT),e.bindVertexArray(null);const n=U();ae(n,45*Math.PI/180,innerWidth/innerHeight,.1,30);const s=S(0,-3,.5),_=S(0,0,0),P=S(0,1,0),x=U();Y(x,s,_,P);const T=U();W(T,n,x);const E=U();H(E,E,S(3,3,1));const A=e.getUniformLocation(t,"uProjectionViewMatrix"),f=e.getUniformLocation(t,"uModelMatrix"),l=e.getUniformLocation(t,"uTexture"),m=e.getUniformLocation(t,"uUVScale"),p=e.getUniformLocation(t,"uTexOffset"),I=e.getUniformLocation(t,"uMipBias"),h=e.getUniformLocation(t,"uMSAAMixFactor"),V=e.getUniformLocation(t,"uMSAAUVOffsets");e.useProgram(t),e.uniformMatrix4fv(A,!1,T),e.uniformMatrix4fv(f,!1,E),e.uniform1i(l,0),e.uniform1f(m,d.uvScale),e.uniform2f(p,0,0),e.uniform1f(I,0),e.uniform1f(h,1),e.uniform2f(V,.125*devicePixelRatio,.375*devicePixelRatio),e.useProgram(null),u.program=t,u.vao=a,u.uniforms={uProjectionViewMatrix:A,uModelMatrix:f,uTexture:l,uUVScale:m,uTexOffset:p,uMipBias:I,uMSAAMixFactor:h,uMSAAUVOffsets:V},u.matrix={projectionViewMatrix:T,modelMatrix:E},u.texOffsetY=0}oe();addEventListener("resize",oe);b=requestAnimationFrame(D);requestAnimationFrame(te);function D(){b=requestAnimationFrame(D),g=performance.now()/1e3;const t=g-X;X=g,F+=t;const r=(1+Math.sin(Math.PI*2*F*.1))/2;if(O.playAnim){const i=C(r,0,1,-Math.PI*.25,0),a=C(r,0,1,.025,1);ie(c.matrix.modelMatrix),se(c.matrix.modelMatrix,c.matrix.modelMatrix,i),H(c.matrix.modelMatrix,c.matrix.modelMatrix,S(a,a,1)),u.texOffsetY=F*.1}}function te(){requestAnimationFrame(te),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),d.shouldRender&&(e.bindVertexArray(u.vao),e.useProgram(u.program),O.playAnim&&e.uniform2f(u.uniforms.uTexOffset,0,u.texOffsetY),e.uniformMatrix4fv(u.uniforms.uModelMatrix,!1,u.matrix.modelMatrix),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,d.customMipmaps?ee:Q),e.bindVertexArray(u.vao),e.drawArrays(e.TRIANGLE_STRIP,0,4)),M.shouldRender&&(e.useProgram(c.program),e.uniformMatrix4fv(c.uniforms.uModelMatrix,!1,c.matrix.modelMatrix),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,M.customMipmaps?J:K),e.bindVertexArray(c.vao),e.drawArrays(e.TRIANGLE_STRIP,0,4))}function oe(){L.width=innerWidth*devicePixelRatio,L.height=innerHeight*devicePixelRatio,L.style.setProperty("width",`${innerWidth}px`),L.style.setProperty("height",`${innerHeight}px`)}
