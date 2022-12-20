export default `

 precision mediump float;
  varying vec3 vertex_normal;
  uniform vec3 objColor;
  uniform float emission;

  void main () {
    
    // Scene Params
    vec3 lightDir = normalize(vec3(0.5, 0.4, -0.5));
    vec3 lightColor = vec3(0.2, 0.2, 0.2);
    float ambient = 0.6;
    
    // Object Params
    float diffuse = 1.0;
    float specular = 1.0;
    float shininess = 1.0;
    
    vec3 normal = normalize(vertex_normal);
    float diffuseComp = max(0.0,diffuse * dot(normal,lightDir));
    vec3 ref = 2.0*dot(lightDir,normal)*normal - lightDir;
    float specularComp = specular*pow(max(0.0,dot(ref,vec3(0.0,0.0,1.0))),shininess);
    gl_FragColor = vec4((ambient+diffuseComp)*lightColor*objColor +
                        specularComp*lightColor, 1.0);
  }
`