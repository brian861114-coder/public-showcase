import { config, fields, collection } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'NOTES 後台' },
  },
  collections: {
    posts: collection({
      label: '文章',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: {
            label: '標題',
            validation: { isRequired: true },
          },
        }),
        description: fields.text({
          label: '摘要',
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: '發布日期',
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({
          label: '更新日期（選填）',
        }),
        category: fields.select({
          label: '分類',
          options: [
            { label: '隨筆', value: 'essay' },
            { label: '技術', value: 'tech' },
            { label: '生活', value: 'life' },
            { label: '學習', value: 'learn' },
          ],
          defaultValue: 'essay',
        }),
        tone: fields.text({
          label: '卡片底色',
          defaultValue: '#cce8f3',
          description: '例如 #cce8f3、#f6d7b8',
        }),
        mark: fields.text({
          label: '卡片裝飾字',
          defaultValue: '筆記',
        }),
        coverLabel: fields.text({
          label: '卡片中央標題（選填）',
        }),
        coverHint: fields.text({
          label: '卡片小字（選填）',
        }),
        draft: fields.checkbox({
          label: '草稿（不在前台顯示）',
          defaultValue: false,
        }),
        content: fields.mdx({
          label: '正文',
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
          components: {
            Video: block({
              label: '短片（mp4）',
              schema: {
                src: fields.text({
                  label: '影片路徑',
                  description: '例如 /videos/demo.mp4',
                  validation: { isRequired: true },
                }),
                poster: fields.text({
                  label: '封面圖路徑（選填）',
                  description: '例如 /images/sample-illustration.svg',
                }),
              },
            }),
          },
        }),
      },
    }),
  },
});
