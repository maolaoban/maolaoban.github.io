/**
 * 同步 knowledge 仓库的 Markdown 文件到博客系统。
 *
 * 环境变量：
 *   KNOWLEDGE_DIR — 源目录（默认 ../knowledge）
 *   BLOG_DIR      — 目标目录（默认 ./src/data/blog）
 */

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const knowledgeDir = process.env.KNOWLEDGE_DIR || path.resolve(repoRoot, "../knowledge");
const blogDir = process.env.BLOG_DIR || path.resolve(repoRoot, "src/data/blog");
const stateFile = path.join(repoRoot, ".sync-state.json");

// ── helpers ──────────────────────────────────────────────────────────

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(stateFile, "utf8"));
  } catch {
    return { synced: {} };
  }
}

function saveState(state) {
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2) + "\n");
}

/** 获取 git 中该文件的最后修改日期，失败时回退到当天 */
function getGitDate(dir, filename) {
  try {
    const iso = execSync(`git log -1 --format=%aI -- "${filename}"`, {
      cwd: dir,
      encoding: "utf8",
      timeout: 5000,
    }).trim();
    if (iso) return iso.slice(0, 10);
  } catch { /* ignore */ }
  return new Date().toISOString().slice(0, 10);
}

/** 检测文件是否已含 YAML frontmatter */
function hasFrontmatter(content) {
  return /^---\s*\n/.test(content);
}

// ── main ─────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(knowledgeDir)) {
    console.error(`源目录不存在: ${knowledgeDir}`);
    process.exit(1);
  }
  fs.mkdirSync(blogDir, { recursive: true });

  const state = loadState();
  const synced = state.synced || {};

  // 收集源目录中所有 .md 文件
  const sourceFiles = fs
    .readdirSync(knowledgeDir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  const sourceSet = new Set(sourceFiles);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let deleted = 0;
  const errors = [];

  // ── 新增 / 更新 ──

  for (const filename of sourceFiles) {
    const srcPath = path.join(knowledgeDir, filename);
    const destPath = path.join(blogDir, filename);
    const content = fs.readFileSync(srcPath, "utf8");
    const sourceKey = `knowledge/${filename}`;

    try {
      if (hasFrontmatter(content)) {
        // 已有 frontmatter，直接复制
        fs.writeFileSync(destPath, content);
        synced[filename] = sourceKey;
        created++; // count as processed
        console.log(`  + ${filename} (已有 frontmatter)`);
      } else {
        const title = filename.replace(/\.md$/, "");
        const pubDate = getGitDate(knowledgeDir, filename);
        const destContent = `---\ntitle: "${title}"\ndescription: "${title}"\npubDate: "${pubDate}"\n---\n\n${content}`;
        fs.writeFileSync(destPath, destContent);
        synced[filename] = sourceKey;
        created++;
        console.log(`  + ${filename} -> pubDate: ${pubDate}`);
      }
    } catch (err) {
      errors.push({ filename, error: err.message });
      console.error(`  ! 错误: ${filename} - ${err.message}`);
    }
  }

  // ── 删除源仓库中已移除的文件 ──

  for (const [filename, sourceKey] of Object.entries(synced)) {
    if (!sourceKey.startsWith("knowledge/")) continue; // 只管同步来的文件
    if (sourceSet.has(filename)) continue; // 源文件仍存在

    const destPath = path.join(blogDir, filename);
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath);
      deleted++;
      console.log(`  - ${filename} (源文件已删除)`);
    }
    delete synced[filename];
  }

  // ── 保存状态 ──

  state.synced = synced;
  state.lastSync = new Date().toISOString();
  saveState(state);

  // ── 总结 ──

  console.log(
    `\n同步完成: 新增/更新 ${created}, 删除 ${deleted}, 跳过 ${skipped}, 错误 ${errors.length}`
  );

  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
