import{P as t,Q as i,R as o,va as a}from"./chunk-575DHTPU.js";var u={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var n=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},h=new a(-1,1,1,-1,0,1),r=class extends i{constructor(){super(),this.setAttribute("position",new t([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new t([0,2,0,0,2,0],2))}},c=new r,m=class{constructor(e){this._mesh=new o(c,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,h)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};export{u as a,n as b,m as c};
