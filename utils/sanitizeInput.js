import sanitizeHtml from 'sanitize-html'

export function sanitizeInput(data) {

  const sanitizedData = {}

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      if (key === 'content') {
        sanitizedData[key] = sanitizeHtml(value, {
          allowedTags: ['b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'p', 'br', 'code', 'pre'],
          allowedAttributes: {
            'a': ['href']
          }
        })
      } else {
        sanitizedData[key] = sanitizeHtml(value, { allowedTags: ['b'], allowedAttributes: {}})
      }
    } else {
      sanitizedData[key] = value
    }
  }

  return sanitizedData
}