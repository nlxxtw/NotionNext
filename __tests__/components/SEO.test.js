import { generateStructuredData } from '@/components/SEO'

describe('SEO structured data', () => {
  const siteInfo = {
    title: 'Example Blog',
    description: 'Example description for search engines',
    icon: '/logo.png'
  }

  it('generates BlogPosting data for published articles', () => {
    const data = generateStructuredData(
      {
        type: 'Post',
        title: 'Structured data in NotionNext',
        description: 'A test article',
        publishTime: '2026-07-01T00:00:00.000Z',
        modifiedTime: '2026-07-02T00:00:00.000Z',
        tags: ['notion', 'seo'],
        category: 'Engineering'
      },
      siteInfo,
      'https://example.com/article/structured-data',
      'https://example.com/cover.png',
      'Example Author',
      'https://example.com'
    )

    expect(data['@context']).toBe('https://schema.org')
    expect(Array.isArray(data['@graph'])).toBe(true)

    const article = data['@graph'].find(item => item['@type'] === 'BlogPosting')
    expect(article).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Structured data in NotionNext',
      url: 'https://example.com/article/structured-data',
      datePublished: '2026-07-01T00:00:00.000Z',
      dateModified: '2026-07-02T00:00:00.000Z',
      keywords: 'notion, seo',
      articleSection: 'Engineering',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://example.com/article/structured-data'
      }
    })

    const org = data['@graph'].find(item => item['@type'] === 'Organization')
    expect(org.logo.url).toBe('https://example.com/logo.png')

    const breadcrumb = data['@graph'].find(
      item => item['@type'] === 'BreadcrumbList'
    )
    expect(breadcrumb.itemListElement.length).toBeGreaterThanOrEqual(2)
  })

  it('generates WebSite SearchAction and sitelinks for non-article pages', () => {
    const data = generateStructuredData(
      { type: 'Page' },
      siteInfo,
      'https://example.com/about',
      'https://example.com/cover.png',
      'Example Author',
      'https://example.com'
    )

    const website = data['@graph'].find(item => item['@type'] === 'WebSite')
    expect(website).toMatchObject({
      '@type': 'WebSite',
      name: 'Example Blog',
      url: 'https://example.com'
    })
    expect(website.potentialAction['@type']).toBe('SearchAction')
    expect(website.potentialAction.target.urlTemplate).toContain('/search/')

    const sitelinks = data['@graph'].find(item => item['@type'] === 'ItemList')
    expect(sitelinks.itemListElement[0]['@type']).toBe(
      'SiteNavigationElement'
    )
  })
})
