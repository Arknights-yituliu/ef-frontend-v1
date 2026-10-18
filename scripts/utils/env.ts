import dotenv from 'dotenv';

// 从环境变量加载数据目录，避免硬编码路径
dotenv.config();

if (!process.env.ENDFIELD_DATA_DIR) {
  throw new Error(
    '请设置环境变量 ENDFIELD_DATA_DIR，指向数据的根目录（即 TableCfg 文件夹的父目录）。',
  );
}

/** 解包数据的根目录（即 TableCfg 文件夹的父目录） */
export const endfieldDataDir: string = process.env.ENDFIELD_DATA_DIR;
