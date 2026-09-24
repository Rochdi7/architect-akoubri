var fe=Object.defineProperty;var me=(t,e,i)=>e in t?fe(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var l=(t,e,i)=>me(t,typeof e!="symbol"?e+"":e,i);import{j as $,u as de}from"./index-BkvX6Dq-.js";import{r as R}from"./vendor-0JBXuBrX.js";const pe=`#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`,ee=1920*1080*4;let ge=class{constructor(e,i,o,a,n=0,s=0,r=2,m=ee,u=[]){l(this,"parentElement");l(this,"canvasElement");l(this,"gl");l(this,"program",null);l(this,"uniformLocations",{});l(this,"fragmentShader");l(this,"rafId",null);l(this,"lastRenderTime",0);l(this,"currentFrame",0);l(this,"speed",0);l(this,"currentSpeed",0);l(this,"providedUniforms");l(this,"mipmaps",[]);l(this,"hasBeenDisposed",!1);l(this,"resolutionChanged",!0);l(this,"textures",new Map);l(this,"minPixelRatio");l(this,"maxPixelCount");l(this,"isSafari",_e());l(this,"uniformCache",{});l(this,"textureUnitMap",new Map);l(this,"ownerDocument");l(this,"initProgram",()=>{const e=ve(this.gl,pe,this.fragmentShader);e&&(this.program=e)});l(this,"setupPositionAttribute",()=>{const e=this.gl.getAttribLocation(this.program,"a_position"),i=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,i);const o=[-1,-1,1,-1,-1,1,-1,1,1,-1,1,1];this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(o),this.gl.STATIC_DRAW),this.gl.enableVertexAttribArray(e),this.gl.vertexAttribPointer(e,2,this.gl.FLOAT,!1,0,0)});l(this,"setupUniforms",()=>{const e={u_time:this.gl.getUniformLocation(this.program,"u_time"),u_pixelRatio:this.gl.getUniformLocation(this.program,"u_pixelRatio"),u_resolution:this.gl.getUniformLocation(this.program,"u_resolution")};Object.entries(this.providedUniforms).forEach(([i,o])=>{if(e[i]=this.gl.getUniformLocation(this.program,i),o instanceof HTMLImageElement){const a=`${i}AspectRatio`;e[a]=this.gl.getUniformLocation(this.program,a)}}),this.uniformLocations=e});l(this,"renderScale",1);l(this,"parentWidth",0);l(this,"parentHeight",0);l(this,"parentDevicePixelWidth",0);l(this,"parentDevicePixelHeight",0);l(this,"devicePixelsSupported",!1);l(this,"intersectionObserver",null);l(this,"isInViewport",!0);l(this,"resizeObserver",null);l(this,"setupResizeObserver",()=>{this.resizeObserver=new ResizeObserver(([e])=>{var i;if(e!=null&&e.borderBoxSize[0]){const o=(i=e.devicePixelContentBoxSize)==null?void 0:i[0];o!==void 0&&(this.devicePixelsSupported=!0,this.parentDevicePixelWidth=o.inlineSize,this.parentDevicePixelHeight=o.blockSize),this.parentWidth=e.borderBoxSize[0].inlineSize,this.parentHeight=e.borderBoxSize[0].blockSize}this.handleResize()}),this.resizeObserver.observe(this.parentElement)});l(this,"setupIntersectionObserver",()=>{const e=this.ownerDocument.defaultView;e!=null&&e.IntersectionObserver&&(this.intersectionObserver=new e.IntersectionObserver(([i])=>{this.isInViewport=(i==null?void 0:i.isIntersecting)??!0,this.updateCurrentSpeed()}),this.intersectionObserver.observe(this.parentElement))});l(this,"handleVisualViewportChange",()=>{var e;(e=this.resizeObserver)==null||e.disconnect(),this.setupResizeObserver()});l(this,"handleResize",()=>{let e=0,i=0;const o=Math.max(1,window.devicePixelRatio),a=(visualViewport==null?void 0:visualViewport.scale)??1;if(this.devicePixelsSupported){const h=Math.max(1,this.minPixelRatio/o);e=this.parentDevicePixelWidth*h*a,i=this.parentDevicePixelHeight*h*a}else{let h=Math.max(o,this.minPixelRatio)*a;if(this.isSafari){const d=Ue(this.ownerDocument);h*=Math.max(1,d)}e=Math.round(this.parentWidth)*h,i=Math.round(this.parentHeight)*h}const n=Math.sqrt(this.maxPixelCount)/Math.sqrt(e*i),s=Math.min(1,n),r=Math.round(e*s),m=Math.round(i*s),u=r/Math.round(this.parentWidth);(this.canvasElement.width!==r||this.canvasElement.height!==m||this.renderScale!==u)&&(this.renderScale=u,this.canvasElement.width=r,this.canvasElement.height=m,this.resolutionChanged=!0,this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height),this.render(performance.now()))});l(this,"render",e=>{if(this.hasBeenDisposed)return;if(this.program===null){console.warn("Tried to render before program or gl was initialized");return}const i=e-this.lastRenderTime;this.lastRenderTime=e,this.currentSpeed!==0&&(this.currentFrame+=i*this.currentSpeed),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl.useProgram(this.program),this.gl.uniform1f(this.uniformLocations.u_time,this.currentFrame*.001),this.resolutionChanged&&(this.gl.uniform2f(this.uniformLocations.u_resolution,this.gl.canvas.width,this.gl.canvas.height),this.gl.uniform1f(this.uniformLocations.u_pixelRatio,this.renderScale),this.resolutionChanged=!1),this.gl.drawArrays(this.gl.TRIANGLES,0,6),this.currentSpeed!==0?this.requestRender():this.rafId=null});l(this,"requestRender",()=>{this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(this.render)});l(this,"setTextureUniform",(e,i)=>{if(!i.complete||i.naturalWidth===0)throw new Error(`Paper Shaders: image for uniform ${e} must be fully loaded`);const o=this.textures.get(e);o&&this.gl.deleteTexture(o),this.textureUnitMap.has(e)||this.textureUnitMap.set(e,this.textureUnitMap.size);const a=this.textureUnitMap.get(e);this.gl.activeTexture(this.gl.TEXTURE0+a);const n=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,n),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,i),this.mipmaps.includes(e)&&(this.gl.generateMipmap(this.gl.TEXTURE_2D),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR_MIPMAP_LINEAR));const s=this.gl.getError();if(s!==this.gl.NO_ERROR||n===null){console.error("Paper Shaders: WebGL error when uploading texture:",s);return}this.textures.set(e,n);const r=this.uniformLocations[e];if(r){this.gl.uniform1i(r,a);const m=`${e}AspectRatio`,u=this.uniformLocations[m];if(u){const h=i.naturalWidth/i.naturalHeight;this.gl.uniform1f(u,h)}}});l(this,"areUniformValuesEqual",(e,i)=>e===i?!0:Array.isArray(e)&&Array.isArray(i)&&e.length===i.length?e.every((o,a)=>this.areUniformValuesEqual(o,i[a])):!1);l(this,"setUniformValues",e=>{this.gl.useProgram(this.program),Object.entries(e).forEach(([i,o])=>{let a=o;if(o instanceof HTMLImageElement&&(a=`${o.src.slice(0,200)}|${o.naturalWidth}x${o.naturalHeight}`),this.areUniformValuesEqual(this.uniformCache[i],a))return;this.uniformCache[i]=a;const n=this.uniformLocations[i];if(!n){console.warn(`Uniform location for ${i} not found`);return}if(o instanceof HTMLImageElement)this.setTextureUniform(i,o);else if(Array.isArray(o)){let s=null,r=null;if(o[0]!==void 0&&Array.isArray(o[0])){const m=o[0].length;if(o.every(u=>u.length===m))s=o.flat(),r=m;else{console.warn(`All child arrays must be the same length for ${i}`);return}}else s=o,r=s.length;switch(r){case 2:this.gl.uniform2fv(n,s);break;case 3:this.gl.uniform3fv(n,s);break;case 4:this.gl.uniform4fv(n,s);break;case 9:this.gl.uniformMatrix3fv(n,!1,s);break;case 16:this.gl.uniformMatrix4fv(n,!1,s);break;default:console.warn(`Unsupported uniform array length: ${r}`)}}else typeof o=="number"?this.gl.uniform1f(n,o):typeof o=="boolean"?this.gl.uniform1i(n,o?1:0):console.warn(`Unsupported uniform type for ${i}: ${typeof o}`)})});l(this,"getCurrentFrame",()=>this.currentFrame);l(this,"setFrame",e=>{this.currentFrame=e,this.lastRenderTime=performance.now(),this.render(performance.now())});l(this,"setSpeed",(e=1)=>{this.speed=e,this.updateCurrentSpeed()});l(this,"updateCurrentSpeed",()=>{this.setCurrentSpeed(this.ownerDocument.hidden||!this.isInViewport?0:this.speed)});l(this,"setCurrentSpeed",e=>{this.currentSpeed=e,this.rafId===null&&e!==0&&(this.lastRenderTime=performance.now(),this.rafId=requestAnimationFrame(this.render)),this.rafId!==null&&e===0&&(cancelAnimationFrame(this.rafId),this.rafId=null)});l(this,"setMaxPixelCount",(e=ee)=>{this.maxPixelCount=e,this.handleResize()});l(this,"setMinPixelRatio",(e=2)=>{this.minPixelRatio=e,this.handleResize()});l(this,"setUniforms",e=>{this.setUniformValues(e),this.providedUniforms={...this.providedUniforms,...e},this.render(performance.now())});l(this,"handleDocumentVisibilityChange",()=>{this.updateCurrentSpeed()});l(this,"dispose",()=>{this.hasBeenDisposed=!0,this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.gl&&this.program&&(this.textures.forEach(e=>{this.gl.deleteTexture(e)}),this.textures.clear(),this.gl.deleteProgram(this.program),this.program=null,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,null),this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,null),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.getError()),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.intersectionObserver&&(this.intersectionObserver.disconnect(),this.intersectionObserver=null),visualViewport==null||visualViewport.removeEventListener("resize",this.handleVisualViewportChange),this.ownerDocument.removeEventListener("visibilitychange",this.handleDocumentVisibilityChange),this.uniformLocations={},this.canvasElement.remove(),delete this.parentElement.paperShaderMount});if((e==null?void 0:e.nodeType)===1)this.parentElement=e;else throw new Error("Paper Shaders: parent element must be an HTMLElement");if(this.ownerDocument=e.ownerDocument,!this.ownerDocument.querySelector("style[data-paper-shader]")){const y=this.ownerDocument.createElement("style");y.innerHTML=xe,y.setAttribute("data-paper-shader",""),this.ownerDocument.head.prepend(y)}const h=this.ownerDocument.createElement("canvas");this.canvasElement=h,this.parentElement.prepend(h),this.fragmentShader=i,this.providedUniforms=o,this.mipmaps=u,this.currentFrame=s,this.minPixelRatio=r,this.maxPixelCount=m;const d=h.getContext("webgl2",a);if(!d)throw new Error("Paper Shaders: WebGL is not supported in this browser");this.gl=d,this.initProgram(),this.setupPositionAttribute(),this.setupUniforms(),this.setUniformValues(this.providedUniforms),this.setupResizeObserver(),visualViewport==null||visualViewport.addEventListener("resize",this.handleVisualViewportChange),this.setupIntersectionObserver(),this.setSpeed(n),this.parentElement.setAttribute("data-paper-shader",""),this.parentElement.paperShaderMount=this,this.ownerDocument.addEventListener("visibilitychange",this.handleDocumentVisibilityChange)}};function te(t,e,i){const o=t.createShader(e);return o?(t.shaderSource(o,i),t.compileShader(o),t.getShaderParameter(o,t.COMPILE_STATUS)?o:(console.error("An error occurred compiling the shaders: "+t.getShaderInfoLog(o)),t.deleteShader(o),null)):null}function ve(t,e,i){const o=t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT),a=o?o.precision:null;a&&a<23&&(e=e.replace(/precision\s+(lowp|mediump)\s+float;/g,"precision highp float;"),i=i.replace(/precision\s+(lowp|mediump)\s+float/g,"precision highp float").replace(/\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,"$1 highp $3"));const n=te(t,t.VERTEX_SHADER,e),s=te(t,t.FRAGMENT_SHADER,i);if(!n||!s)return null;const r=t.createProgram();return r?(t.attachShader(r,n),t.attachShader(r,s),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)?(t.detachShader(r,n),t.detachShader(r,s),t.deleteShader(n),t.deleteShader(s),r):(console.error("Unable to initialize the shader program: "+t.getProgramInfoLog(r)),t.deleteProgram(r),t.deleteShader(n),t.deleteShader(s),null)):null}const xe=`@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;function _e(){const t=navigator.userAgent.toLowerCase();return t.includes("safari")&&!t.includes("chrome")&&!t.includes("android")}function Ue(t){const e=(visualViewport==null?void 0:visualViewport.scale)??1,i=(visualViewport==null?void 0:visualViewport.width)??window.innerWidth,o=window.innerWidth-t.documentElement.clientWidth,a=e*i+o,n=outerWidth/a,s=Math.round(100*n);return s%5===0?s/100:s===33?1/3:s===67?2/3:s===133?4/3:n}const be={fit:"contain",scale:1,rotation:0,offsetX:0,offsetY:0,originX:.5,originY:.5,worldWidth:0,worldHeight:0},Se={none:0,contain:1,cover:2},we=`
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`,Re=`
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`,ie={maxColorCount:6},Ae=`#version 300 es
precision mediump float;

