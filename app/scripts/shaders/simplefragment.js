#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

float PI = 3.14159265358979323846264;

varying vec3 vColor;
varying vec3 pos;

uniform float w;
uniform float h;
uniform vec3 lightPos;
uniform float time;
uniform vec3 mouse3D;



void main()
{
	//float fog = 1.0 - min(max(0.0, distance(pos, vec3(0.0)) - fogVal) / fogVal, 1.0);
	//float mouseDist = ceil((1.0 - abs(max(min(100.0, distance(mouse3D, pos)), -100.0) / 100.0)) * 100.0) / 100.0;
	//vec3 col = vec3(pos.z / 300.0);
	//gl_FragColor = vec4(vec3(abs(pos.x + abs(cos(time + pos.x)) * 200.0) / (w * 4.0), abs(pos.y + abs(sin(time + pos.y)) * 200.0) / (h * 4.0),  adist) * (dProd * 2.0) * fog + vec3(mouseDist), 1.0);
	//float blue = min(1.0, max(0.0, pos.z / 20.0));
	//float dist = distance(pos.xy, vec2(0.0));
	//float maxDist = distance(vec2(w * .5, h * .5), vec2(0.0));

	vec3 light = lightPos;
	vec3 normal  = normalize(cross(dFdx(pos), dFdy(pos)));
	float dProd = max(0.0, dot(normal, light));
	gl_FragColor = vec4(vColor * dProd, 1.0); 
}