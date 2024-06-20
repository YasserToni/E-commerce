const mongoose  = require("mongoose");

// 1- create schema
const brandsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brands required"],
      unique: [true, "brands must be unique"],
      minLingth: [3, "Too short brands name"],
      maxLength: [32, "Too long brands name"],
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
    const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageURL;
  }
};

// find one , find all, update
brandsSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
brandsSchema.post("save", (doc) => {
  setImageURL(doc);
});

// 2 - create model
const brandsModel = mongoose.model("Brands", brandsSchema);

module.exports = brandsModel;
