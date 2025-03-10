const mongoose = require("mongoose");

const mealSchema = mongoose.Schema({
  name: String,
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  calories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  description: String,
  ingredients: [String],
  foodGroup: {
    type: String,
    enum: ['protein', 'carbs', 'fats', 'vegetables', 'fruits', 'dairy']
  }
});

const mealModel = mongoose.model("meal", mealSchema);

module.exports = { mealModel };