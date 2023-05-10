#version 330 core

in vec3 FragPos;
in vec3 Normal;

out vec4 FragColor;

struct Material
{
  vec3 ambient;             //材质环境光
  vec3 diffuse;               //材质漫反射
  vec3 specular;            //材质镜面光
  float shininess;           //材质反光度
};

struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform vec3 cameraPos;
uniform Material material;
uniform Light light;

void main()
{
    //环境光照
    vec3 ambient=light.ambient*material.ambient;

    //漫反射光照
    vec3 norm=normalize(Normal);
    vec3 lightDir=normalize(light.position-FragPos);
    float diff=max(dot(norm,lightDir),0.0);
    vec3 diffuse=light.diffuse*(diff*material.diffuse);

    //镜面光照
    vec3 viewDir=normalize(cameraPos-FragPos);
    vec3 reflectDir=reflect(-lightDir,norm);
    float spec=pow(max(dot(reflectDir,viewDir),0.0),material.shininess);
    vec3 specular=light.specular*(spec*material.specular);

    vec3 result=ambient+diffuse+specular;
    FragColor=vec4(result,1.0);
}