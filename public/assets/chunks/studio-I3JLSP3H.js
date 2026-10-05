import{a as _e,b as te,c as De}from"./chunk-KZIUDBAQ.js";import{a as zo}from"./chunk-WMCSQRNI.js";import{$ as go,A as io,Aa as No,B as so,Ba as Io,C as ao,D as Mr,E as no,F as mt,G as V,H as k,I as lo,J as be,K as Sr,M as J,N as Dt,O as co,Q as uo,R as he,S as wr,T as ae,U as ee,V as fo,W as $,X as ho,Y as Cr,Z as po,_ as mo,a as Vr,b as jr,ba as vo,c as Wr,ca as xo,d as xe,da as To,ea as bo,f as Zr,fa as Eo,g as Qr,ga as Mo,h as Tr,ha as So,i as br,ia as wo,ja as Co,ka as gt,l as Xr,m as qr,ma as yo,n as Yr,o as $r,oa as Ro,p as Kr,pa as Pt,q as Xt,qa as Ao,r as Jr,ra as _o,s as eo,sa as Do,t as to,ta as Po,u as Er,ua as yr,v as pt,x as ro,xa as Uo,y as Te,ya as Ho,z as oo,za as Bo}from"./chunk-575DHTPU.js";var vt=class extends te{constructor(e,r="tDiffuse"){super(),this.textureID=r,this.uniforms=null,this.material=null,e instanceof ee?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ae.clone(e.uniforms),this.material=new ee({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new De(this.material)}render(e,r,i){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=i.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Ut=class extends te{constructor(e,r){super(),this.scene=e,this.camera=r,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,r,i){let l=e.getContext(),s=e.state;s.buffers.color.setMask(!1),s.buffers.depth.setMask(!1),s.buffers.color.setLocked(!0),s.buffers.depth.setLocked(!0);let c,u;this.inverse?(c=0,u=1):(c=1,u=0),s.buffers.stencil.setTest(!0),s.buffers.stencil.setOp(l.REPLACE,l.REPLACE,l.REPLACE),s.buffers.stencil.setFunc(l.ALWAYS,c,4294967295),s.buffers.stencil.setClear(u),s.buffers.stencil.setLocked(!0),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),s.buffers.color.setLocked(!1),s.buffers.depth.setLocked(!1),s.buffers.color.setMask(!0),s.buffers.depth.setMask(!0),s.buffers.stencil.setLocked(!1),s.buffers.stencil.setFunc(l.EQUAL,1,4294967295),s.buffers.stencil.setOp(l.KEEP,l.KEEP,l.KEEP),s.buffers.stencil.setLocked(!0)}},qt=class extends te{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var Yt=class{constructor(e,r){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),r===void 0){let i=e.getSize(new V);this._width=i.width,this._height=i.height,r=new be(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Te}),r.texture.name="EffectComposer.rt1"}else this._width=r.width,this._height=r.height;this.renderTarget1=r,this.renderTarget2=r.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new vt(_e),this.copyPass.material.blending=xe,this.clock=new Ho}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,r){this.passes.splice(r,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let r=this.passes.indexOf(e);r!==-1&&this.passes.splice(r,1)}isLastEnabledPass(e){for(let r=e+1;r<this.passes.length;r++)if(this.passes[r].enabled)return!1;return!0}render(e){e===void 0&&(e=this.clock.getDelta());let r=this.renderer.getRenderTarget(),i=!1;for(let l=0,s=this.passes.length;l<s;l++){let c=this.passes[l];if(c.enabled!==!1){if(c.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(l),c.render(this.renderer,this.writeBuffer,this.readBuffer,e,i),c.needsSwap){if(i){let u=this.renderer.getContext(),b=this.renderer.state.buffers.stencil;b.setFunc(u.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),b.setFunc(u.EQUAL,1,4294967295)}this.swapBuffers()}Ut!==void 0&&(c instanceof Ut?i=!0:c instanceof qt&&(i=!1))}}this.renderer.setRenderTarget(r)}reset(e){if(e===void 0){let r=this.renderer.getSize(new V);this._pixelRatio=this.renderer.getPixelRatio(),this._width=r.width,this._height=r.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,r){this._width=e,this._height=r;let i=this._width*this._pixelRatio,l=this._height*this._pixelRatio;this.renderTarget1.setSize(i,l),this.renderTarget2.setSize(i,l);for(let s=0;s<this.passes.length;s++)this.passes[s].setSize(i,l)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var $t=class extends te{constructor(e,r,i=null,l=null,s=null){super(),this.scene=e,this.camera=r,this.overrideMaterial=i,this.clearColor=l,this.clearAlpha=s,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new J}render(e,r,i){let l=e.autoClear;e.autoClear=!1;let s,c;this.overrideMaterial!==null&&(c=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(s=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:i),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(s),this.overrideMaterial!==null&&(this.scene.overrideMaterial=c),e.autoClear=l}};var Fo={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new J(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var xt=class p extends te{constructor(e,r=1,i,l){super(),this.strength=r,this.radius=i,this.threshold=l,this.resolution=e!==void 0?new V(e.x,e.y):new V(256,256),this.clearColor=new J(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let s=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);this.renderTargetBright=new be(s,c,{type:Te}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let f=0;f<this.nMips;f++){let m=new be(s,c,{type:Te});m.texture.name="UnrealBloomPass.h"+f,m.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(m);let M=new be(s,c,{type:Te});M.texture.name="UnrealBloomPass.v"+f,M.texture.generateMipmaps=!1,this.renderTargetsVertical.push(M),s=Math.round(s/2),c=Math.round(c/2)}let u=Fo;this.highPassUniforms=ae.clone(u.uniforms),this.highPassUniforms.luminosityThreshold.value=l,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ee({uniforms:this.highPassUniforms,vertexShader:u.vertexShader,fragmentShader:u.fragmentShader}),this.separableBlurMaterials=[];let b=[3,5,7,9,11];s=Math.round(this.resolution.x/2),c=Math.round(this.resolution.y/2);for(let f=0;f<this.nMips;f++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(b[f])),this.separableBlurMaterials[f].uniforms.invSize.value=new V(1/s,1/c),s=Math.round(s/2),c=Math.round(c/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=r,this.compositeMaterial.uniforms.bloomRadius.value=.1;let g=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=g,this.bloomTintColors=[new k(1,1,1),new k(1,1,1),new k(1,1,1),new k(1,1,1),new k(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ae.clone(_e.uniforms),this.blendMaterial=new ee({uniforms:this.copyUniforms,vertexShader:_e.vertexShader,fragmentShader:_e.fragmentShader,blending:Zr,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new J,this._oldClearAlpha=1,this._basic=new Dt,this._fsQuad=new De(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,r){let i=Math.round(e/2),l=Math.round(r/2);this.renderTargetBright.setSize(i,l);for(let s=0;s<this.nMips;s++)this.renderTargetsHorizontal[s].setSize(i,l),this.renderTargetsVertical[s].setSize(i,l),this.separableBlurMaterials[s].uniforms.invSize.value=new V(1/i,1/l),i=Math.round(i/2),l=Math.round(l/2)}render(e,r,i,l,s){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let c=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),s&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=i.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=i.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let u=this.renderTargetBright;for(let b=0;b<this.nMips;b++)this._fsQuad.material=this.separableBlurMaterials[b],this.separableBlurMaterials[b].uniforms.colorTexture.value=u.texture,this.separableBlurMaterials[b].uniforms.direction.value=p.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[b]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[b].uniforms.colorTexture.value=this.renderTargetsHorizontal[b].texture,this.separableBlurMaterials[b].uniforms.direction.value=p.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[b]),e.clear(),this._fsQuad.render(e),u=this.renderTargetsVertical[b];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,s&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=c}_getSeparableBlurMaterial(e){let r=[];for(let i=0;i<e;i++)r.push(.39894*Math.exp(-.5*i*i/(e*e))/e);return new ee({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new V(.5,.5)},direction:{value:new V(.5,.5)},gaussianCoefficients:{value:r}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}_getCompositeMaterial(e){return new ee({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}};xt.BlurDirectionX=new V(1,0);xt.BlurDirectionY=new V(0,1);var Ht={name:"BokehShader",defines:{DEPTH_PACKING:1,PERSPECTIVE_CAMERA:1},uniforms:{tColor:{value:null},tDepth:{value:null},focus:{value:1},aspect:{value:1},aperture:{value:.025},maxblur:{value:.01},nearClip:{value:1},farClip:{value:1e3}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		#include <common>

		varying vec2 vUv;

		uniform sampler2D tColor;
		uniform sampler2D tDepth;

		uniform float maxblur; // max blur amount
		uniform float aperture; // aperture - bigger values for shallower depth of field

		uniform float nearClip;
		uniform float farClip;

		uniform float focus;
		uniform float aspect;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {
			#if DEPTH_PACKING == 1
			return unpackRGBAToDepth( texture2D( tDepth, screenPosition ) );
			#else
			return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
			return perspectiveDepthToViewZ( depth, nearClip, farClip );
			#else
			return orthographicDepthToViewZ( depth, nearClip, farClip );
			#endif
		}


		void main() {

			vec2 aspectcorrect = vec2( 1.0, aspect );

			float viewZ = getViewZ( getDepth( vUv ) );

			float factor = ( focus + viewZ ); // viewZ is <= 0, so this is a difference equation

			vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );

			vec2 dofblur9 = dofblur * 0.9;
			vec2 dofblur7 = dofblur * 0.7;
			vec2 dofblur4 = dofblur * 0.4;

			vec4 col = vec4( 0.0 );

			col += texture2D( tColor, vUv.xy );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );

			col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );
			col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );

			gl_FragColor = col / 41.0;
			gl_FragColor.a = 1.0;

		}`};var Kt=class extends te{constructor(e,r,i){super(),this.scene=e,this.camera=r;let l=i.focus!==void 0?i.focus:1,s=i.aperture!==void 0?i.aperture:.025,c=i.maxblur!==void 0?i.maxblur:1;this._renderTargetDepth=new be(1,1,{minFilter:pt,magFilter:pt,type:Te}),this._renderTargetDepth.texture.name="BokehPass.depth",this._materialDepth=new Do,this._materialDepth.depthPacking=ao,this._materialDepth.blending=xe;let u=ae.clone(Ht.uniforms);u.tDepth.value=this._renderTargetDepth.texture,u.focus.value=l,u.aspect.value=r.aspect,u.aperture.value=s,u.maxblur.value=c,u.nearClip.value=r.near,u.farClip.value=r.far,this.materialBokeh=new ee({defines:Object.assign({},Ht.defines),uniforms:u,vertexShader:Ht.vertexShader,fragmentShader:Ht.fragmentShader}),this.uniforms=u,this._fsQuad=new De(this.materialBokeh),this._oldClearColor=new J}render(e,r,i){this.scene.overrideMaterial=this._materialDepth,e.getClearColor(this._oldClearColor);let l=e.getClearAlpha(),s=e.autoClear;e.autoClear=!1,e.setClearColor(16777215),e.setClearAlpha(1),e.setRenderTarget(this._renderTargetDepth),e.clear(),e.render(this.scene,this.camera),this.uniforms.tColor.value=i.texture,this.uniforms.nearClip.value=this.camera.near,this.uniforms.farClip.value=this.camera.far,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),e.clear(),this._fsQuad.render(e)),this.scene.overrideMaterial=null,e.setClearColor(this._oldClearColor),e.setClearAlpha(l),e.autoClear=s}setSize(e,r){this.materialBokeh.uniforms.aspect.value=e/r,this._renderTargetDepth.setSize(e,r)}dispose(){this._renderTargetDepth.dispose(),this._materialDepth.dispose(),this.materialBokeh.dispose(),this._fsQuad.dispose()}};var Bt={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var Jt=class extends te{constructor(){super(),this.uniforms=ae.clone(Bt.uniforms),this.material=new Ro({name:Bt.name,uniforms:this.uniforms,vertexShader:Bt.vertexShader,fragmentShader:Bt.fragmentShader}),this._fsQuad=new De(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,r,i){this.uniforms.tDiffuse.value=i.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},lo.getTransfer(this._outputColorSpace)===no&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Yr?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===$r?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Kr?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Xt?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===eo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===to?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Jr&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var er=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let r=0;r<256;r++)this.p[r]=Math.floor(e.random()*256);this.perm=[];for(let r=0;r<512;r++)this.perm[r]=this.p[r&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,r){let i,l,s,c=.5*(Math.sqrt(3)-1),u=(e+r)*c,b=Math.floor(e+u),g=Math.floor(r+u),f=(3-Math.sqrt(3))/6,m=(b+g)*f,M=b-m,T=g-m,E=e-M,_=r-T,X,re;E>_?(X=1,re=0):(X=0,re=1);let D=E-X+f,G=_-re+f,N=E-1+2*f,O=_-1+2*f,h=b&255,I=g&255,z=this.perm[h+this.perm[I]]%12,S=this.perm[h+X+this.perm[I+re]]%12,w=this.perm[h+1+this.perm[I+1]]%12,R=.5-E*E-_*_;R<0?i=0:(R*=R,i=R*R*this._dot(this.grad3[z],E,_));let P=.5-D*D-G*G;P<0?l=0:(P*=P,l=P*P*this._dot(this.grad3[S],D,G));let K=.5-N*N-O*O;return K<0?s=0:(K*=K,s=K*K*this._dot(this.grad3[w],N,O)),70*(i+l+s)}noise3d(e,r,i){let l,s,c,u,g=(e+r+i)*.3333333333333333,f=Math.floor(e+g),m=Math.floor(r+g),M=Math.floor(i+g),T=1/6,E=(f+m+M)*T,_=f-E,X=m-E,re=M-E,D=e-_,G=r-X,N=i-re,O,h,I,z,S,w;D>=G?G>=N?(O=1,h=0,I=0,z=1,S=1,w=0):D>=N?(O=1,h=0,I=0,z=1,S=0,w=1):(O=0,h=0,I=1,z=1,S=0,w=1):G<N?(O=0,h=0,I=1,z=0,S=1,w=1):D<N?(O=0,h=1,I=0,z=0,S=1,w=1):(O=0,h=1,I=0,z=1,S=1,w=0);let R=D-O+T,P=G-h+T,K=N-I+T,Ge=D-z+2*T,tt=G-S+2*T,Ue=N-w+2*T,Oe=D-1+3*T,He=G-1+3*T,H=N-1+3*T,q=f&255,Ve=m&255,j=M&255,de=this.perm[q+this.perm[Ve+this.perm[j]]]%12,pe=this.perm[q+O+this.perm[Ve+h+this.perm[j+I]]]%12,je=this.perm[q+z+this.perm[Ve+S+this.perm[j+w]]]%12,at=this.perm[q+1+this.perm[Ve+1+this.perm[j+1]]]%12,Ee=.6-D*D-G*G-N*N;Ee<0?l=0:(Ee*=Ee,l=Ee*Ee*this._dot3(this.grad3[de],D,G,N));let ce=.6-R*R-P*P-K*K;ce<0?s=0:(ce*=ce,s=ce*ce*this._dot3(this.grad3[pe],R,P,K));let Y=.6-Ge*Ge-tt*tt-Ue*Ue;Y<0?c=0:(Y*=Y,c=Y*Y*this._dot3(this.grad3[je],Ge,tt,Ue));let Me=.6-Oe*Oe-He*He-H*H;return Me<0?u=0:(Me*=Me,u=Me*Me*this._dot3(this.grad3[at],Oe,He,H)),32*(l+s+c+u)}noise4d(e,r,i,l){let s=this.grad4,c=this.simplex,u=this.perm,b=(Math.sqrt(5)-1)/4,g=(5-Math.sqrt(5))/20,f,m,M,T,E,_=(e+r+i+l)*b,X=Math.floor(e+_),re=Math.floor(r+_),D=Math.floor(i+_),G=Math.floor(l+_),N=(X+re+D+G)*g,O=X-N,h=re-N,I=D-N,z=G-N,S=e-O,w=r-h,R=i-I,P=l-z,K=S>w?32:0,Ge=S>R?16:0,tt=w>R?8:0,Ue=S>P?4:0,Oe=w>P?2:0,He=R>P?1:0,H=K+Ge+tt+Ue+Oe+He,q=c[H][0]>=3?1:0,Ve=c[H][1]>=3?1:0,j=c[H][2]>=3?1:0,de=c[H][3]>=3?1:0,pe=c[H][0]>=2?1:0,je=c[H][1]>=2?1:0,at=c[H][2]>=2?1:0,Ee=c[H][3]>=2?1:0,ce=c[H][0]>=1?1:0,Y=c[H][1]>=1?1:0,Me=c[H][2]>=1?1:0,Et=c[H][3]>=1?1:0,me=S-q+g,Se=w-Ve+g,Mt=R-j+g,nt=P-de+g,rt=S-pe+2*g,lt=w-je+2*g,ct=R-at+2*g,St=P-Ee+2*g,wt=S-ce+3*g,L=w-Y+3*g,We=R-Me+3*g,Ze=P-Et+3*g,ge=S-1+4*g,Qe=w-1+4*g,Be=R-1+4*g,oe=P-1+4*g,we=X&255,ot=re&255,Ne=D&255,Xe=G&255,tr=u[we+u[ot+u[Ne+u[Xe]]]]%32,ue=u[we+q+u[ot+Ve+u[Ne+j+u[Xe+de]]]]%32,Ct=u[we+pe+u[ot+je+u[Ne+at+u[Xe+Ee]]]]%32,it=u[we+ce+u[ot+Y+u[Ne+Me+u[Xe+Et]]]]%32,Ce=u[we+1+u[ot+1+u[Ne+1+u[Xe+1]]]]%32,qe=.6-S*S-w*w-R*R-P*P;qe<0?f=0:(qe*=qe,f=qe*qe*this._dot4(s[tr],S,w,R,P));let ye=.6-me*me-Se*Se-Mt*Mt-nt*nt;ye<0?m=0:(ye*=ye,m=ye*ye*this._dot4(s[ue],me,Se,Mt,nt));let Re=.6-rt*rt-lt*lt-ct*ct-St*St;Re<0?M=0:(Re*=Re,M=Re*Re*this._dot4(s[Ct],rt,lt,ct,St));let W=.6-wt*wt-L*L-We*We-Ze*Ze;W<0?T=0:(W*=W,T=W*W*this._dot4(s[it],wt,L,We,Ze));let Ye=.6-ge*ge-Qe*Qe-Be*Be-oe*oe;return Ye<0?E=0:(Ye*=Ye,E=Ye*Ye*this._dot4(s[Ce],ge,Qe,Be,oe)),27*(f+m+M+T+E)}_dot(e,r,i){return e[0]*r+e[1]*i}_dot3(e,r,i,l){return e[0]*r+e[1]*i+e[2]*l}_dot4(e,r,i,l,s){return e[0]*r+e[1]*i+e[2]*l+e[3]*s}};var Nt={name:"SSAOShader",defines:{PERSPECTIVE_CAMERA:1,KERNEL_SIZE:32},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},kernel:{value:null},cameraNear:{value:null},cameraFar:{value:null},resolution:{value:new V},cameraProjectionMatrix:{value:new Sr},cameraInverseProjectionMatrix:{value:new Sr},kernelRadius:{value:8},minDistance:{value:.005},maxDistance:{value:.05}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;

		uniform vec3 kernel[ KERNEL_SIZE ];

		uniform vec2 resolution;

		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;

		uniform float kernelRadius;
		uniform float minDistance; // avoid artifacts caused by neighbour fragments with minimal depth difference
		uniform float maxDistance; // avoid the influence of fragments which are too far away

		varying vec2 vUv;

		#include <packing>

		float getDepth( const in vec2 screenPosition ) {

			return texture2D( tDepth, screenPosition ).x;

		}

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		float getViewZ( const in float depth ) {

			#if PERSPECTIVE_CAMERA == 1

				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );

			#else

				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );

			#endif

		}

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {

			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];

			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );

			clipPosition *= clipW; // unprojection.

			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;

		}

		vec3 getViewNormal( const in vec2 screenPosition ) {

			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );

		}

		void main() {

			float depth = getDepth( vUv );

			if ( depth == 1.0 ) {

				gl_FragColor = vec4( 1.0 ); // don't influence background

			} else {

				float viewZ = getViewZ( depth );

				vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
				vec3 viewNormal = getViewNormal( vUv );

				vec2 noiseScale = vec2( resolution.x / 4.0, resolution.y / 4.0 );
				vec3 random = vec3( texture2D( tNoise, vUv * noiseScale ).r );

				// compute matrix used to reorient a kernel vector

				vec3 tangent = normalize( random - viewNormal * dot( random, viewNormal ) );
				vec3 bitangent = cross( viewNormal, tangent );
				mat3 kernelMatrix = mat3( tangent, bitangent, viewNormal );

				float occlusion = 0.0;

				for ( int i = 0; i < KERNEL_SIZE; i ++ ) {

					vec3 sampleVector = kernelMatrix * kernel[ i ]; // reorient sample vector in view space
					vec3 samplePoint = viewPosition + ( sampleVector * kernelRadius ); // calculate sample point

					vec4 samplePointNDC = cameraProjectionMatrix * vec4( samplePoint, 1.0 ); // project point and calculate NDC
					samplePointNDC /= samplePointNDC.w;

					vec2 samplePointUv = samplePointNDC.xy * 0.5 + 0.5; // compute uv coordinates

					float realDepth = getLinearDepth( samplePointUv ); // get linear depth from depth texture
					float sampleDepth = viewZToOrthographicDepth( samplePoint.z, cameraNear, cameraFar ); // compute linear depth of the sample view Z value
					float delta = sampleDepth - realDepth;

					if ( delta > minDistance && delta < maxDistance ) { // if fragment is before sample point, increase occlusion

						occlusion += 1.0;

					}

				}

				occlusion = clamp( occlusion / float( KERNEL_SIZE ), 0.0, 1.0 );

				gl_FragColor = vec4( vec3( 1.0 - occlusion ), 1.0 );

			}

		}`},It={name:"SSAODepthShader",defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDepth;

		uniform float cameraNear;
		uniform float cameraFar;

		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {

			#if PERSPECTIVE_CAMERA == 1

				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

			#else

				return texture2D( tDepth, screenPosition ).x;

			#endif

		}

		void main() {

			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},zt={name:"SSAOBlurShader",uniforms:{tDiffuse:{value:null},resolution:{value:new V}},vertexShader:`varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`uniform sampler2D tDiffuse;

		uniform vec2 resolution;

		varying vec2 vUv;

		void main() {

			vec2 texelSize = ( 1.0 / resolution );
			float result = 0.0;

			for ( int i = - 2; i <= 2; i ++ ) {

				for ( int j = - 2; j <= 2; j ++ ) {

					vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;
					result += texture2D( tDiffuse, vUv + offset ).r;

				}

			}

			gl_FragColor = vec4( vec3( result / ( 5.0 * 5.0 ) ), 1.0 );

		}`};var Ft=class p extends te{constructor(e,r,i=512,l=512,s=32){super(),this.width=i,this.height=l,this.clear=!0,this.needsSwap=!1,this.camera=r,this.scene=e,this.kernelRadius=8,this.kernel=[],this.noiseTexture=null,this.output=0,this.minDistance=.005,this.maxDistance=.1,this._visibilityCache=[],this._generateSampleKernel(s),this._generateRandomKernelRotations();let c=new To;c.format=io,c.type=oo,this.normalRenderTarget=new be(this.width,this.height,{minFilter:pt,magFilter:pt,type:Te,depthTexture:c}),this.ssaoRenderTarget=new be(this.width,this.height,{type:Te}),this.blurRenderTarget=this.ssaoRenderTarget.clone(),this.ssaoMaterial=new ee({defines:Object.assign({},Nt.defines),uniforms:ae.clone(Nt.uniforms),vertexShader:Nt.vertexShader,fragmentShader:Nt.fragmentShader,blending:xe}),this.ssaoMaterial.defines.KERNEL_SIZE=s,this.ssaoMaterial.uniforms.tNormal.value=this.normalRenderTarget.texture,this.ssaoMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.ssaoMaterial.uniforms.tNoise.value=this.noiseTexture,this.ssaoMaterial.uniforms.kernel.value=this.kernel,this.ssaoMaterial.uniforms.cameraNear.value=this.camera.near,this.ssaoMaterial.uniforms.cameraFar.value=this.camera.far,this.ssaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.normalMaterial=new _o,this.normalMaterial.blending=xe,this.blurMaterial=new ee({defines:Object.assign({},zt.defines),uniforms:ae.clone(zt.uniforms),vertexShader:zt.vertexShader,fragmentShader:zt.fragmentShader}),this.blurMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.blurMaterial.uniforms.resolution.value.set(this.width,this.height),this.depthRenderMaterial=new ee({defines:Object.assign({},It.defines),uniforms:ae.clone(It.uniforms),vertexShader:It.vertexShader,fragmentShader:It.fragmentShader,blending:xe}),this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture,this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new ee({uniforms:ae.clone(_e.uniforms),vertexShader:_e.vertexShader,fragmentShader:_e.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:qr,blendDst:br,blendEquation:Tr,blendSrcAlpha:Xr,blendDstAlpha:br,blendEquationAlpha:Tr}),this._fsQuad=new De(null),this._originalClearColor=new J}dispose(){this.normalRenderTarget.dispose(),this.ssaoRenderTarget.dispose(),this.blurRenderTarget.dispose(),this.normalMaterial.dispose(),this.blurMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}render(e,r,i){switch(this._overrideVisibility(),this._renderOverride(e,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility(),this.ssaoMaterial.uniforms.kernelRadius.value=this.kernelRadius,this.ssaoMaterial.uniforms.minDistance.value=this.minDistance,this.ssaoMaterial.uniforms.maxDistance.value=this.maxDistance,this._renderPass(e,this.ssaoMaterial,this.ssaoRenderTarget),this._renderPass(e,this.blurMaterial,this.blurRenderTarget),this.output){case p.OUTPUT.SSAO:this.copyMaterial.uniforms.tDiffuse.value=this.ssaoRenderTarget.texture,this.copyMaterial.blending=xe,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case p.OUTPUT.Blur:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=xe,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case p.OUTPUT.Depth:this._renderPass(e,this.depthRenderMaterial,this.renderToScreen?null:i);break;case p.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=xe,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;case p.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=this.blurRenderTarget.texture,this.copyMaterial.blending=Qr,this._renderPass(e,this.copyMaterial,this.renderToScreen?null:i);break;default:console.warn("THREE.SSAOPass: Unknown output type.")}}setSize(e,r){this.width=e,this.height=r,this.ssaoRenderTarget.setSize(e,r),this.normalRenderTarget.setSize(e,r),this.blurRenderTarget.setSize(e,r),this.ssaoMaterial.uniforms.resolution.value.set(e,r),this.ssaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.ssaoMaterial.uniforms.cameraInverseProjectionMatrix.value.copy(this.camera.projectionMatrixInverse),this.blurMaterial.uniforms.resolution.value.set(e,r)}_renderPass(e,r,i,l,s){e.getClearColor(this._originalClearColor);let c=e.getClearAlpha(),u=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,l!=null&&(e.setClearColor(l),e.setClearAlpha(s||0),e.clear()),this._fsQuad.material=r,this._fsQuad.render(e),e.autoClear=u,e.setClearColor(this._originalClearColor),e.setClearAlpha(c)}_renderOverride(e,r,i,l,s){e.getClearColor(this._originalClearColor);let c=e.getClearAlpha(),u=e.autoClear;e.setRenderTarget(i),e.autoClear=!1,l=r.clearColor||l,s=r.clearAlpha||s,l!=null&&(e.setClearColor(l),e.setClearAlpha(s||0),e.clear()),this.scene.overrideMaterial=r,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=u,e.setClearColor(this._originalClearColor),e.setClearAlpha(c)}_generateSampleKernel(e){let r=this.kernel;for(let i=0;i<e;i++){let l=new k;l.x=Math.random()*2-1,l.y=Math.random()*2-1,l.z=Math.random(),l.normalize();let s=i/e;s=mt.lerp(.1,1,s*s),l.multiplyScalar(s),r.push(l)}}_generateRandomKernelRotations(){let i=new er,l=16,s=new Float32Array(l);for(let c=0;c<l;c++){let u=Math.random()*2-1,b=Math.random()*2-1,g=0;s[c]=i.noise3d(u,b,g)}this.noiseTexture=new po(s,4,4,so,ro),this.noiseTexture.wrapS=Er,this.noiseTexture.wrapT=Er,this.noiseTexture.needsUpdate=!0}_overrideVisibility(){let e=this.scene,r=this._visibilityCache;e.traverse(function(i){(i.isPoints||i.isLine||i.isLine2)&&i.visible&&(i.visible=!1,r.push(i))})}_restoreVisibility(){let e=this._visibilityCache;for(let r=0;r<e.length;r++)e[r].visible=!0;e.length=0}};Ft.OUTPUT={Default:0,SSAO:1,Blur:2,Depth:3,Normal:4};function ko(p,e=!1){let r=p[0].index!==null,i=new Set(Object.keys(p[0].attributes)),l=new Set(Object.keys(p[0].morphAttributes)),s={},c={},u=p[0].morphTargetsRelative,b=new uo,g=0;for(let f=0;f<p.length;++f){let m=p[f],M=0;if(r!==(m.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+f+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let T in m.attributes){if(!i.has(T))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+f+'. All geometries must have compatible attributes; make sure "'+T+'" attribute exists among all geometries, or in none of them.'),null;s[T]===void 0&&(s[T]=[]),s[T].push(m.attributes[T]),M++}if(M!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+f+". Make sure all geometries have the same number of attributes."),null;if(u!==m.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+f+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let T in m.morphAttributes){if(!l.has(T))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+f+".  .morphAttributes must be consistent throughout all geometries."),null;c[T]===void 0&&(c[T]=[]),c[T].push(m.morphAttributes[T])}if(e){let T;if(r)T=m.index.count;else if(m.attributes.position!==void 0)T=m.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+f+". The geometry must have either an index or a position attribute"),null;b.addGroup(g,T,f),g+=T}}if(r){let f=0,m=[];for(let M=0;M<p.length;++M){let T=p[M].index;for(let E=0;E<T.count;++E)m.push(T.getX(E)+f);f+=p[M].attributes.position.count}b.setIndex(m)}for(let f in s){let m=Lo(s[f]);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+f+" attribute."),null;b.setAttribute(f,m)}for(let f in c){let m=c[f][0].length;if(m===0)break;b.morphAttributes=b.morphAttributes||{},b.morphAttributes[f]=[];for(let M=0;M<m;++M){let T=[];for(let _=0;_<c[f].length;++_)T.push(c[f][_][M]);let E=Lo(T);if(!E)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+f+" morphAttribute."),null;b.morphAttributes[f].push(E)}}return b}function Lo(p){let e,r,i,l=-1,s=0;for(let g=0;g<p.length;++g){let f=p[g];if(e===void 0&&(e=f.array.constructor),e!==f.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(r===void 0&&(r=f.itemSize),r!==f.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=f.normalized),i!==f.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(l===-1&&(l=f.gpuType),l!==f.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=f.count*r}let c=new e(s),u=new co(c,r,i),b=0;for(let g=0;g<p.length;++g){let f=p[g];if(f.isInterleavedBufferAttribute){let m=b/r;for(let M=0,T=f.count;M<T;M++)for(let E=0;E<r;E++){let _=f.getComponent(M,E);u.setComponent(M+m,E,_)}}else c.set(f.array,b);b+=f.count*r}return l!==void 0&&(u.gpuType=l),u}var x=p=>document.querySelector(p),Rr=matchMedia("(prefers-reduced-motion: reduce)"),Lt=!1,ke=()=>Rr.matches||Lt,Tt=()=>innerWidth<1e3,Go=mt.clamp,bt=mt.lerp,Pe=(p,e,r)=>mt.smoothstep(r,p,e),U;try{let p=document.createElement("canvas");if(p.setAttribute("aria-hidden","true"),!window.WebGL2RenderingContext)throw new Error("WebGL 2 is unavailable");U=new Io({canvas:p,antialias:!0,alpha:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1})}catch{x("#loading").hidden=!0,x("#graphics-message").hidden=!1,x("#render-status").textContent="3D UNAVAILABLE",document.body.classList.add("graphics-unavailable");for(let e of document.querySelectorAll(".studio-tools button,.studio-tools input,#quality"))e.disabled=!0}U&&(Ko(),document.body.classList.add("studio-ready"));function Ko(){U.setPixelRatio(Math.min(devicePixelRatio,1)),U.setSize(innerWidth,innerHeight),U.shadowMap.enabled=!0,U.shadowMap.autoUpdate=!1,U.shadowMap.type=Vr,U.toneMapping=Xt,U.toneMappingExposure=1.02,U.outputColorSpace=Mr,x("#stage").appendChild(U.domElement);let p=new Cr;p.background=new J("#0a0a0a"),p.fog=new ho("#0a0a0a",.022);let e=new fo(36,innerWidth/innerHeight,.1,80),r=new $;p.add(r);let i=new $;r.add(i);let l=[],s=[],c=-1,u=-1,b=`
  float h3(vec3 p){p=fract(p*0.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
  float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
  `;function g(t,a=.7,o=0,n={}){let v=new Ao({color:t,roughness:a,metalness:0,...n});return v.onBeforeCompile=d=>{d.vertexShader=d.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vLocal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLocal=position;`),d.fragmentShader=d.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vLocal;
${b}`).replace("#include <color_fragment>",`#include <color_fragment>
        float fiber=n3(vLocal*vec3(200.,650.,320.));
        float cloud=n3(vLocal*22.);
        float scratch=pow(n3(vLocal*vec3(8.,900.,140.)),18.);
        diffuseColor.rgb *= .97 + .055*fiber + .025*cloud;
        diffuseColor.rgb += scratch*.02;
      `).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor=clamp(roughnessFactor+(fiber-.5)*.075+scratch*.09,.04,1.);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
normal=normalize(normal+vec3(dFdx(fiber),dFdy(fiber),0.)*${o===1?".012":".026"});`)},v.customProgramCacheKey=()=>`paper-${o}`,v}let f=g("#e3d7ba",.69),m=g("#c6b694",.9),M=g("#bb7025",.51,0,{clearcoat:.24,clearcoatRoughness:.48}),T=g("#242820",.82),E=g("#89704b",.98),_=g("#747771",.29,1,{metalness:.92,anisotropy:.65}),X=g("#232723",.38,1,{metalness:.8}),re=g("#11170f",.95),D=g("#eee9d8",.12,1,{transmission:.93,thickness:.07,ior:1.47,transparent:!0,opacity:.36,clearcoat:1}),G=new Pt({color:"#1d2921",roughness:.8}),N=new Pt({color:"#ebbd67",emissive:"#e8a33d",emissiveIntensity:2}),O=new Map;function h(t,a,o,n,v,d=0,C=0,se=0,Z=.018){let y=[t,a,o,Z].join();O.has(y)||O.set(y,new zo(t,a,o,2,Math.min(Z,t/4,a/4,o/4)));let A=new he(O.get(y),n);return A.position.set(d,C,se),A.castShadow=!0,A.receiveShadow=!0,v.add(A),t*a*o<1e-4&&l.push(A),A}function I(t,a,o,n,v,d,C,se=40){let Z=new he(new bo(t,t,a,se),o);return Z.position.set(v,d,C),Z.castShadow=!0,Z.receiveShadow=!0,n.add(Z),Z}function z(t,a,o){let n=new $;return n.name=t,n.userData={spec:a,offset:new k(...o),index:s.length},i.add(n),s.push(n),n}let S=z("Main packaging body","2.2 mm wrapped rigid board",[0,-.25,0]),w=z("Outer panels","Wrapped edges / 0.8 mm reveal",[-.8,.25,0]),R=z("Inner tray","Die-cut cavity / 18 mm depth",[0,1.05,0]),P=z("Product support structure","Folded board / load-spreading ribs",[0,1.8,0]),K=z("Inserts and separators","Removable / interlocking tabs",[0,2.55,0]),Ge=z("Folding flaps","Scored hinge / 110\xB0 opening",[0,3.3,-.1]),tt=z("Finishing layers","Satin wrap / clear presentation window",[0,4.05,0]),Ue=z("Digital information display","Presentation module / live local state",[2.6,.5,.2]);h(4,.12,3,m,S,0,0,0),h(4,1.12,.105,f,S,0,.6,1.45),h(4,1.12,.105,f,S,0,.6,-1.45);for(let t of[-1.95,1.95])h(.105,1.12,2.85,f,S,t,.6,0),h(.012,.95,2.72,m,S,t-Math.sign(t)*.064,.61,0);h(3.75,.035,2.76,T,S,0,.084,0);for(let t of[-1.83,1.83])for(let a of[-1.32,1.32])h(.15,.92,.15,E,S,t,.54,a),h(.2,.035,.2,m,S,t,1.04,a);for(let t of[-1.51,1.51])h(3.89,.015,.008,m,S,0,.19,t),h(3.89,.012,.009,m,S,0,1.1,t);h(.035,1.1,2.96,M,w,-2.018,.6,0),h(4.065,.21,.05,M,w,0,.195,1.512),h(4.065,.21,.05,M,w,0,.195,-1.512);for(let t=0;t<32;t++)h(.011,.17,.003,m,w,-1.7+t*.043,.195,1.54,.001);for(let t of[-1.98,1.98])h(.025,.89,.012,m,w,t,.65,1.515,.001);function Oe(t,a,o,n,v,d){t.moveTo(a+d,o),t.lineTo(a+n-d,o),t.quadraticCurveTo(a+n,o,a+n,o+d),t.lineTo(a+n,o+v-d),t.quadraticCurveTo(a+n,o+v,a+n-d,o+v),t.lineTo(a+d,o+v),t.quadraticCurveTo(a,o+v,a,o+v-d),t.lineTo(a,o+d),t.quadraticCurveTo(a,o,a+d,o)}let He=new wo;Oe(He,-1.83,-1.3,3.66,2.6,.07);for(let[t,a]of[[-1.59,1.02],[-.33,.86],[.77,.86]]){let o=new So;Oe(o,t,-.92,a,1.84,.12),He.holes.push(o)}let H=new he(new Co(He,{depth:.18,bevelEnabled:!0,bevelThickness:.025,bevelSize:.014,bevelSegments:2,steps:1,curveSegments:16}),T);H.rotation.x=-Math.PI/2,H.position.y=.47,H.castShadow=!0,H.receiveShadow=!0,R.add(H);for(let t=0;t<4;t++)h(3.55,.013,.015,m,R,0,.47-t*.043,1.304,.002);for(let t of[-1.62,-.43,.64,1.65])h(.055,.31,2.48,m,P,t,.27,0);for(let t of[-1.15,1.15])h(3.4,.31,.065,m,P,0,.27,t);for(let t of[-1.5,-.24,.84])h(.69,.085,1.63,E,K,t+.32,.19,0),h(.67,.18,.035,m,K,t+.32,.32,-.75),h(.67,.18,.035,m,K,t+.32,.32,.75);let q=new $;R.add(q);let Ve=I(.34,.62,D,q,-1.06,.77,0);I(.345,.12,X,q,-1.06,1.12,0),I(.26,.5,M,q,-1.06,.7,0);for(let t of[.12,1.2])h(.62,.42,1.45,f,q,t,.54,0,.04),h(.625,.09,1.455,M,q,t,.47,0,.01),h(.32,.012,.58,T,q,t,.758,0,.002);let j=new $;j.position.set(0,1.19,-1.48),Ge.add(j),h(4.1,.115,3.08,f,j,0,.04,1.5,.035),h(3.9,.022,2.88,m,j,0,-.027,1.5,.01);let de=new $,pe=new $;de.position.set(-1.91,.84,0),pe.position.set(1.91,.84,0),Ge.add(de,pe),h(.55,.034,2.57,m,de,.27,0,0,.013),h(.55,.034,2.57,m,pe,-.27,0,0,.013);for(let t of[-.92,-.65,-.38,-.11,.16,.43,.7,.97])h(.006,.008,.16,E,de,0,.02,t,.001),h(.006,.008,.16,E,pe,0,.02,t,.001);for(let t of[-1.7,1.7])h(.21,.04,.12,T,j,t,-.04,.035),h(.21,.07,.14,T,S,t,1.14,-1.46);function je(t,a=1024,o=768){let n=document.createElement("canvas");n.width=a,n.height=o,t(n.getContext("2d"),a,o);let v=new xo(n);return v.colorSpace=Mr,v.anisotropy=Math.min(8,U.capabilities.getMaxAnisotropy()),v}let at=je((t,a,o)=>{t.fillStyle="#e1d5b8",t.fillRect(0,0,a,o),t.fillStyle="#b47b33",t.fillRect(0,0,125,o),t.strokeStyle="#5d654c",t.lineWidth=2,t.strokeRect(165,46,a-210,o-92),t.fillStyle="#273021",t.font="22px Arial",t.fillText("M A T E R I A L   /   F O R M   /   P U R P O S E",210,105),t.font="bold 104px Arial",t.fillText("STRUCTURE",205,285),t.fillText("& SUBSTANCE",205,390),t.font="22px Arial",t.fillText("RIGID PRESENTATION SYSTEM",210,455),t.fillStyle="#72735b",t.font="18px Arial",t.fillText("01    /    320 \xD7 240 \xD7 110 MM",210,655),t.strokeStyle="#85866b",t.lineWidth=1;for(let v=0;v<18;v++)t.beginPath(),t.moveTo(800+v*5,520),t.lineTo(800+v*5,656),t.stroke();t.save(),t.translate(73,710),t.rotate(-Math.PI/2),t.fillStyle="#28291d",t.font="bold 24px Arial",t.fillText("PRECISION IN EVERY FOLD",0,0),t.restore();let n=17;for(let v=0;v<16e3;v++){n=n*1664525+1013904223>>>0;let d=n%a;n=n*1664525+1013904223>>>0;let C=n%o;t.fillStyle=v%2?"#ffffff09":"#322d2308",t.fillRect(d,C,1,2)}}),Ee=g("#ffffff",.64,0,{map:at,clearcoat:.15,clearcoatRoughness:.55}),ce=new he(new gt(4.04,3.02),Ee);ce.rotation.x=-Math.PI/2,ce.position.set(0,.1,1.5),j.add(ce);let Y=new $;Y.position.copy(j.position),tt.add(Y),h(4.115,.012,3.09,D,Y,0,.115,1.5,.005),h(.015,.105,3.09,D,Y,-2.05,.065,1.5,.004),h(.015,.105,3.09,D,Y,2.05,.065,1.5,.004);for(let t=0;t<9;t++){let a=h(.22+t*.012,.001,.002,D,Y,1.55-t*.015,.123,.4+t*.045,3e-4);a.rotation.y=.4}let Me=je((t,a,o)=>{t.clearRect(0,0,a,o),t.fillStyle="#343b2b",t.font="30px Arial",t.fillText("PRESENTATION SERIES",30,55),t.font="18px Arial",t.fillText("WRAPPED BOARD   /   REMOVABLE INSERT",30,91),t.fillRect(725,30,2,62),t.font="42px Arial",t.fillText("01",758,77)},1024,128),Et=new he(new gt(3.1,.38),new Pt({map:Me,transparent:!0,roughness:.8,depthWrite:!1}));Et.position.set(0,.75,1.511),S.add(Et);let me=new $;me.position.set(2.25,.2,.85),me.rotation.y=-.16,Ue.add(me),h(.91,.095,.63,X,me,0,-.09,0),h(.07,.57,.08,_,me,0,.21,-.1);let Se=new $;Se.position.set(0,.58,0),Se.rotation.x=-.2,me.add(Se),h(1,.76,.08,X,Se,0,0,0,.035);let Mt,nt,rt=je(t=>{nt=t,Mt=t.canvas},768,512),lt=new he(new gt(.92,.65),new Pt({map:rt,emissiveMap:rt,emissive:"#fff4ce",emissiveIntensity:.55,roughness:.37}));lt.position.z=.047,Se.add(lt);function ct(t,a,o){let n=nt;n.fillStyle="#111a14",n.fillRect(0,0,768,512),n.fillStyle="#e8ac59",n.font="bold 29px Arial",n.fillText("PACKAGING / LIVE STUDY",35,51),n.fillStyle="#849a83",n.fillRect(35,73,698,1),[["DIMENSIONS",a?"440 \xD7 240 \xD7 110 MM":"320 \xD7 240 \xD7 110 MM"],["TYPE",a?"PRESENTATION":"COMPACT RIGID"],["MATERIAL","WRAPPED BOARD"],["QUANTITY","01 UNIT"],["PRODUCTION","DESIGN STUDY"],["FINISH","MATTE / SATIN"],["STRUCTURE",t?"OPEN / DISPLAY":"CLOSED / PROTECTED"]].forEach((d,C)=>{n.fillStyle="#7f927e",n.font="21px Arial",n.fillText(d[0],35,120+C*49),n.fillStyle="#e0dfc9",n.font="23px Arial",n.fillText(d[1],270,120+C*49)}),n.fillStyle="#e8ac59",n.font="18px Arial",n.fillText(`CAPTURE ${String(o).padStart(2,"0")}   \u2022   LOCAL PREVIEW`,35,487),rt.needsUpdate=!0}ct(!1,!1,0);for(let t of[-.455,.455])for(let a of[-.335,.335]){let o=I(.018,.014,_,Se,t,a,.049,16);o.rotation.x=Math.PI/2}h(.12,.025,.025,re,me,.38,-.09,.325,.003);let St=new Mo([new k(2.25,.04,.65),new k(2.5,-.08,.45),new k(1.8,-.13,-.25),new k(1.82,.28,-1.43)]),wt=new he(new yo(St,36,.018,8,!1),re);Ue.add(wt);let L=new $;r.add(L),L.visible=!1,h(4.8,.2,3.8,E,L,0,-.25,0);for(let t of[-2.33,2.33])h(.16,1.66,3.8,E,L,t,.5,0);for(let t of[-1.82,1.82])h(4.56,1.66,.16,E,L,0,.5,t);for(let t of[-2.15,2.15])for(let a of[-1.63,1.63]){h(.17,1.6,.17,T,L,t,.51,a);for(let o of[-.13,1.1])h(.31,.085,.31,_,L,t,o,a),I(.042,.035,X,L,t,o+.055,a,16)}for(let t=0;t<64;t++){let a=-2.2+t*.07;h(.033,.032,.1,m,L,a,1.347,1.82,.004),h(.033,.032,.1,m,L,a,1.347,-1.82,.004)}let We=new $,Ze=new $;We.position.set(-2.4,1.33,0),Ze.position.set(2.4,1.33,0),L.add(We,Ze),h(1.6,.055,3.75,E,We,.8,0,0),h(1.6,.055,3.75,E,Ze,-.8,0,0),We.rotation.z=1.9,Ze.rotation.z=-1.9;let ge=new $;p.add(ge);let Qe=new vo(new Eo(new wr(4.12,1.4,3.1)),new go({color:"#e8a33d",transparent:!0,opacity:.65}));Qe.position.y=.6,i.add(Qe),Qe.visible=!1,h(5.8,.22,4.2,g("#292b25",.42,1,{metalness:.32}),ge,0,-.38,0,.07),h(5.56,.05,3.96,X,ge,0,-.51,0,.02);for(let t of[-2.3,2.3])for(let a of[-1.7,1.7])I(.13,.18,re,ge,t,-.59,a,24);let Be=new he(new gt(150,150),g("#151713",.5,1,{metalness:.15}));Be.rotation.x=-Math.PI/2,Be.position.y=-.7,Be.receiveShadow=!0,p.add(Be);let oe=new $;p.add(oe),oe.visible=!1;for(let t=0;t<7;t++)h(.25,7,.35,T,oe,-7+t*2.3,2,-7),h(.045,5,.05,N,oe,-6.96+t*2.3,2,-6.8,.01);h(2.1,.06,1.3,m,oe,-3.4,-.62,2.3),h(1.8,.06,1.2,E,oe,-3.6,-.55,2.2);let we=new Cr;we.background=new J("#737469");let ot=new he(new wr(30,20,30),new Dt({color:"#292e28",side:jr}));we.add(ot);function Ne(t,a,o,n,v,d){let C=new he(new gt(t,a),new Dt({color:new J(d,d*.96,d*.85),side:Wr}));C.position.set(o,n,v),C.lookAt(0,0,0),we.add(C)}Ne(9,7,-5,7,5,9),Ne(4,8,6,4,-2,5),Ne(7,2,0,9,-5,7);let Xe=new No(U),tr=Xe.fromScene(we,.06,.1,60);p.environment=tr.texture,p.environmentIntensity=.4,Xe.dispose();let ue=new yr("#fff0d3",155,35,.58,.7,1.6);ue.position.set(-3,8,6),ue.target.position.set(0,.3,0),ue.castShadow=!0,ue.shadow.mapSize.set(2048,2048),ue.shadow.bias=-3e-4,ue.shadow.normalBias=.03,ue.shadow.radius=3,p.add(ue,ue.target);let Ct=new Uo("#c3d0bb",7,5,5);Ct.position.set(5,4,3),Ct.lookAt(0,0,0),p.add(Ct);let it=new yr("#efb764",85,25,.8,.6,1.5);it.position.set(3,6,-5),it.target.position.set(0,1,0),p.add(it,it.target),p.add(new Po("#e9ead7","#141910",.5));let Ce=new Set(l),qe=0;function ye(t){for(let o of[...t.children])o.isGroup&&ye(o);let a=new Map;for(let o of t.children){if(!o.isMesh||o.isInstancedMesh||o.material.transparent||o.material.transmission>0)continue;let n=[o.geometry.uuid,o.material.uuid,o.castShadow,o.receiveShadow,Ce.has(o)].join("|");a.has(n)||a.set(n,[]),a.get(n).push(o)}for(let o of a.values()){if(o.length<2)continue;let n=o[0],v=new mo(n.geometry,n.material,o.length);v.castShadow=n.castShadow,v.receiveShadow=n.receiveShadow,o.forEach((d,C)=>{d.updateMatrix(),v.setMatrixAt(C,d.matrix),t.remove(d),Ce.delete(d)}),v.instanceMatrix.needsUpdate=!0,v.computeBoundingSphere(),t.add(v),l.includes(n)&&Ce.add(v),qe+=o.length-1}}ye(r),ye(ge),ye(oe);function Re(t){for(let o of[...t.children])o.isGroup&&Re(o);let a=new Map;for(let o of t.children){if(!o.isMesh||o.isInstancedMesh||o.material.transparent||o.material.transmission>0)continue;let n=[o.material.uuid,o.castShadow,o.receiveShadow,Ce.has(o)].join("|");a.has(n)||a.set(n,[]),a.get(n).push(o)}for(let o of a.values()){if(o.length<2)continue;let n=o[0],v=Ce.has(n),d=o.map(A=>{A.updateMatrix();let et=A.geometry.index?A.geometry.toNonIndexed():A.geometry.clone();return et.setAttribute("paperPosition",et.getAttribute("position").clone()),et.applyMatrix4(A.matrix),et}),C=ko(d);if(d.forEach(A=>A.dispose()),!C)throw new Error("Incompatible packaging surface attributes");let se=n.material,Z=se.clone();Z.onBeforeCompile=A=>{se.onBeforeCompile(A),A.vertexShader=A.vertexShader.replace("#include <common>",`#include <common>
attribute vec3 paperPosition;`).replace("vLocal=position;","vLocal=paperPosition;")},Z.customProgramCacheKey=()=>se.customProgramCacheKey()+"-batched";let y=new he(C,Z);y.castShadow=n.castShadow,y.receiveShadow=n.receiveShadow,t.add(y);for(let A of o)t.remove(A),Ce.delete(A);v&&Ce.add(y),qe+=o.length-1}}Re(r),Re(ge),Re(oe),l=[...Ce];let W=new Yt(U),Ye=new $t(p,e);W.addPass(Ye);let yt=new Ft(p,e,innerWidth,innerHeight,12);yt.kernelRadius=.32,yt.minDistance=.001,yt.maxDistance=.12,W.addPass(yt);let ve=null,Ar=null;function _r(){return Ar??=import("./SSRPass-KJN6PLIR.js").then(({SSRPass:t})=>{ve=new t({renderer:U,scene:p,camera:e,width:Math.round(innerWidth*.5),height:Math.round(innerHeight*.5),selects:[Be]}),ve.opacity=.16,ve.maxDistance=4,ve.thickness=.1,W.insertPass(ve,2),Qt()}).catch(()=>{Ar=null,ie=!1,x("#quality").textContent="Studio quality",x("#quality").setAttribute("aria-pressed","false"),or()})}let rr=new Kt(p,e,{focus:11,aperture:12e-5,maxblur:.003});W.addPass(rr);let Dr=new xt(new V(innerWidth,innerHeight),.13,.35,1.6);W.addPass(Dr);let Pr=new vt({uniforms:{tDiffuse:{value:null},time:{value:0},amount:{value:.0012}},vertexShader:"varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",fragmentShader:"uniform sampler2D tDiffuse;uniform float time;uniform float amount;varying vec2 vUv;void main(){vec2 d=(vUv-.5)*.0003;vec3 c=texture2D(tDiffuse,vUv).rgb;c.r=texture2D(tDiffuse,vUv+d).r;c.b=texture2D(tDiffuse,vUv-d).b;float n=fract(sin(dot(vUv+fract(time),vec2(12.9898,78.233)))*43758.5453);c+=(n-.5)*amount;c*=1.-.21*pow(length(vUv-.5),1.5);gl_FragColor=vec4(c,1.);}"});W.addPass(Pr),W.addPass(new Jt);let ie=!1;function or(){let t=!!ve&&ie&&!Tt();ve&&(ve.enabled=t),Ye.enabled=!t,yt.enabled=ie&&!Tt()&&!t,rr.enabled=ie&&!Tt(),Dr.enabled=ie;let a=Math.min(devicePixelRatio,ie?1.5:1);U.getPixelRatio()!==a&&(U.setPixelRatio(a),W.setPixelRatio(a))}or(),x("#quality").addEventListener("click",()=>{ie=!ie,x("#quality").textContent=ie?"Enhanced quality":"Studio quality",x("#quality").setAttribute("aria-pressed",ie),ie&&!Tt()&&!ve&&_r(),Qt(),fe()});let st=document.createElement("button");st.id="motion",st.textContent="Reduce motion",st.setAttribute("aria-pressed","false"),x(".quality").appendChild(st),st.addEventListener("click",()=>{Lt=!Lt,st.setAttribute("aria-pressed",Lt),st.textContent=Lt?"Motion reduced":"Reduce motion",document.documentElement.style.scrollBehavior=ke()?"auto":"smooth",fe()});let kt=x("#labels"),ut=document.createElementNS("http://www.w3.org/2000/svg","svg");ut.id="leader-lines",ut.setAttribute("aria-hidden","true"),document.body.appendChild(ut);let Ur=s.map(()=>{let t=document.createElementNS("http://www.w3.org/2000/svg","path");return ut.appendChild(t),t}),Oo=[[1.7,.65,1.5],[-2,.6,0],[1.7,.55,0],[1.65,.35,0],[1.3,.3,0],[1.8,1.25,0],[1.8,1.32,0],[2.5,.7,.85]];s.forEach((t,a)=>{let o=document.createElement("button");o.className="part-label",o.innerHTML=`<span>${String(a+1).padStart(2,"0")} \u2014 ${t.name}</span><small>${t.userData.spec}</small>`,o.setAttribute("aria-pressed","false"),o.addEventListener("pointerenter",()=>$e(a)),o.addEventListener("pointerleave",()=>$e(u)),o.addEventListener("focus",()=>$e(a)),o.addEventListener("blur",()=>$e(u)),o.addEventListener("click",()=>{u=u===a?-1:a,$e(u)}),kt.appendChild(o)});let Vo=s.map(t=>{let a=new Map;return t.traverse(o=>{if(!o.isMesh)return;let n=o.material;if(!a.has(n)){let v=n.clone();v.onBeforeCompile=n.onBeforeCompile,v.customProgramCacheKey=n.customProgramCacheKey,v.userData.originalColor=v.color.clone(),a.set(n,v)}o.material=a.get(n)}),[...a.values()]});function $e(t){t!==c&&(c=t,Vo.forEach((a,o)=>a.forEach(n=>n.color.copy(n.userData.originalColor).multiplyScalar(t<0||t===o?1:.23)))),Gt.forEach((a,o)=>a.setAttribute("aria-pressed",o===u))}let Gt=[...kt.children],Hr=[],jo=Oo.map(t=>new k(...t)),ir=new k,Wo=new k(0,.9,0),ne={progress:x("#progress"),number:x("#process-number"),scene:x("#scene-name"),stage:x("#stage"),stats:x(".stats"),pan:x("#pan"),tilt:x("#tilt")},Ie=!1,Ke=!1,Rt=!1,Ot=0,Vt=0,ze=0,sr=0,ar=0,Fe;function jt(){if(!Rt)return;Fe??=new AudioContext,Fe.resume();let t=.22,a=Fe.createBuffer(1,Fe.sampleRate*t,Fe.sampleRate),o=a.getChannelData(0);for(let C=0;C<o.length;C++)o[C]=(Math.random()*2-1)*Math.pow(1-C/o.length,2);let n=Fe.createBufferSource();n.buffer=a;let v=Fe.createBiquadFilter();v.type="lowpass",v.frequency.value=1400;let d=Fe.createGain();d.gain.value=.065,n.connect(v).connect(d).connect(Fe.destination),n.start()}x("#open-box").addEventListener("click",()=>{Ie=!Ie,x("#open-box").setAttribute("aria-pressed",Ie),x("#open-box").innerHTML=`<span class="button-icon">${Ie?"\u2212":"\uFF0B"}</span><span>${Ie?"Close packaging":"Open packaging"}</span>`,jt(),nr()}),x("#format").addEventListener("click",()=>{Ke=!Ke,x("#format").setAttribute("aria-pressed",Ke),x("#format").textContent=Ke?"Compact format":"Compare formats",jt(),nr()}),x("#sound").addEventListener("click",()=>{Rt=!Rt,x("#sound").textContent=Rt?"Sound on":"Sound off",x("#sound").setAttribute("aria-pressed",Rt),jt()});function nr(){ct(Ie,Ke,Ot),x("#studio-status").textContent=`${Ke?"EXPANDED PRESENTATION \xB7 440":"COMPACT FORMAT \xB7 320"} \xD7 240 \xD7 110 MM${Ie?" \xB7 OPEN":""}`,fe()}for(let t of["pan","tilt"])x("#"+t).addEventListener("input",()=>{sr=Number(ne.pan.value),ar=Number(ne.tilt.value),x("#"+t+"-value").textContent=x("#"+t).value+"\xB0",x("#horizon").textContent=`\u2014 ${ne.tilt.value}\xB0 \u2014`,fe()});x("#reset").addEventListener("click",()=>{sr=ar=0;for(let t of["pan","tilt"])x("#"+t).value=0,x("#"+t+"-value").textContent="0\xB0";x("#horizon").textContent="\u2014 0\xB0 \u2014",fe()}),x("#capture").addEventListener("click",()=>{W.render();let t=U.domElement.toDataURL("image/png");x("#captured-image").src=t,x("#download-capture").href=t,x("#capture-preview").hidden=!1,x("#close-capture").focus(),Ot++,x("#capture-count").textContent=String(Ot).padStart(2,"0"),nr(),jt()}),x("#close-capture").addEventListener("click",()=>{x("#capture-preview").hidden=!0,x("#capture").focus()});let Zo=[...document.querySelectorAll("[data-chapter]")],F=[],le=scrollY,At=scrollY,lr=0,Je=0,Br=0,cr=0,ft=innerWidth,Ae=innerHeight,Wt=Tt(),ur=1,Nr=1/0,fr=-1,hr=!1,Zt=!0,Ir=0,zr=!1,Fr=null,dr=-1,pr=0,Qo=["01 \u2014 THE OBJECT","02 \u2014 THE STRUCTURE","03 \u2014 THE ANATOMY","04 \u2014 THE PROTECTION","05 \u2014 THE PRESENTATION","06 \u2014 THE ENGINEERING","07 \u2014 THE STUDIO"];function mr(){F=Zo.map(t=>({top:t.offsetTop,height:t.offsetHeight})),ur=Math.max(1,document.documentElement.scrollHeight-Ae),Nr=x("#packages").offsetTop,Zt=!0}function Qt(){ft=innerWidth,Ae=innerHeight,Wt=Tt(),e.aspect=ft/Ae,e.fov=Wt?47:36,e.updateProjectionMatrix(),or(),U.setSize(ft,Ae),W.setSize(ft,Ae),ve?.setSize(Math.round(ft*.5),Math.round(Ae*.5)),ie&&!Wt&&!ve&&_r(),mr()}function fe(){!Je&&!document.hidden&&(lr=performance.now(),Je=requestAnimationFrame(Or))}addEventListener("resize",()=>{pr||(pr=requestAnimationFrame(()=>{pr=0,Qt(),fe()}))}),document.addEventListener("click",()=>fe()),Rr.addEventListener("change",fe),addEventListener("scroll",()=>{At=scrollY,fe()},{passive:!0}),document.fonts.ready.then(()=>{mr(),fe()});let Lr=new Bo,kr=new V,Gr=0;addEventListener("pointermove",t=>{if(cr!==2||t.target.closest("button")||performance.now()-Gr<90)return;Gr=performance.now(),kr.set(t.clientX/innerWidth*2-1,-t.clientY/innerHeight*2+1),Lr.setFromCamera(kr,e);let a=Lr.intersectObjects(s,!0)[0];if(a){let o=a.object;for(;o.parent!==i&&o.parent;)o=o.parent;$e(o.userData.index??u)}else $e(u)}),mr();let _t=new k;function Or(t){if(document.hidden){Je=0;return}if(At>=Nr-1){ne.progress.style.transform=`scaleY(${Go(At/ur,0,1)})`,ne.number.textContent="07 / 07",ne.scene.textContent=At>=x("#contact").offsetTop-Ae*.5?"CONTACT & LOCATION":"MORE PACKAGES",fr=-1,dr=-1,kt.hidden=!0,ut.style.display="none",hr=!1,Je=0;return}let a=Math.min((t-lr)/1e3||.016,.5);lr=t;let o=ke()?1:1-Math.exp(-a*7);le=bt(le,At,o),Vt=bt(Vt,Ie?1:0,ke()?1:1-Math.exp(-a*5)),ze=bt(ze,Ke?1:0,ke()?1:1-Math.exp(-a*4));let n=0;for(let B=1;B<F.length;B++)le>=F[B].top-Ae*.35&&(n=B);cr=n,n!==2&&c!==-1&&(u=-1,$e(-1));let v=t*.001,d=0,C=0,se=0,Z=0,y=0,A=(le-F[2].top+innerHeight*.3)/F[2].height;d=Pe(0,.5,A)*(1-Pe(.78,1.1,A)),C=Pe(F[1].top-innerHeight*.5,F[1].top+innerHeight*.4,le)*(1-Pe(F[2].top-innerHeight*.2,F[2].top+innerHeight*.3,le)),se=Pe(F[3].top-innerHeight*.5,F[3].top+innerHeight*.2,le)*(1-Pe(F[4].top-innerHeight*.4,F[4].top+innerHeight*.2,le)),Z=Pe(F[4].top-innerHeight*.35,F[4].top+innerHeight*.3,le)*(1-Pe(F[5].top+innerHeight*.35,F[6].top-innerHeight*.25,le)),y=Pe(F[6].top-innerHeight*.5,F[6].top+innerHeight*.15,le),ke()&&(d=d>.5?1:0,C=C>.5?1:0,Z=Z>.5?1:0,se=se>.5?1:0);let et=Math.max(C,Z,y*Vt);s.forEach((B,Q)=>{let Le=ke()?d:Pe(Q*.045,.5+Q*.045,d);B.position.copy(B.userData.offset).multiplyScalar(Le),B.scale.x=Q===7?1:1+y*ze*.375}),j.rotation.x=-et*1.85-d*.22,Y.rotation.x=j.rotation.x,de.rotation.z=et*.85,pe.rotation.z=-et*.85,q.visible=d<.2,L.visible=se>.01,L.position.y=bt(-4.2,0,se),L.rotation.copy(i.rotation),i.position.y=d*.2+se*.27,i.rotation.y=(ke()?-.28:-.28+Math.sin(v*.17)*.065)*(1-y)+y*(sr*Math.PI/180-.25),i.rotation.x=y*ar*Math.PI/180,L.rotation.y=i.rotation.y,ge.rotation.y=i.rotation.y*.18,Qe.visible=y>.9&&ze>.5,de.rotation.z+=y*ze*.65,pe.rotation.z-=y*ze*.65,Ue.position.x+=y*ze*.75,oe.visible=y>.05,oe.position.y=(1-y)*-10,ue.intensity=115+y*30+y*Vt*25,it.intensity=85+y*ze*30;let ht=Wt,Xo=ht?7.3:7.6,qo=ht?11.2:11.3;if(e.position.set(Xo+d*2.2,6+d*2,qo+d*3),_t.set(ht?-.05:-2.5+d*.8,ht?2.45:1.1,0),ht&&(e.position.y+=1,_t.y=bt(bt(2.45,3.25,d),.8,y),_t.x=d*2,e.position.z+=1.9+d*8+y*ze*5),_t.y+=d*.65,e.lookAt(_t),rr.uniforms.focus.value=e.position.distanceTo(Wo),Br%15===0){let B=e.position.distanceTo(i.position)<17||ie;B!==Fr&&(l.forEach(Q=>Q.visible=B),Fr=B)}Pr.uniforms.time.value=ke()?0:v,Br++;let gr=Math.round(Go(le/ur,0,1)*1e4)/1e4;gr!==dr&&(ne.progress.style.transform=`scaleY(${gr})`,dr=gr),n!==fr&&(ne.number.textContent=`${String(n+1).padStart(2,"0")} / 07`,ne.scene.textContent=Qo[n],ne.stats.classList.toggle("active",n===5),fr=n);let dt=n===2&&d>=.15;dt!==hr&&(kt.hidden=!dt,ut.style.display=dt?"block":"none",hr=dt,Zt=!0),dt&&Zt&&(Gt.forEach((B,Q)=>B.style.top=(ht?34+[6,5,4,3,2,1,0,7][Q]*6.8:20+[6,5,4,3,2,1,0,7][Q]*7.7)+"%"),Gt.forEach((B,Q)=>Hr[Q]=B.getBoundingClientRect()),Zt=!1),dt&&t-Ir>50&&(i.updateWorldMatrix(!0,!0),e.updateMatrixWorld(),Gt.forEach((B,Q)=>{let Le=d>Q*.08+.15;if(B.dataset.revealed!==String(Le)&&(B.dataset.revealed=String(Le),B.style.opacity=Le?"1":"0",B.style.pointerEvents=Le?"auto":"none",B.tabIndex=Le?0:-1,Ur[Q].style.opacity=Le?"0.35":"0"),!Le)return;ir.copy(jo[Q]).applyMatrix4(s[Q].matrixWorld).project(e);let Yo=(ir.x*.5+.5)*ft,$o=(-ir.y*.5+.5)*Ae,xr=Hr[Q];Ur[Q].setAttribute("d",`M${Yo.toFixed(1)},${$o.toFixed(1)} L${xr.left-17},${xr.top+16} H${xr.left-4}`)}),Ir=t);let vr=le>F[6].top+F[6].height-Ae*.25;vr!==zr&&(ne.stage.style.opacity=vr?"0.25":"1",zr=vr),U.shadowMap.needsUpdate=!0,W.render(),Je=ke()?0:requestAnimationFrame(Or)}document.addEventListener("visibilitychange",()=>{document.hidden?(cancelAnimationFrame(Je),Je=0):fe()}),U.domElement.addEventListener("webglcontextlost",t=>{t.preventDefault(),cancelAnimationFrame(Je),x("#graphics-message").hidden=!1,x("#graphics-message strong").textContent="The graphics session was interrupted.",x("#graphics-message p").textContent="Reload this page to restart the 3D studio."}),ne.progress.style.height="100%",ne.progress.style.transformOrigin="top",Qt(),x("#loading").hidden=!0,fe(),window.packagingStudy={getState:()=>({open:Ie,expanded:Ke,count:Ot,activePart:c,reducedMotion:Rr.matches,stageIndex:cr,parts:s.map(t=>t.name),drawCalls:U.info.render.calls,triangles:U.info.render.triangles,highQuality:ie})}}
