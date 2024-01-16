# 简易的Web 端聊天室

## 1 项目介绍

这是一个具备基础聊天室功能的项目，做这个项目的初衷是出于自己的兴趣，一直想自己开发一个具有前后端功能的项目，同时自己也可从中学习一些知识点，拓宽自己的技术视野，整体来说收获还是很多，比如在部署的时候就踩了很多坑。如果你也对自己开发前后端项目感兴趣，不妨看看，一起交流！

## 2 体验地址

[web 聊天室](https://zhengpq.com/)

**注意事项：体验的时候请不要使用平时常用密码，虽然前后端都做了密码加密，但是不敢保证不会被攻击**

### 使用

首页注册和登录

![首页](https://im-web-1323590293.cos.ap-guangzhou.myqcloud.com/%E9%A6%96%E9%A1%B5.png)

注册完账号之后通过搜索用户添加好友

![搜索用户](https://im-web-1323590293.cos.ap-guangzhou.myqcloud.com/%E6%90%9C%E7%B4%A2%E7%94%A8%E6%88%B7.jpg)

通过按钮创建群聊

![创建群聊](https://im-web-1323590293.cos.ap-guangzhou.myqcloud.com/%E5%88%9B%E5%BB%BA%E7%BE%A4%E8%81%8A.jpg)

## 3 本地开发

**前端**

```
npm install
npm run start
```

**后端**
先准备好数据库和腾讯云cos服务（应用中用了腾讯云的 cos 服务用于存储图片，也可以自己修改代码，使用磁盘存储），然后运行下方命令

```
npm install
SECRET_ID=your-cos-secret-id SECRET_KEY=your-cos-secret-key COS_BUCKET=your-cos-bucket COS_REGION=your-cos-region npm run start:dev
```

## 4 功能

- 注册用户
- 用户信息修改（头像、用户名）
- 添加、删除好友
- 用户搜索
- 私聊
- 群聊
- 群功能：添加成员、移除成员、退出群聊、解散群聊、清空群聊消息
- 消息提醒：好友申请、群聊和私聊未读信息提示
- 消息类型：单行/多行文本消息，表情包、图片
- 消息列表：滚动翻页加载旧消息
- 消息状态：成功（默认）、失败、重发

## 5 技术栈

### 5.1 前端

- 框架：React 全家桶
- socket：socket.io
- 组件库：ant-design
- css：tailwindcss
- 本地存储：dexie(indexdb 库)
- icon 库：phosphor-react
- 加密：crypto
- emoji：emoji-mart
- 翻页加载：react-infinite-scroll-component

### 5.2 后端

项目地址：[https://github.com/zhengpq/im-web-backend](https://github.com/zhengpq/im-web-backend)

- 框架：Nestjs
- 数据库： MySQL
- 数据库处理：sequelize
- socket：socket.io
- 登录态：jwt
- 加密：bcrypt
- 图片存储：腾讯云 cos

### 5.3 部署

- 机器：腾讯云轻量服务器
- web 服务器：NGINX
- 构建：github action
- 后端服务：docker
- 后端服务管理：PM2

## 6 数据库表结构

![database](https://im-web-1323590293.cos.ap-guangzhou.myqcloud.com/database.jpg)

## 7 Todo

- [ ] 发送图片支持使用粘贴板数据
- [ ] 聊天记录搜索
- [ ] 用户修改密码
- [ ] 用户广场，新用户可通过用户广场添加好友
