import Schema from "$lib/schemas/lib";

const productSchema = new Schema({
    name: String,
    published: Boolean,
    price: Number
})

export {
    productSchema
};