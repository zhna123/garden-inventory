
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 50},
  description: { type: String, required: true, maxLength: 300},
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true},
  price: { type: String, required: true},
  quantity: { type: Number, required: true},
  image_path: {type: String, required: true},
  original_name: {type: String, required: true}
});

// Virtual for item's url
ItemSchema.virtual("url").get(function() {
  return `/catalog/item/${this._id}`
})

module.exports = mongoose.model("Item", ItemSchema)