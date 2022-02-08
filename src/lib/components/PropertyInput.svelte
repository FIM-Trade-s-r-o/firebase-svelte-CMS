<script lang="ts">
    import {FormGroup, Input} from "sveltestrap";

    export let value;
    export let schema;
    export let property;

    const getInputType = (): string => {
        let type: string;
        switch (schema.dataModel[property]) {
            case Boolean: {
                type = 'checkbox';
                break;
            }
            case Number:
            case BigInt: {
                type = 'number';
                break;
            }
            case String: {
                type = 'textarea';
            }
        }
        return type;
    }

    const type = getInputType();
</script>

<FormGroup>
    <Input {type} bind:value/>
</FormGroup>
