import sanitize from 'sanitize-html'

function Markdown (markdown) {
    return markdown ? sanitize(markdown) : 'md'
}

export {
    Markdown
}
