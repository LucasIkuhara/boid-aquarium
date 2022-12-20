export default `

  attribute vec3 position;
  attribute vec3 normal;
  varying vec3 vertex_normal;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 perspectiveMatrix;
  
  void main () {

    mat4 modelView = viewMatrix*modelMatrix;
    gl_Position = perspectiveMatrix*modelView*vec4(position, 1.0);
    vertex_normal = (modelView*vec4(normal, 0.0)).xyz;
  }
`
