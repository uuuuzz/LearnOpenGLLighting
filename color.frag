#version 330 core
out vec4 FragColor;

struct Material
{
  sampler2D diffuse;      //漫反射贴图
  sampler2D specular;   //镜面光贴图
  sampler2D emission;   //自发光贴图
  float shininess;            //材质反光度
};

//平行光
struct DirLight
{
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

//点光源
struct PointLight
{
    vec3 position;

    float constant;
    float linear;
    float quadratic;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
#define NR_POINT_LIGHTS 4
uniform PointLight pointLights[NR_POINT_LIGHTS];

struct Light
{
    //平行光
    //vec3 direction;
    //点光源
    //vec3 position;
    //float constant;
    //float linear;
    //float quadratic;
    //聚光
    vec3 position;
    vec3 direction;
    float cutoff;
    float outerCutoff;

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

uniform DirLight dirLight;

vec3 CalcDirLight(DirLight light,vec3 normal,vec3 viewDir);
vec3 CalcPointLight(PointLight light,vec3 normal,vec3 fragPos,vec3 viewDir);

void main()
{
    float distance=length(light.position-FragPos);
    //float attenuation=1.0/(light.constant+light.linear*distance+light.quadratic*(distance*distance));
    vec3 lightDir=normalize(light.position-FragPos);
    float theta=dot(lightDir,normalize(-light.direction));
    float epsilon=light.cutoff-light.outerCutoff;
    float intensity=clamp((theta-light.outerCutoff)/epsilon,0.0,1.0);
    //环境光
    vec3 ambient=light.ambient*texture(material.diffuse,TexCoords).rgb;

    //漫反射光照
    vec3 norm=normalize(Normal);
    float diff=max(dot(norm,lightDir),0.0);
    vec3 diffuse=light.diffuse*diff*texture(material.diffuse,TexCoords).rgb*intensity;

    //镜面光照
    vec3 viewDir=normalize(cameraPos-FragPos);
    vec3 reflectDir=reflect(-lightDir,norm);
    float spec=pow(max(dot(viewDir,reflectDir),0.0),material.shininess);
    vec3 specular=light.specular*spec*texture(material.specular,TexCoords).rgb*intensity;

    //自发光
    vec3 emissionMask=step(vec3(1.0),vec3(1.0)-texture(material.specular,TexCoords).rgb);
    vec3 emission=texture(material.emission,TexCoords).rgb;
    emission=emission*emissionMask;

    vec3 result=ambient+diffuse+specular;
    FragColor=vec4(result,1.0);
    
}

vec3 CalcDirLight(DirLight light,vec3 normal,vec3 viewDir)
{
    vec3 lightDir=normalize(-light.direction);
    //漫反射着色
    float diff=max(dot(normal,lightDir),0.0);
    //镜面过着色
    vec3 reflectDir=reflect(-lightDir,normal);
    float spec=pow(max(dot(viewDir,reflectDir),0.0),material.shininess);
    //合并结果
    vec3 ambient=light.ambient*vec3(texture(material.diff,TexCoords));
    vec3 diffuse=light.diffuse*diff*vec3(texture(material.diffuse,TexCoords));
    vec3 specular=light.specular*spec*vec3(texture(material.specular,TexCoords));
    return(ambient+diffuse+specular);
}

vec3 CalcPointLight(PointLight light,vec3 normal,vec3 fragPos,vec3 viewDir)
{
    vec3 lightDir=normalize(light.position-fragPos);
    //漫反射着色
    float diff=max(dot(normal,lightDir),0.0);
    //镜面光着色
    vec3 reflectDir=reflect(-lightDir,normal);
    float spec=pow(max(dot(viewDir,reflectDir),0.0),material.shininess);
    //衰减
    float distance=length(light.position-fragPos);
    float attenuation=1.0/(light.constant+light.linear*distance+light.quadratic*(distance*distance));
    //合并结果
    vec3 ambient=light.ambient*vec3(texture(material.diffuse,TexCoords));
    vec3 diffuse=light.diffuse*diff*vec3(texture(material.diffuse,TexCoords));
    vec3 specular=light.specular*spec*vec3(texture(material.specular,TexCoords));
    ambient*=attenuation;
    diffuse*=attenuation;
    specular*=attenuation;
    return(ambient+diffuse+specular);
}