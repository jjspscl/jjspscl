import { s } from "sanity-typed-schema-builder";

const blogSchema = s.document({
    name: "blog",
    fields: [{
        name: "title",
        type: s.string()
    }]
})

export default blogSchema.schema()