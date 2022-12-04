export default `

 precision mediump float;
  uniform vec4 color;
  varying vec3 vertex_normal;

  void main () {
    gl_FragColor = vec4(clamp(color.xyz*dot(vertex_normal, vec3(0.7,0.7,0.7)),0.0,1.0),1.0);
  }
`