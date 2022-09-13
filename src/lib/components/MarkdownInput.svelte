<script lang="ts">
    import 'bytemd/dist/index.css'
    import { Editor } from 'bytemd'
    import type { BytemdLocale } from 'bytemd'
    import { Markdown } from '$lib/schemas/lib/types'

    export let value
    let markdown = new Markdown(value)

    const slovakLocale: BytemdLocale = {
        write: 'Písať',
        preview: 'Prehliadať',
        writeOnly: 'Iba úpravy',
        exitWriteOnly: 'Koniec úprav',
        previewOnly: 'Iba prehliadanie',
        exitPreviewOnly: 'Koniec prehliadania',
        help: 'Pomoc',
        closeHelp: 'Zavrieť pomoc',
        toc: 'Tabuľka obsahu',
        closeToc: 'Zavrieť tabuľku obsahu',
        fullscreen: 'Celá obrazovka',
        exitFullscreen: 'Koniec celej obrazovky',
        source: 'Zdroj',
        cheatsheet: 'Ťahák',
        shortcuts: 'Skratky',
        words: 'Slová',
        lines: 'Riadky',
        sync: 'Synchronizovať',
        top: 'Vyskrolovať hore',
        limited: 'Obmedzené',
        h1: 'Nadpis 1',
        h2: 'Nadpis 2',
        h3: 'Nadpis 3',
        h4: 'Nadpis 4',
        h5: 'Nadpis 5',
        h6: 'Nadpis 6',
        headingText: 'Nadpis',
        bold: 'Hrubý text',
        boldText: 'Toto je hrubé',
        italic: 'Šikmý text',
        italicText: 'Toto je šikmé',
        quote: 'Citácia',
        quotedText: 'Toto je citácia',
        link: 'Link',
        linkText: 'Odkaz',
        image: 'Obrázov',
        imageAlt: 'Alternatíva obrázku',
        imageTitle: 'Názov obrázku',
        code: 'Kód',
        codeText: 'console.log("kód")',
        codeBlock: 'Blok kódu',
        codeLang: 'SK',
        ul: 'Nezoradený zoznam',
        ulItem: 'Položka nezoradeného zoznamu',
        ol: 'Zoradený zoznam',
        olItem: 'Položka zoradeného zoznamu',
        hr: 'Horizontálna čiara'
    }

    const handleChange = (event) => {
        // Sanitization
        markdown = Markdown(event.detail.value)
        value = markdown.toString()
    }
</script>

<Editor bind:value locale={slovakLocale} on:change={handleChange}/>
