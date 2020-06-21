const Client = require('ssh2-sftp-client')
const sftp = new Client()

const config = {
  path: {
    romotePath: '/var/www/dist',// 远程地址
    localPath:'E:/private/dist',// 本地地址
  },
  ssh: {
    host: '192.168.0.105',
    port: 22,
    username: 'root',
    password: 'root',
  }
}

function main(localPath, romotePath) {
  sftp
    .connect(config.ssh)
    .then(() => {
      console.log('- 连接成功,上传中..')
      return sftp.uploadDir(localPath, romotePath)
    })
    .then(data => {
      console.log(data,' 上传完成,及时清除缓存' )
    })
    .catch(err => {
      console.log(err,'出错了!快看看怎么回事! ')
    })
    .finally(() => {
      sftp.end()// 断开连接
    })
}

main(
  config.path.localPath,
  config.path.romotePath
)
