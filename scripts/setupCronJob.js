const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

// 设置每周一凌晨2点运行安全审计
cron.schedule('0 2 * * 1', () => {
  console.log('运行安全审计...');
  const scriptPath = path.join(__dirname, 'securityAudit.js');
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误: ${error}`);
      return;
    }
    console.log(`安全审计输出: ${stdout}`);
    if (stderr) {
      console.error(`安全审计错误: ${stderr}`);
    }
  });
});

console.log('Cron 作业已设置，将每周一凌晨2点运行安全审计。');
