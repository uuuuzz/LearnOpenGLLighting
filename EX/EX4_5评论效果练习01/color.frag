#version 330 core
out vec4 FragColor;

struct Material
{
  sampler2D diffuse;                                //漫反射贴图
  sampler2D specular;                               //镜面光贴图
  sampler2D emission;                               //自发光贴图
  float shininess;                                      //材质反光度
};

struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

uniform vec3 cameraPos;
uniform Material material;
uniform Light light;
uniform float time;

void main()
{
    //环境光
    vec3 ambient=light.ambient*texture(material.diffuse,TexCoords).rgb;

    //漫反射光照
    vec3 norm=normalize(Normal);
    vec3 lightDir=normalize(light.position-FragPos);
    float diff=max(dot(norm,lightDir),0.0);
    vec3 diffuse=light.diffuse*diff*texture(material.diffuse,TexCoords).rgb;

    //镜面光照
    vec3 viewDir=normalize(cameraPos-FragPos);
    vec3 reflectDir=reflect(-lightDir,norm);
    float spec=pow(max(dot(viewDir,reflectDir),0.0),material.shininess);
    vec3 specularMap=vec3(texture(material.specular,TexCoords));
    vec3 specular=light.specular*spec* specularMap;

    //自发光
    vec2 myTexCoords=TexCoords;
    myTexCoords.x=myTexCoords.x+0.045f;
    vec3 emissionMap=vec3(texture(material.emission,myTexCoords+vec2(0.0,time*0.75)));
    vec3 emission=emissionMap*(sin(time)*0.5+0.5)*2.0;

    vec3 emissionMask=step(vec3(1.0f),vec3(1.0f)-specularMap);
    emission=emission*emissionMask;

    vec3 result=ambient+diffuse+specular+emission;
    FragColor=vec4(result,1.0);
}