<script lang="ts">
    import { FormGroup, Input } from 'sveltestrap'
    import { Markdown } from '$lib/schemas/lib/types'
    import MarkdownInput from '$lib/components/MarkdownInput.svelte'

    export let value
    export let schema
    export let property

    const getInputBehaviour = (): object => {
        let type: string
        switch (schema.dataModel[property].type) {
        case Boolean: {
            type = 'checkbox'
            break
        }
        case Number:
        case BigInt: {
            type = 'number'
            break
        }
        case Markdown: {
            type = 'markdown'
            break
        }
        case String: {
            type = 'textarea'
        }
        }
        return {
            type,
            isRequired: schema.dataModel[property].required
        }
    }

    const { type, isRequired } = getInputBehaviour()
    // Setting default value
    if (type === 'number') {
        value = value || 0
    }
</script>

{#if type === 'markdown'}
    <MarkdownInput bind:value/>
{:else}
    <FormGroup>
        <Input {type} bind:value required={isRequired} placeholder={isRequired ? 'povinné' : ''}/>
    </FormGroup>
{/if}
