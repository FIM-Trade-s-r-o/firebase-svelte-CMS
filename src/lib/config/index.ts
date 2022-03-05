import Config from './definitions';
// Add your schema imports here
import { sectionSchema } from "$lib/schemas/schemas";

// CMS config
const index = new Config({
    adminAccounts: ['filip.holcik.official@gmail.com', 'farbysupercolor@gmail.com'],
    collections: [{
        name: 'sections',
        schema: sectionSchema
    }]
})

export default index;