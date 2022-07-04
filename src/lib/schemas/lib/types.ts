import sanitize from 'sanitize-html'

class Markdown extends String {
    constructor (markdown) {
        super(sanitize(markdown))
    }
}

export {
    Markdown
}
