import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata = {
  title: 'Documentation - Citizen Engagement Platform',
  description: 'Platform documentation and user guides',
}

async function getReadmeContent() {
  try {
    const readmePath = path.join(process.cwd(), 'README.md')
    const fileContents = fs.readFileSync(readmePath, 'utf8')

    const matterResult = matter(fileContents)
    const processedContent = await remark().use(html).process(matterResult.content)
    const contentHtml = processedContent.toString()

    return contentHtml
  } catch (error) {
    console.error('Error reading README:', error)
    return null
  }
}

export default async function DocsPage() {
  const contentHtml = await getReadmeContent()

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Documentation</h1>

      <Card>
        <CardHeader>
          <CardTitle>Platform Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          {contentHtml ? (
            <div
              className="prose prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          ) : (
            <div className="text-muted-foreground">
              Documentation content is not available at the moment.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