in mediump vec2 v_imageUV;
in mediump vec2 v_objectUV;
in mediump vec2 v_responsiveUV;
in mediump vec2 v_responsiveBoxGivenSize;
                                               
out vec4 fragColor;

uniform sampler2D u_image;
uniform float u_shape;
uniform bool u_isImage;

uniform float u_time;
uniform vec4 u_colors[${ie.maxColorCount}];
uniform float u_colorsCount;
uniform vec4 u_colorBack;
uniform vec4 u_colorInner;
uniform float u_innerDistortion;
uniform float u_outerDistortion;
uniform float u_outerGlow;
uniform float u_innerGlow;
uniform float u_offset;
uniform float u_angle;
uniform float u_size;

${we}
${Re}

// 9x9 Gaussian blur on R and G channels
vec2 gaussBlur9x9RG(sampler2D tex, vec2 uv, float radius) {
  vec2 texel = 1.0 / vec2(textureSize(tex, 0));
  vec2 r = max(radius, 0.0) * texel;
  // Pascal's row 8: sum = 256, 2D norm = 65536
  const float k[9] = float[9](1.0, 8.0, 28.0, 56.0, 70.0, 56.0, 28.0, 8.0, 1.0);
  vec2 sum = vec2(0.0);

  for (int j = -4; j <= 4; ++j) {
    float wy = k[j + 4];
    for (int i = -4; i <= 4; ++i) {
      float w = k[i + 4] * wy;
      vec2 off = vec2(float(i) * r.x, float(j) * r.y);
      sum += w * texture(tex, uv + off).rg;
    }
  }

  return sum / 65536.0;
}

