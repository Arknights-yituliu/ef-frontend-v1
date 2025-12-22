import Fuse from 'fuse.js';

// Section 接口定义，基于 queryCollectionSearchSections 返回的数据结构
interface SearchSection {
  id: string;
  title: string;
  titles: string[];
  content: string;
  level: number;
}

interface SearchResult {
  item: SearchSection;
  score: number;
  matches?: readonly any[];
}

export const useDocsSearch = () => {
  const { locale } = useI18n();
  const appConfig = useAppConfig();

  // 获取当前语言对应的文件后缀
  const getLanguageSuffix = () => {
    if (locale.value === 'zh-CN') {
      return 'zh';
    } else if (locale.value === 'en-US') {
      return 'en';
    } else {
      return '';
    }
  };

  // 从路由前缀提取集合名称（例如：/introduction -> introduction）
  const getCollectionNameFromPrefix = (prefix: string): string => {
    return prefix.replace(/^\//, '');
  };

  // 从 section id 中提取文档路径（去除锚点）
  // id 格式: /introduction/docs-setting-zh#section-name
  // 返回: /introduction/docs-setting-zh
  const getDocumentPath = (id: string): string => {
    return id.split('#')[0] || id;
  };

  // 加载所有文档的可搜索章节
  // 使用 queryCollectionSearchSections 来生成可搜索的章节
  // 参考: https://content.nuxt.com/docs/utils/query-collection-search-sections
  const loadSearchSections = async (): Promise<SearchSection[]> => {
    const langSuffix = getLanguageSuffix();

    try {
      // 获取所有文档路由前缀，如果为空则使用默认值
      const docsRoutePrefixes =
        appConfig.docsRoutePrefixes && appConfig.docsRoutePrefixes.length > 0
          ? appConfig.docsRoutePrefixes
          : [];

      // 从路由前缀中提取集合名称
      const collectionNames = docsRoutePrefixes.map(getCollectionNameFromPrefix);

      // 遍历所有集合，查询每个集合的可搜索章节
      const allSectionsPromises = collectionNames.map(async (collectionName: string) => {
        try {
          // 使用 queryCollectionSearchSections 生成可搜索章节
          // ignoredTags 选项可以忽略代码块等标签
          const sections = await queryCollectionSearchSections(collectionName as any, {
            ignoredTags: ['code'],
          });

          // 过滤出当前语言的章节
          // id 格式: /introduction/docs-setting-zh#section-name 或 /introduction/docs-setting-zh
          // 需要匹配 -zh 或 -en 后缀，但要避免误匹配（如 -zh-CN）
          return sections.filter((section: SearchSection) => {
            const id = section.id || '';
            // 匹配路径中包含 -zh 或 -en 的文档
            // 使用正则表达式确保匹配的是语言后缀，而不是其他包含这些字符的内容
            const langPattern = new RegExp(`-${langSuffix}(?:#|$)`);
            return langPattern.test(id);
          });
        } catch (error) {
          console.error(
            `Failed to load search sections from collection "${collectionName}":`,
            error,
          );
          return [];
        }
      });

      // 等待所有集合的章节加载完成，并合并结果
      const allSectionsArrays = await Promise.all(allSectionsPromises);
      return allSectionsArrays.flat();
    } catch (error) {
      console.error('Failed to load search sections:', error);
      return [];
    }
  };

  // 创建 Fuse 搜索实例
  // 参考: https://content.nuxt.com/docs/advanced/fulltext-search#fusejs-example
  const createSearchInstance = (sections: SearchSection[]) => {
    return new Fuse(sections, {
      keys: [
        { name: 'title', weight: 0.5 },
        { name: 'content', weight: 0.5 },
      ],
      threshold: 0.4, // 相似度阈值，0 为完全匹配，1 为匹配所有
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      useExtendedSearch: false,
    });
  };

  // 执行搜索
  const search = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const sections = await loadSearchSections();
    const fuse = createSearchInstance(sections);
    const results = fuse.search(query.trim());

    // 转换为 SearchResult 格式并按相似度排序（score 越小越相似）
    const sortedResults = results
      .map((result: any) => ({
        item: result.item,
        score: result.score || 1,
        matches: result.matches,
      }))
      .sort((a: SearchResult, b: SearchResult) => a.score - b.score);

    // 按文档路径去重，保留每个文档的最佳匹配结果（score 最低的）
    const uniqueResultsMap = new Map<string, SearchResult>();

    for (const result of sortedResults) {
      const docPath = getDocumentPath(result.item.id);

      // 如果该文档路径还没有结果，或者当前结果的 score 更低（更相似），则更新
      if (!uniqueResultsMap.has(docPath) || result.score < uniqueResultsMap.get(docPath)!.score) {
        uniqueResultsMap.set(docPath, result);
      }
    }

    // 将 Map 转换为数组，并保持按 score 排序
    return Array.from(uniqueResultsMap.values()).sort((a, b) => a.score - b.score);
  };

  return {
    loadSearchSections,
    search,
    getLanguageSuffix,
  };
};
