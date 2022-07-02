<script lang="ts">
    import { FormGroup, Input } from 'sveltestrap'

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

<FormGroup>
    <Input {type} bind:value required={isRequired} placeholder={isRequired ? 'povinné' : ''}/>
</FormGroup>
