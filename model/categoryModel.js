const mongoose = require("mongoose");

// 1- create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLingth: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => { 
  if (doc.image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageURL;
  }

}
// find one , find all, update
categorySchema.post("init", (doc) => {
setImageURL(doc)
});
// create
categorySchema.post("save", (doc) => {
setImageURL(doc);
});
// 2 - create model
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
