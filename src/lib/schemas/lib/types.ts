import sanitize from 'sanitize-html'

function Markdown (markdown) {
    if (markdown) {
        sanitize(markdown)
    } else return 'md'
}

export {
    Markdown
}
