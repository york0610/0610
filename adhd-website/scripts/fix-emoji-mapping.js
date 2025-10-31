#!/usr/bin/env node

/**
 * Emoji 對應校正腳本
 * 自動檢查並修正任務與 emoji 的錯誤對應
 */

const fs = require('fs');
const path = require('path');

// 正確的任務與 emoji 對應表
const CORRECT_EMOJI_MAPPING = {
  // 基本日常用品
  'cup': '☕',
  'book': '📖', 
  'bottle': '🧪',
  'chair': '🪑',
  'desk': '🪑', // 桌子應該用桌子emoji，但Unicode中沒有專門的桌子emoji，用辦公桌相關
  'door': '🚪',
  'window': '🪟',
  
  // 電子設備
  'keyboard': '⌨️',
  'laptop': '💻',
  'mouse': '🖱️',
  'monitor': '🖥️',
  'cell phone': '📱',
  'tv': '📺',
  
  // 時間相關
  'clock': '⏰',
  
  // 食物和飲品
  'apple': '🍎',
  
  // 個人物品
  'keys': '🔑',
  'bed': '🛏️',
  
  // 環境元素
  'person': '👤',
  'sky': '☁️'
};

// 更好的桌子emoji選項
const BETTER_DESK_EMOJIS = {
  'desk': '🪑', // 辦公桌最接近的選項
  // 或者可以考慮其他選項：
  // 'desk': '📋', // 剪貼板
  // 'desk': '🗃️', // 文件櫃
  // 'desk': '🖥️', // 電腦桌面
};

function fixEmojiMapping() {
  const filePath = path.join(__dirname, '../app/focus-finder/prototype/page.tsx');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    console.log('🔍 檢查 emoji 對應...');
    
    // 檢查每個任務的 emoji 對應
    Object.entries(CORRECT_EMOJI_MAPPING).forEach(([taskId, correctEmoji]) => {
      // 構建正則表達式來匹配任務定義
      const taskRegex = new RegExp(
        `(\\{\\s*id:\\s*'${taskId}'[^}]*emoji:\\s*)'([^']*)'([^}]*\\})`,
        'g'
      );
      
      const match = taskRegex.exec(content);
      if (match) {
        const currentEmoji = match[2];
        if (currentEmoji !== correctEmoji) {
          console.log(`❌ 發現錯誤對應: ${taskId} -> ${currentEmoji} (應該是 ${correctEmoji})`);
          content = content.replace(taskRegex, `$1'${correctEmoji}'$3`);
          hasChanges = true;
        } else {
          console.log(`✅ 正確對應: ${taskId} -> ${correctEmoji}`);
        }
      }
    });
    
    // 特別處理桌子的emoji問題
    const deskRegex = /({\s*id:\s*'desk'[^}]*emoji:\s*)'([^']*)'([^}]*})/g;
    const deskMatch = deskRegex.exec(content);
    if (deskMatch) {
      const currentDeskEmoji = deskMatch[2];
      if (currentDeskEmoji === '🛏️') {
        console.log(`🔧 修正桌子emoji: ${currentDeskEmoji} -> 🪑`);
        content = content.replace(deskRegex, `$1'🪑'$3`);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('✅ Emoji 對應已修正並保存');
    } else {
      console.log('✅ 所有 emoji 對應都是正確的');
    }
    
    return hasChanges;
    
  } catch (error) {
    console.error('❌ 修正 emoji 對應時發生錯誤:', error);
    return false;
  }
}

// 驗證函數
function validateEmojiMapping() {
  const filePath = path.join(__dirname, '../app/focus-finder/prototype/page.tsx');
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    console.log('\n🔍 驗證 emoji 對應...');
    
    // 提取所有任務定義
    const taskRegex = /{\s*id:\s*'([^']*)'[^}]*title:\s*'([^']*)'[^}]*emoji:\s*'([^']*)'[^}]*}/g;
    let match;
    let allCorrect = true;
    
    while ((match = taskRegex.exec(content)) !== null) {
      const [, taskId, title, emoji] = match;
      const expectedEmoji = CORRECT_EMOJI_MAPPING[taskId];
      
      if (expectedEmoji && emoji !== expectedEmoji) {
        console.log(`❌ ${title} (${taskId}): ${emoji} -> 應該是 ${expectedEmoji}`);
        allCorrect = false;
      } else {
        console.log(`✅ ${title} (${taskId}): ${emoji}`);
      }
    }
    
    return allCorrect;
    
  } catch (error) {
    console.error('❌ 驗證 emoji 對應時發生錯誤:', error);
    return false;
  }
}

// 主函數
function main() {
  console.log('🎮 ADHD 遊戲 Emoji 對應校正工具');
  console.log('=====================================\n');
  
  const fixed = fixEmojiMapping();
  const isValid = validateEmojiMapping();
  
  console.log('\n📊 總結:');
  console.log(`修正了問題: ${fixed ? '是' : '否'}`);
  console.log(`所有對應正確: ${isValid ? '是' : '否'}`);
  
  if (fixed) {
    console.log('\n🚀 請重新建置並測試遊戲');
  }
}

// 如果直接執行此腳本
if (require.main === module) {
  main();
}

module.exports = {
  fixEmojiMapping,
  validateEmojiMapping,
  CORRECT_EMOJI_MAPPING
};
