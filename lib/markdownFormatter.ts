/**
 * Formats markdown text into properly styled HTML
 */
export function formatMarkdown(text: string): string {
  if (!text) return ''

  let formatted = text

  // Split into blocks (double newlines)
  const blocks = formatted.split(/\n\s*\n/)
  
  return blocks.map(block => {
    let processed = block.trim()
    if (!processed) return ''

    // Headers
    if (processed.startsWith('## ')) {
      const content = processed.substring(3).trim()
      return `<h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4 pb-2 border-b border-slate-200">${formatInlineMarkdown(content)}</h2>`
    }
    if (processed.startsWith('### ')) {
      const content = processed.substring(4).trim()
      return `<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">${formatInlineMarkdown(content)}</h3>`
    }
    if (processed.startsWith('#### ')) {
      const content = processed.substring(5).trim()
      return `<h4 class="text-lg font-semibold text-slate-700 mt-4 mb-2">${formatInlineMarkdown(content)}</h4>`
    }

    // Lists (both - and *)
    if (processed.match(/^[\s]*[-*]\s/m)) {
      const listItems = processed.split(/\n/).filter(line => line.trim().match(/^[-*]\s/))
      if (listItems.length > 0) {
        const items = listItems.map(item => {
          const content = item.replace(/^[\s]*[-*]\s+/, '').trim()
          return `<li class="mb-2 text-slate-700 leading-relaxed">${formatInlineMarkdown(content)}</li>`
        }).join('')
        return `<ul class="list-disc list-outside ml-6 space-y-2 my-4">${items}</ul>`
      }
    }

    // Numbered lists
    if (processed.match(/^\d+\.\s/m)) {
      const listItems = processed.split(/\n/).filter(line => line.trim().match(/^\d+\.\s/))
      if (listItems.length > 0) {
        const items = listItems.map(item => {
          const content = item.replace(/^\d+\.\s+/, '').trim()
          return `<li class="mb-2 text-slate-700 leading-relaxed">${formatInlineMarkdown(content)}</li>`
        }).join('')
        return `<ol class="list-decimal list-outside ml-6 space-y-2 my-4">${items}</ol>`
      }
    }

    // Regular paragraphs
    const paragraphContent = processed.replace(/\n/g, ' ').trim()
    if (paragraphContent) {
      return `<p class="text-slate-700 leading-relaxed mb-4">${formatInlineMarkdown(paragraphContent)}</p>`
    }

    return ''
  }).join('')
}

/**
 * Formats inline markdown elements (bold, italic, etc.)
 */
function formatInlineMarkdown(text: string): string {
  let formatted = text

  // Bold **text** or __text__
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
  formatted = formatted.replace(/__(.+?)__/g, '<strong class="font-semibold text-slate-900">$1</strong>')

  // Italic *text* or _text_
  formatted = formatted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="italic text-slate-700">$1</em>')
  formatted = formatted.replace(/(?<!_)_([^_]+?)_(?!_)/g, '<em class="italic text-slate-700">$1</em>')

  // Links [text](url)
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')

  // Inline code `code`
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-slate-800">$1</code>')

  return formatted
}

