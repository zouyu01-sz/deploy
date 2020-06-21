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