float sst(float a, float b, float x) {
  return smoothstep(a, b, x);
}

void main() {
  float time = u_time;

  float roundness = 0.;
  float imgAlpha = 0.;

  if (u_isImage == true) {
    // Image sampling (UV scaled inward to account for padding)
    vec2 imageUV = v_imageUV;
    imageUV -= .5;
    imageUV *= .95;
    imageUV += .5;

    // Blurred image: x = roundness, y = alpha
    vec2 blurred = gaussBlur9x9RG(u_image, imageUV, 10.);
    roundness = 1. - blurred.x;
    vec2 texelA = 1.0 / vec2(textureSize(u_image, 0));
    const float k3[3] = float[3](1.0, 2.0, 1.0);
    for (int j = -1; j <= 1; ++j) {
      for (int i = -1; i <= 1; ++i) {
        imgAlpha += k3[i + 1] * k3[j + 1] * texture(u_image, imageUV + vec2(float(i) * texelA.x, float(j) * texelA.y)).g;
      }
    }
    imgAlpha /= 16.0;
  } else {
    vec2 uv = v_objectUV + .5;
    uv.y = 1. - uv.y;
    float edge = 0.;

    if (u_shape < 1.) {
      // full-fill on canvas
      vec2 borderUV = v_responsiveUV + .5;
      vec2 mask = min(borderUV, 1. - borderUV);
      vec2 pixel_thickness = min(250. / v_responsiveBoxGivenSize, vec2(.5));
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 2.) {
      // circle
      vec2 shapeUV = uv - .5;
      shapeUV *= .67;
      edge = pow(clamp(3. * length(shapeUV), 0., 1.), 18.);
    } else if (u_shape < 3.) {
      // daisy
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.68;

      float r = length(shapeUV) * 2.;
      float a = atan(shapeUV.y, shapeUV.x) + .2;
      r *= (1. + .05 * sin(3. * a + 2. * time));
      float f = abs(cos(a * 3.));
      edge = smoothstep(f, f + .7, r);
      edge *= edge;
    } else if (u_shape < 4.) {
      // diamond
      vec2 shapeUV = uv - .5;
      shapeUV = rotate(shapeUV, .25 * PI);
      shapeUV *= 1.42;
      shapeUV += .5;
      vec2 mask = min(shapeUV, 1. - shapeUV);
      vec2 pixel_thickness = vec2(.15);
      float maskX = smoothstep(0.0, pixel_thickness.x, mask.x);
      float maskY = smoothstep(0.0, pixel_thickness.y, mask.y);
      maskX = pow(maskX, .25);
      maskY = pow(maskY, .25);
      edge = clamp(1. - maskX * maskY, 0., 1.);
    } else if (u_shape < 5.) {
      // metaballs
      vec2 shapeUV = uv - .5;
      shapeUV *= 1.3;
      edge = 0.;
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float speed = 1.5 + 2./3. * sin(fi * 12.345);
        float angle = -fi * 1.5;
        vec2 dir1 = vec2(cos(angle), sin(angle));
        vec2 dir2 = vec2(cos(angle + 1.57), sin(angle + 1.));
        vec2 traj = .4 * (dir1 * sin(time * speed + fi * 1.23) + dir2 * cos(time * (speed * 0.7) + fi * 2.17));
        float d = length(shapeUV + traj);
        edge += pow(1.0 - clamp(d, 0.0, 1.0), 4.0);
      }
      edge = 1. - smoothstep(.65, .9, edge);
      edge = pow(edge, 4.);
    }

    imgAlpha = 1. - smoothstep(.9 - 2. * fwidth(edge), .9, edge);
    roundness = 1. - edge;
  }

