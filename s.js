const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// 视频文件夹和图片保存目录
const videoDir = './dist/video';
const imgDir = './dist/img';

// 创建图片目录（如果不存在的话）
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir);
}

// 获取视频文件夹中的所有文件
fs.readdir(videoDir, (err, files) => {
  if (err) {
    console.error('无法读取视频文件夹', err);
    return;
  }

  // 处理每一个文件
  files.forEach(file => {
    const videoPath = path.join(videoDir, file);
    const imgPath = path.join(imgDir, `${file}.jpg`);

    // 检查文件是否是视频文件
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error(`无法处理文件：${videoPath}`, err);
        return;
      }

      if (metadata && metadata.format && metadata.format.format_name) {
        // 生成一个0~5秒之间的随机时间点
        const randomTime = (Math.random() * 5).toFixed(2);

        // 使用ffmpeg生成缩略图
        ffmpeg(videoPath)
          .screenshots({
            timestamps: [randomTime],
            filename: `${file}.jpg`,
            folder: imgDir,
            size: '320x240'
          })
          .on('end', () => {
            console.log(`生成缩略图：${imgPath}`);
          })
          .on('error', err => {
            console.error(`无法生成缩略图：${videoPath}`, err);
          });
      } else {
        console.log(`文件不是视频：${videoPath}`);
      }
    });
  });
});
