#pragma once
#include <iostream>
#include <glad/glad.h> 
#include <GLFW/glfw3.h>
#include<glm/glm.hpp>
#include<glm/gtc/matrix_transform.hpp>
#include<glm/gtc/type_ptr.hpp>
#include<vector>

//定义相机移动的可能选项，用作抽象
enum class Camera_Movement
{
	FORWARD,
	BACKWARD,
	LEFT,
	RIGHT,
	UP,
	DOWN
};

//默认值
const float YAW = -90.0f;
const float PITCH = 0.0f;
const float SPEED = 2.5f;
const float SENEITIVITY = 0.1f;
const float ZOOM = 45.0f;

class Camera
{
public:
	//摄像机属性
	glm::vec3 Position;
	glm::vec3 Front;
	glm::vec3 Up;
	glm::vec3 Right;
	glm::vec3 WorldUp;

	//欧拉角
	float Yaw;
	float Pitch;

	//摄像机设置
	float MovementSpeed;
	float MouseSeneitivity;
	float Zoom;

	//带向量的构造函数
	Camera(glm::vec3 position = glm::vec3(0.0f, 0.0f, 0.0f), glm::vec3 up = glm::vec3(0.0f, 1.0f, 0.0f), float yaw = YAW, float pitch = PITCH);	
	//带标量的构造函数
	Camera(float posX, float posY, float posZ, float upX, float upY, float upZ, float yaw, float pitch);

	//返回使用欧拉角和LookAt矩阵计算的观察矩阵
	glm::mat4 GetViewMatrix();

	//处理从任何类似键盘的输入系统接收的输入，接受摄像机枚举形式的输入参数(从窗口系统中提取)
	void ProcessKeyBoard(Camera_Movement direction, float deltaTime);
	//处理从鼠标输入系统接收到的输入，需要x和y方向上的偏移值
	void ProcessMouseMovement(float xoffset, float yoffset, GLboolean constrainPitch = true);
	//处理从鼠标滚轮事件接收的输入
	void ProcessMouseScroll(float yoffset);

private:
	//通过相机的(更新的)欧拉角计算front
	void updateCameraVectors();
};

