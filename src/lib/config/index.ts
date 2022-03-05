import Config from './definitions';
// Add your schema imports here
import { exampleSchema } from "$lib/schemas/schemas";

// CMS config
const index = new Config({
    adminAccounts: [],
    collections: [{
        name: '',
        schema: exampleSchema // Make and load your schema
    }]
})

export default index;