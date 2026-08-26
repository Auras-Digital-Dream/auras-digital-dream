#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ORIGIN, routes } from './routes.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const client = path.join(root, 'dist', 'client')
const failures = []
const all = routes()
const seenTitles = new Map()
const seenDescriptions = new Map()
const renderedHtml = new Map()

const fail = (route, message) => failures.push(`${route}: ${message}`)
const match = (html, expression) => html.match(expression)?.[1]?.trim()
const typesIn = (value, found = new Set()) => {
  if (!value || typeof value !== 'object') return found
  if (Array.isArray(value)) {
    value.forEach((item) => typesIn(item, found))
    return found
  }
  if (value['@type']) {
    const values = Array.isArray(value['@type']) ? value['@type'] : [value['@type']]
    values.forEach((type) => found.add(type))
  }
  Object.values(value).forEach((item) => typesIn(item, found))
  return found
}

for (const route of all) {
  const file = route.url === '/' ? path.join(client, 'index.html') : path.join(client, route.url, 'index.html')
  if (!existsSync(file)) {
    fail(route.url, 'lipsește fișierul HTML prerandat')
    continue
  }

  const html = readFileSync(file, 'utf8')
  renderedHtml.set(route.url, html)
  const canonical = match(html, /<link rel="canonical" href="([^"]+)"/i)
  const title = match(html, /<title>([\s\S]*?)<\/title>/i)
  const description = match(html, /<meta name="description" content="([^"]+)"/i)
  const robots = match(html, /<meta name="robots" content="([^"]+)"/i) || ''
  const ogUrl = match(html, /<meta property="og:url" content="([^"]+)"/i)
  const ogImage = match(html, /<meta property="og:image" content="([^"]+)"/i)
  const ogAlt = match(html, /<meta property="og:image:alt" content="([^"]+)"/i)
  const twitterImage = match(html, /<meta name="twitter:image" content="([^"]+)"/i)
  const expectedUrl = ORIGIN + route.url

  if (!/<html lang="ro"/i.test(html)) fail(route.url, 'limba documentului nu este ro')
  if (!/<h1(?:\s|>)/i.test(html)) fail(route.url, 'lipsește un H1 textual')
  if (canonical !== expectedUrl) fail(route.url, `canonical incorect: ${canonical || 'lipsește'}`)
  if (ogUrl !== expectedUrl) fail(route.url, `og:url incorect: ${ogUrl || 'lipsește'}`)
  if (!title || title.length < 20 || title.length > 70) fail(route.url, `titlu în afara intervalului util: ${title?.length || 0} caractere`)
  if (!description || description.length < 70 || description.length > 180) fail(route.url, `descriere în afara intervalului util: ${description?.length || 0} caractere`)
  if (!robots.includes('index') || !robots.includes('max-image-preview:large')) fail(route.url, 'directiva robots pentru indexare și preview mare lipsește')
  if (!ogImage?.startsWith(`${ORIGIN}/`) || twitterImage !== ogImage) fail(route.url, 'imaginea socială nu este absolută sau nu coincide cu Twitter')
  if (!ogAlt || ogAlt.length < 12) fail(route.url, 'descrierea imaginii sociale lipsește')

  if (ogImage?.startsWith(`${ORIGIN}/`)) {
    const imageFile = path.join(client, new URL(ogImage).pathname.replace(/^\//, ''))
    if (!existsSync(imageFile)) fail(route.url, `imaginea socială nu există: ${new URL(ogImage).pathname}`)
  }

  if (seenTitles.has(title)) fail(route.url, `titlu duplicat cu ${seenTitles.get(title)}`)
  else seenTitles.set(title, route.url)
  if (seenDescriptions.has(description)) fail(route.url, `descriere duplicată cu ${seenDescriptions.get(description)}`)
  else seenDescriptions.set(description, route.url)

  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  if (!scripts.length) fail(route.url, 'lipsește JSON-LD')
  const schemaTypes = new Set()
  for (const script of scripts) {
    try { typesIn(JSON.parse(script[1]), schemaTypes) }
    catch (error) { fail(route.url, `JSON-LD invalid: ${error.message}`) }
  }
  for (const required of ['WebSite', 'Person']) {
    if (!schemaTypes.has(required)) fail(route.url, `schema ${required} lipsește`)
  }
  if (route.url === '/' && !schemaTypes.has('ProfessionalService')) fail(route.url, 'schema ProfessionalService lipsește')
  if (route.url === '/studio' && (!schemaTypes.has('CollectionPage') || !schemaTypes.has('FAQPage'))) fail(route.url, 'schema Studio/FAQ este incompletă')
  if (route.url === '/cartile-mele' && (!schemaTypes.has('CollectionPage') || !schemaTypes.has('Book'))) fail(route.url, 'schema colecției de cărți este incompletă')
  if (route.url.startsWith('/portofoliu/') && (!schemaTypes.has('CreativeWork') || !schemaTypes.has('BreadcrumbList'))) fail(route.url, 'schema studiului de caz este incompletă')
}

for (const [sourceRoute, html] of renderedHtml) {
  for (const link of html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
    const href = link[1]
    if (!href.startsWith('/')) continue
    const target = new URL(href, ORIGIN)
    const pathname = target.pathname.replace(/\/$/, '') || '/'
    const isRoute = all.some((route) => route.url === pathname)
    const isAsset = existsSync(path.join(client, pathname.replace(/^\//, '')))
    if (!isRoute && !isAsset) {
      fail(sourceRoute, `link intern fără destinație: ${href}`)
      continue
    }
    if (isRoute && target.hash) {
      const targetHtml = renderedHtml.get(pathname)
      const id = target.hash.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (targetHtml && !new RegExp(`\\bid=["']${id}["']`, 'i').test(targetHtml)) {
        fail(sourceRoute, `ancoră inexistentă: ${href}`)
      }
    }
  }
}

const sitemapFile = path.join(client, 'sitemap.xml')
const sitemap = existsSync(sitemapFile) ? readFileSync(sitemapFile, 'utf8') : ''
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((item) => item[1])
const expectedUrls = all.map((route) => ORIGIN + route.url)
if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls)) fail('sitemap.xml', 'lista URL-urilor diferă de registrul rutelor canonice')

const robotsFile = path.join(client, 'robots.txt')
const robots = existsSync(robotsFile) ? readFileSync(robotsFile, 'utf8') : ''
if (!/User-agent:\s*OAI-SearchBot[\s\S]*?Allow:\s*\//i.test(robots)) fail('robots.txt', 'OAI-SearchBot nu este permis explicit')
if (!robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`)) fail('robots.txt', 'referința către sitemap lipsește')

const llmsFile = path.join(client, 'llms.txt')
const llms = existsSync(llmsFile) ? readFileSync(llmsFile, 'utf8') : ''
for (const route of all) {
  if (!llms.includes(`${ORIGIN}${route.url}`)) fail('llms.txt', `ruta ${route.url} lipsește`)
}

const notFoundFile = path.join(client, '404.html')
const notFound = existsSync(notFoundFile) ? readFileSync(notFoundFile, 'utf8') : ''
if (!/<meta name="robots" content="noindex, follow"/i.test(notFound)) fail('404.html', 'directiva noindex lipsește')

if (failures.length) {
  console.error(`SEO audit failed (${failures.length}):\n- ${failures.join('\n- ')}`)
  process.exit(1)
}

console.log(`SEO audit passed: ${all.length} rute canonice, metadate unice, JSON-LD, sitemap, robots.txt, llms.txt și 404.`)
