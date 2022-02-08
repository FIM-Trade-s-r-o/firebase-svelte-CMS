import Schema from "$lib/schemas/lib";

const sectionSchema = new Schema({
    title: String,
    text: String,
    image: String,
    order: Number
})

export {
    sectionSchema
};