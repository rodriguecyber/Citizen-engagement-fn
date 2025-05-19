import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import DocsPage from './page'

export async function generateMetadata() {
    return {
        title: 'Documentation - Citizen Engagement Platform',
        description: 'Platform documentation and user guides',
    }
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

export default async function DocsPageServer() {
    const contentHtml = await getReadmeContent()
    //@ts-expect-error err
    return <DocsPage contentHtml={contentHtml} />
} 