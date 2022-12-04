export default `

  attribute vec3 position;
  attribute vec3 normal;
  varying vec3 vertex_normal;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 perspectiveMatrix;
  
  void main () {
    gl_Position = perspectiveMatrix*viewMatrix*modelMatrix*vec4(position, 1.0);
    vertex_normal = normal; //(modelview*vec4(normal,1.0)).xyz;
  }
`
