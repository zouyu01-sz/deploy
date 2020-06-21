## 前言
```!
前端项目部署时，nginx配置完成后，只需将打包后的文件上传至服务器指定目录下即可。
```
一般使用以下方式完成：
* xshell 等命令行工具上传
* ftp/sftp 等可视化工具上传
* jenkins 等自动化部署服务
对于简单前端项目，频繁部署时，xshell、ftp两种方式较为繁琐，而jenkins 等自动化部署服务需要提前安装软件、并熟悉配置流程。
因此希望借助本地 node 服务实现对前端打包后文件的上传工作，既不需要服务器额外安装程序，还可以帮助我们实现快速上传部署，更能帮助我们深入了解 node 。

## 目的
减少web项目在开发调试过程中频繁编译打包后再使用ftp工具部署至服务器的手动过程，提高工作效率。

### 1.导入依赖模块
1. npm install inquirer ssh2-sftp-client 
2. touch ssh.js helper.js
3. 在package.json增加一个脚本,完成之后一定要 npm i 重新安装依赖，确保新加入的脚本生效！
```
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	"deploy": "bash deploy.sh"
},
```
4. touch deploy.sh
```
npm run build
echo "打包完成"
node ./ssh.js

cd -
```

### 2. 连接远端服务器
```
const Client = require('ssh2-sftp-client')
const sftp = new Client()
const helper = require ('./helper')
const config = [
  {
    name: 'a',  // 项目/服务器名称
    ssh: {
      host: '192.168.0.105',
      port: 22,
      username: 'root',
      password: 'root',
    },
    romotePath: '/var/www/dist',// 远程地址
    localPath:'./dist',// 本地地址
  },
  {
    name: 'b',
    ssh: {
      host: '192.168.0.110',
      port: 22,
      username: 'root',
      password: 'root',
    },
    romotePath: '/var/www/dist',
    localPath:'./dist',
  }
]

async function main() {
  const SELECT_CONFIG = (await helper(config)).value // 所选部署项目的配置信息
  console.log('您选择了部署 ' + SELECT_CONFIG.name)
  sftp
    .connect(SELECT_CONFIG.ssh)
    .then(() => {
      console.log('- 连接成功,上传中..')
      return sftp.uploadDir(SELECT_CONFIG.localPath, SELECT_CONFIG.romotePath)
    })
    .then(data => {
      console.log(data,' 上传完成,及时清除缓存' )
    })
    .catch(err => {
      console.log(err,' 出错了!快看看怎么回事! ')
    })
    .finally(() => {
      sftp.end()// 断开连接
    })
}

main()

```
### 3.构建和发布
执行 npm run deploy 就可以打包并主动上传到你的目标服务器
