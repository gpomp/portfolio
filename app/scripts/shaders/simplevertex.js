// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vColor;
varying vec3 pos;

uniform float w;
uniform float h;
uniform float radius;
uniform float time;
uniform vec3 mouse3D;

attribute float height;


float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main()
{
	vColor = color;
	float effectlim = 100.0;
	float dist = distance(mouse3D, position);
	vec3 newPos = position;
	float adist = abs(abs(max(min(radius - dist, effectlim), -1.0 * effectlim)) - effectlim) / effectlim;
	float pdist = position.z + adist * 30000.0;
  newPos.z += (pdist * sin(time) - newPos.z) * 0.01;
	newPos.z += (0.0 - newPos.z) * 0.0001;
  newPos.z += sin(time + newPos.x / w + (h - newPos.y) / h) * height;
  vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );
  pos = -mvPosition.xyz;
	gl_Position = 	projectionMatrix * mvPosition;
}