// Smoke UV setup
  vec2 smokeUV = v_objectUV;
  smokeUV = rotate(smokeUV, u_angle * PI / 180.);
  smokeUV *= mix(4., 1., u_size);

  // Two swirl paths: inner (shape-masked) and outer (free), each with independent distortion
  vec2 innerUV = smokeUV;
  vec2 outerUV = smokeUV;

  // Vertical displacement — applied independently to inner and outer
  innerUV.y += u_innerDistortion * (1. - sst(0., 1., length(.4 * innerUV)));
  innerUV.y -= .4 * u_innerDistortion;
  innerUV.y += .7 * u_offset * roundness;

  outerUV.y += u_outerDistortion * (1. - sst(0., 1., length(.4 * outerUV)));
  outerUV.y -= .4 * u_outerDistortion;

  float innerSwirl = u_innerDistortion * roundness;
  float outerSwirl = u_outerDistortion;

  for (int i = 1; i < 5; i++) {
    float fi = float(i);

    float stretchIn = max(length(dFdx(innerUV)), length(dFdy(innerUV)));
    float dampenIn = 1. / (1. + stretchIn * 8.);
    float sIn = innerSwirl * dampenIn;
    innerUV.x += sIn / fi * cos(time + fi * 2.9 * innerUV.y);
    innerUV.y += sIn / fi * cos(time + fi * 1.5 * innerUV.x);

    float stretchOut = max(length(dFdx(outerUV)), length(dFdy(outerUV)));
    float dampenOut = 1. / (1. + stretchOut * 8.);
    float sOut = outerSwirl * dampenOut;
    outerUV.x += sOut / fi * cos(time + fi * 2.9 * outerUV.y);
    outerUV.y += sOut / fi * cos(time + fi * 1.5 * outerUV.x);
  }

  // Smoke shapes from swirl fields
  float innerShape = exp(-1.5 * dot(innerUV, innerUV));
  float outerShape = exp(-1.5 * dot(outerUV, outerUV));

  // Visibility masks
  float outerMask = pow(u_outerGlow, 2.) * (1. - imgAlpha);
  float innerMask = (.01 + .99 * u_innerGlow) * imgAlpha;

  innerShape *= innerMask;
  outerShape *= outerMask;

  // Color gradient
  float mixer = (innerShape + outerShape) * u_colorsCount;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;

  float smokeMask = 0.;
  for (int i = 1; i < ${ie.maxColorCount+1}; i++) {
    if (i > int(u_colorsCount)) break;

    float m = sst(0., 1., clamp(mixer - float(i - 1), 0., 1.));
    if (i == 1) smokeMask = m;

    vec4 c = u_colors[i - 1];
    c.rgb *= c.a;
    gradient = mix(gradient, c, m);
  }

  // Compositing (premultiplied alpha, front-to-back)
  vec3 color = gradient.rgb * smokeMask;
  float opacity = gradient.a * smokeMask;

  float innerOpacity = u_colorInner.a * imgAlpha;
  vec3 innerColor = u_colorInner.rgb * innerOpacity;
  color += innerColor * (1.0 - opacity);
  opacity += innerOpacity * (1.0 - opacity);

  vec3 backColor = u_colorBack.rgb * u_colorBack.a;
  color += backColor * (1.0 - opacity);
  opacity += u_colorBack.a * (1.0 - opacity);

  fragColor = vec4(color, opacity);
}
`,ce={workingSize:512,iterations:32};function oe(t){const e=document.createElement("canvas"),i=e.getContext("2d"),o=typeof t=="string"&&t.startsWith("blob:");return new Promise((a,n)=>{if(!t||!i){n(new Error("Invalid file or canvas context"));return}const s=o&&fetch(t).then(m=>m.headers.get("Content-Type")),r=new Image;r.crossOrigin="anonymous",performance.now(),r.onload=async()=>{let m;const u=await s;u?m=u==="image/svg+xml":typeof t=="string"?m=t.endsWith(".svg")||t.startsWith("data:image/svg+xml"):m=t.type==="image/svg+xml";let h=r.width||r.naturalWidth,d=r.height||r.naturalHeight;if(m){const b=h/d;h>d?(h=4096,d=4096/b):(d=4096,h=4096*b),r.width=h,r.height=d}const y=Math.min(h,d),_=ce.workingSize/y,f=Math.round(h*_),c=Math.round(d*_);e.width=h,e.height=d;const g=.025,E=Math.ceil(f*g),I=Math.ceil(c*g),v=f-2*E,A=c-2*I,x=document.createElement("canvas");x.width=f,x.height=c;const V=x.getContext("2d");V.drawImage(r,E,I,v,A),performance.now();const F=V.getImageData(0,0,f,c).data,S=new Uint8Array(f*c),P=new Uint8Array(f*c);for(let p=0,b=0;p<F.length;p+=4,b++){const B=F[p+3]===0?0:1;S[b]=B}const L=[],k=[];for(let p=0;p<c;p++)for(let b=0;b<f;b++){const w=p*f+b;if(!S[w])continue;let B=!1;b===0||b===f-1||p===0||p===c-1?B=!0:B=!S[w-1]||!S[w+1]||!S[w-f]||!S[w+f]||!S[w-f-1]||!S[w-f+1]||!S[w+f-1]||!S[w+f+1],B?(P[w]=1,L.push(w)):k.push(w)}const H=Ve(S,P,new Uint32Array(k),new Uint32Array(L),f,c);performance.now();const T=ye(H,S,P,f,c);let O=0,G;for(let p=0;p<k.length;p++){const b=k[p];T[b]>O&&(O=T[b])}const W=document.createElement("canvas");W.width=f,W.height=c;const K=W.getContext("2d"),D=K.createImageData(f,c);for(let p=0;p<c;p++)for(let b=0;b<f;b++){const w=p*f+b,B=w*4;if(!S[w])D.data[B]=255,D.data[B+1]=255,D.data[B+2]=255,D.data[B+3]=0;else{let Y=255*(1-T[w]/O);D.data[B]=Y,D.data[B+1]=Y,D.data[B+2]=Y,D.data[B+3]=255}}K.putImageData(D,0,0),i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",i.drawImage(W,0,0,f,c,0,0,h,d);const M=i.getImageData(0,0,h,d),Q=Math.ceil(h*g),Z=Math.ceil(d*g),X=document.createElement("canvas");X.width=h,X.height=d;const J=X.getContext("2d");J.drawImage(r,Q,Z,h-2*Q,d-2*Z);const he=J.getImageData(0,0,h,d);for(let p=0;p<M.data.length;p+=4){const b=he.data[p+3],w=M.data[p+3];b===0?(M.data[p]=255,M.data[p+1]=0):(M.data[p]=w===0?0:M.data[p],M.data[p+1]=b),M.data[p+2]=255,M.data[p+3]=255}i.putImageData(M,0,0),G=M,e.toBlob(p=>{if(!p){n(new Error("Failed to create PNG blob"));return}a({imageData:G,pngBlob:p})},"image/png")},r.onerror=()=>n(new Error("Failed to load image")),r.src=typeof t=="string"?t:URL.createObjectURL(t)})}function Ve(t,e,i,o,a,n){const s=i.length,r=new Int32Array(s*4);for(let m=0;m<s;m++){const u=i[m],h=u%a,d=Math.floor(u/a);r[m*4+0]=h<a-1&&t[u+1]?u+1:-1,r[m*4+1]=h>0&&t[u-1]?u-1:-1,r[m*4+2]=d>0&&t[u-a]?u-a:-1,r[m*4+3]=d<n-1&&t[u+a]?u+a:-1}return{interiorPixels:i,boundaryPixels:o,pixelCount:s,neighborIndices:r}}function ye(t,e,i,o,a){const n=ce.iterations,s=.01,r=new Float32Array(o*a),{interiorPixels:m,neighborIndices:u,pixelCount:h}=t;performance.now();const d=1.9,y=[],z=[];for(let f=0;f<h;f++){const c=m[f],g=c%o,E=Math.floor(c/o);(g+E)%2===0?y.push(f):z.push(f)}for(let f=0;f<n;f++){for(const c of y){const g=m[c],E=u[c*4+0],I=u[c*4+1],v=u[c*4+2],A=u[c*4+3];let x=0;E>=0&&(x+=r[E]),I>=0&&(x+=r[I]),v>=0&&(x+=r[v]),A>=0&&(x+=r[A]);const V=(s+x)/4;r[g]=d*V+(1-d)*r[g]}for(const c of z){const g=m[c],E=u[c*4+0],I=u[c*4+1],v=u[c*4+2],A=u[c*4+3];let x=0;E>=0&&(x+=r[E]),I>=0&&(x+=r[I]),v>=0&&(x+=r[v]),A>=0&&(x+=r[A]);const V=(s+x)/4;r[g]=d*V+(1-d)*r[g]}}const _=new Float32Array(o*a);for(let f=0;f<3;f++){_.set(r);for(let c=0;c<h;c++){const g=m[c],E=u[c*4+0],I=u[c*4+1],v=u[c*4+2],A=u[c*4+3];let x=0,V=0;E>=0&&(x+=_[E],V++),I>=0&&(x+=_[I],V++),v>=0&&(x+=_[v],V++),A>=0&&(x+=_[A],V++),r[g]=V>0?(_[g]+x/V)*.5:_[g]}}return r}const Ee={none:0,circle:1,daisy:2,diamond:3,metaballs:4};function N(t){if(Array.isArray(t))return t.length===4?t:t.length===3?[...t,1]:C;if(typeof t!="string")return C;let e,i,o,a=1;if(t.startsWith("#"))[e,i,o,a]=Ie(t);else if(t.startsWith("rgb")){const n=Be(t);if(n===null)return C;[e,i,o,a]=n}else if(t.startsWith("hsl")){const n=ze(t);if(n===null)return C;[e,i,o,a]=Me(n)}else return console.error("Unsupported color format",t),C;return[j(e,0,1),j(i,0,1),j(o,0,1),j(a,0,1)]}function Ie(t){if(t=t.replace(/^#/,""),(t.length===3||t.length===4)&&(t=t.split("").map(n=>n+n).join("")),t.length===6&&(t=t+"ff"),!/^[0-9a-f]{8}$/i.test(t))return console.warn("Invalid hex color"),C;const e=parseInt(t.slice(0,2),16)/255,i=parseInt(t.slice(2,4),16)/255,o=parseInt(t.slice(4,6),16)/255,a=parseInt(t.slice(6,8),16)/255;return[e,i,o,a]}function Be(t){const e=t.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([0-9.]+))?\s*\)$/i);return e?[parseInt(e[1]??"0")/255,parseInt(e[2]??"0")/255,parseInt(e[3]??"0")/255,e[4]===void 0?1:parseFloat(e[4])]:null}function ze(t){const e=t.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([0-9.]+))?\s*\)$/i);return e?[parseInt(e[1]??"0"),parseInt(e[2]??"0"),parseInt(e[3]??"0"),e[4]===void 0?1:parseFloat(e[4])]:null}function Me(t){const[e,i,o,a]=t,n=e/360,s=i/100,r=o/100;let m,u,h;if(i===0)m=u=h=r;else{const d=(_,f,c)=>(c<0&&(c+=1),c>1&&(c-=1),c<.16666666666666666?_+(f-_)*6*c:c<.5?f:c<.6666666666666666?_+(f-_)*(.6666666666666666-c)*6:_),y=r<.5?r*(1+s):r+s-r*s,z=2*r-y;m=d(z,y,n+1/3),u=d(z,y,n),h=d(z,y,n-1/3)}return[m,u,h,a]}const j=(t,e,i)=>Math.min(Math.max(t,e),i),C=[.5,.5,.5,1],De="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";function ke(t){const e=R.useRef(void 0),i=R.useCallback(o=>{const a=t.map(n=>{if(n!=null){if(typeof n=="function"){const s=n,r=s(o);return typeof r=="function"?r:()=>{s(null)}}return n.current=o,()=>{n.current=null}}});return()=>{a.forEach(n=>n==null?void 0:n())}},t);return R.useMemo(()=>t.every(o=>o==null)?null:o=>{e.current&&(e.current(),e.current=void 0),o!=null&&(e.current=i(o))},t)}function re(t){if(t.naturalWidth<1024&&t.naturalHeight<1024){if(t.naturalWidth<1||t.naturalHeight<1)return;const e=t.naturalWidth/t.naturalHeight;t.width=Math.round(e>1?1024*e:1024),t.height=Math.round(e>1?1024:1024/e)}}async function ne(t){const e={},i=[],o=n=>{try{return n.startsWith("/")||new URL(n),!0}catch{return!1}},a=n=>{try{return n.startsWith("/")?!1:new URL(n,window.location.origin).origin!==window.location.origin}catch{return!1}};return Object.entries(t).forEach(([n,s])=>{if(typeof s=="string"){const r=s||De;if(!o(r)){console.warn(`Uniform "${n}" has invalid URL "${r}". Skipping image loading.`);return}const m=new Promise((u,h)=>{const d=new Image;a(r)&&(d.crossOrigin="anonymous"),d.onload=()=>{re(d),e[n]=d,u()},d.onerror=()=>{console.error(`Could not set uniforms. Failed to load image at ${r}`),h()},d.src=r});i.push(m)}else if(s instanceof HTMLImageElement){const r=s.decode().then(()=>{re(s),e[n]=s});i.push(r)}else e[n]=s}),await Promise.all(i),e}const ue=R.forwardRef(function({fragmentShader:e,uniforms:i,webGlContextAttributes:o,speed:a=0,frame:n=0,width:s,height:r,minPixelRatio:m,maxPixelCount:u,mipmaps:h,style:d,...y},z){const[_,f]=R.useState(!1),c=R.useRef(null),g=R.useRef(null),E=R.useRef(o);R.useEffect(()=>((async()=>{const A=await ne(i);c.current&&!g.current&&(g.current=new ge(c.current,e,A,E.current,a,n,m,u,h),f(!0))})(),()=>{var A;(A=g.current)==null||A.dispose(),g.current=null}),[e]),R.useEffect(()=>{let v=!1;return(async()=>{var V;const x=await ne(i);v||(V=g.current)==null||V.setUniforms(x)})(),()=>{v=!0}},[i,_]),R.useEffect(()=>{var v;(v=g.current)==null||v.setSpeed(a)},[a,_]),R.useEffect(()=>{var v;(v=g.current)==null||v.setMaxPixelCount(u)},[u,_]),R.useEffect(()=>{var v;(v=g.current)==null||v.setMinPixelRatio(m)},[m,_]),R.useEffect(()=>{var v;(v=g.current)==null||v.setFrame(n)},[n,_]);const I=ke([c,z]);return $.jsx("div",{ref:I,style:s!==void 0||r!==void 0?{width:typeof s=="string"&&isNaN(+s)===!1?+s:s,height:typeof r=="string"&&isNaN(+r)===!1?+r:r,...d}:d,...y})});ue.displayName="ShaderMount";function Te(t,e){var i,o,a;if(Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t){if(n==="colors"){const s=Array.isArray(t.colors),r=Array.isArray(e.colors);if(!s||!r){if(Object.is(t.colors,e.colors)===!1)return!1;continue}if(((i=t.colors)==null?void 0:i.length)!==((o=e.colors)==null?void 0:o.length)||!((a=t.colors)!=null&&a.every((m,u)=>{var h;return m===((h=e.colors)==null?void 0:h[u])})))return!1;continue}if(Object.is(t[n],e[n])===!1)return!1}return!0}const se="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",Oe=t=>typeof t=="object"&&typeof t.then=="function",ae=[];function Ce(t,e){if(t===e)return!0;if(!t||!e)return!1;const i=t.length;if(e.length!==i)return!1;for(let o=0;o<i;o++)if(t[o]!==e[o])return!1;return!0}function Pe(t,e=null){e===null&&(e=[t]);for(const o of ae)if(Ce(e,o.keys)){if(Object.prototype.hasOwnProperty.call(o,"error"))throw o.error;if(Object.prototype.hasOwnProperty.call(o,"response"))return o.response;throw o.promise}const i={keys:e,promise:(Oe(t)?t:t(...e)).then(o=>{i.response=o}).catch(o=>i.error=o)};throw ae.push(i),i.promise}const Le=(t,e)=>Pe(t,e),U={params:{...be,scale:.6,speed:1,frame:0,colorBack:"#f0efea",colorInner:"#fafaf5",colors:["#333333","#e7e6df"],outerGlow:.55,innerGlow:1,innerDistortion:.8,outerDistortion:.6,offset:0,angle:0,size:.8,shape:"diamond"}},Fe=R.memo(function({colorBack:e=U.params.colorBack,colors:i=U.params.colors,speed:o=U.params.speed,frame:a=U.params.frame,image:n="",innerDistortion:s=U.params.innerDistortion,outerDistortion:r=U.params.outerDistortion,outerGlow:m=U.params.outerGlow,innerGlow:u=U.params.innerGlow,colorInner:h=U.params.colorInner,offset:d=U.params.offset,angle:y=U.params.angle,size:z=U.params.size,shape:_=U.params.shape,suspendWhenProcessingImage:f=!1,fit:c=U.params.fit,scale:g=U.params.scale,rotation:E=U.params.rotation,originX:I=U.params.originX,originY:v=U.params.originY,offsetX:A=U.params.offsetX,offsetY:x=U.params.offsetY,worldWidth:V=U.params.worldWidth,worldHeight:q=U.params.worldHeight,...F}){const S=typeof n=="string"?n:n.src,[P,L]=R.useState(se);let k;f&&typeof window<"u"&&S?k=Le(()=>oe(S).then(T=>URL.createObjectURL(T.pngBlob)),[S,"gemSmoke"]):k=P,R.useLayoutEffect(()=>{if(f)return;if(!S){L(se);return}let T,O=!0;return oe(S).then(G=>{O&&(T=URL.createObjectURL(G.pngBlob),L(T))}),()=>{O=!1}},[S,f]);const H={u_colors:i.map(N),u_colorsCount:i.length,u_colorBack:N(e),u_image:k,u_innerDistortion:s,u_outerDistortion:r,u_outerGlow:m,u_innerGlow:u,u_colorInner:N(h),u_offset:d,u_angle:y,u_size:z,u_isImage:!!n,u_shape:Ee[_],u_fit:Se[c],u_scale:g,u_rotation:E,u_offsetX:A,u_offsetY:x,u_originX:I,u_originY:v,u_worldWidth:V,u_worldHeight:q};return $.jsx(ue,{...F,speed:o,frame:a,fragmentShader:Ae,mipmaps:["u_image"],uniforms:H})},Te),le="(prefers-reduced-motion: reduce)",Ge={colorBack:"#c58b66",colorInner:"#8f552f",colors:["#8f552f","#e2b08c"]},We={colorBack:"#d29c78",colorInner:"#d29c78",colors:["#d29c78","#f6e2d0"]};function $e({className:t=""}){const e=de()==="dark"?We:Ge,[i,o]=R.useState(()=>window.matchMedia(le).matches);return R.useEffect(()=>{const a=window.matchMedia(le),n=s=>o(s.matches);return a.addEventListener("change",n),()=>a.removeEventListener("change",n)},[]),$.jsx(Fe,{className:t,colorBack:e.colorBack,colorInner:e.colorInner,colors:e.colors,shape:"none",innerDistortion:.9,outerDistortion:.8,outerGlow:.8,innerGlow:1,offset:0,angle:212,size:.3,speed:i?0:1,scale:1.1,fit:"cover"})}export{$e as default};
