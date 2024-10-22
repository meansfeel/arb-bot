const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const logger = require('../server/services/logger');

// 检查依赖项是否有已知的安全漏洞
function checkDependencies() {
  return new Promise((resolve, reject) => {
    exec('npm audit', (error, stdout, stderr) => {
      if (error) {
        logger.error(`依赖项检查失败: ${error}`);
        reject(error);
      }
      logger.info('依赖项检查结果:', stdout);
      resolve(stdout);
    });
  });
}

// 检查环境变量是否正确设置
function checkEnvironmentVariables() {
  const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI', 'BINANCE_API_KEY', 'BINANCE_API_SECRET'];
  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    logger.error('缺少以下环境变量:', missingEnvVars.join(', '));
  } else {
    logger.info('所有必需的环境变量都已设置');
  }
}

// 检查日志文件权限
function checkLogFilePermissions() {
  const logFiles = ['error.log', 'combined.log'];
  logFiles.forEach(file => {
    fs.stat(file, (err, stats) => {
      if (err) {
        logger.error(`无法检查日志文件 ${file}: ${err}`);
      } else {
        const permissions = stats.mode & parseInt('777', 8);
        if (permissions > parseInt('644', 8)) {
          logger.warn(`警告: ${file} 的权限过于开放 (${permissions.toString(8)})`);
        } else {
          logger.info(`${file} 的权限正确`);
        }
      }
    });
  });
}

// 检查数据库备份
function checkDatabaseBackup() {
  // 这里应该实现检查最近的数据库备份的逻辑
  // 这只是一个示例，你需要根据实际的备份策略来实现
  logger.info('检查数据库备份...');
}

async function runSecurityAudit() {
  logger.info('开始安全审计...');
  
  await checkDependencies();
  checkEnvironmentVariables();
  checkLogFilePermissions();
  checkDatabaseBackup();
  
  logger.info('安全审计完成');
}

runSecurityAudit();
