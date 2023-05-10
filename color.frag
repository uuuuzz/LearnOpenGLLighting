#version 330 core

in vec3 FragPos;
in vec3 Normal;

out vec4 FragColor;

uniform vec3 objectColor;
uniform vec3 lightColor;
uniform vec3 lightPos;
uniform vec3 cameraPos;

void main()
{
    //环境光照
    float ambientStrengtn=0.1;
    vec3 ambient=ambientStrengtn*lightColor;

    //漫反射光照
    vec3 norm=normalize(Normal);
    vec3 lightDir=normalize(lightPos-FragPos);
    float diff=max(dot(norm,lightDir),0.0);
    vec3 diffuse=diff*lightColor;

    //镜面光照
    float specularStrength=0.5;
    vec3 viewDir=normalize(cameraPos-FragPos);
    vec3 reflectDir=reflect(-lightDir,norm);
    float spec=pow(max(dot(reflectDir,viewDir),0.0),32);
    vec3 specular=specularStrength*spec*lightColor;

    vec3 result=(ambient + diffuse+specular)*objectColor;
    FragColor=vec4(result,1.0);
}