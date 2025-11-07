// https://nuxt-content.zhcndoc.com/docs/collections/define#defining-collections
import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        introduction: defineCollection({
            // 指定内容的类型
            type: 'page',
            // 加载`content`目录下的每个文件
            source: '**',
        })
    }
})
