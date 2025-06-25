
// node src/data/draft/moveToBlog.js
// 将知识库中的Markdown文件移动到blog文件夹，并添加自定义标题格式。

const fs = require('fs');
const path = require('path');

// 配置参数
const targetDir = 'src/data/draft';
const blogDir = 'src/data/blog';

// 自定义标题格式
const headerFormat = `---
title: "{title}"
description: "{description}"
pubDate: "{pubDate}"
---\n\n`;

// 获取blog文件夹下的文件数量
async function getBlogFileCount() {
  try {
    const files = await fs.promises.readdir(blogDir);
    return files.length;
  } catch (err) {
    throw new Error(`--获取blog文件夹下的文件数量失败: ${err.message}`);
  }
}

// 递归遍历目录函数
async function processDirectory(dirPath) {
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(fullPath); // 递归处理子目录
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.md') {
      await processMarkdownFile(fullPath); // 处理Markdown文件
    }
  }
}

// 处理单个Markdown文件
async function processMarkdownFile(filePath) {
  try {
    // 读取文件内容
    const data = await fs.promises.readFile(filePath, 'utf8');

    // 获取文件修改日期
    const stats = await fs.promises.stat(filePath);
    const modifiedDate = stats.mtime.toISOString().split('T')[0]; // 格式化为 YYYY-MM-DD
    // 获取文件名（不含扩展名）
    const fileName = path.basename(filePath, '.md');

    // 生成要添加的内容
    const header = headerFormat.replace('{title}', fileName).replace('{description}', fileName).replace('{pubDate}', modifiedDate);

    // 创建新内容（标题 + 原始内容）
    const newContent = header + data;

    // 实际写入文件
    await fs.promises.writeFile(filePath, newContent);

    // 移动到blog文件夹,文件名不变
    const newFilePath = path.join(blogDir, path.basename(filePath));
    await fs.promises.rename(filePath, newFilePath);

    // 输出预览
    console.log(`--处理文件: ${filePath} -> ${newFilePath}`);

  } catch (err) {
    console.error(`--处理文件失败 ${filePath}:`, err);
  }
}

// 执行处理
(async () => {
  console.log(`--开始处理--`);
  try {
    // 获取目标问价夹下的文件数量
    blogCount = await getBlogFileCount(blogDir);
    await processDirectory(targetDir);
    console.log('--处理完成!--');
  } catch (err) {
    console.error('--处理失败:', err);
  }
})();