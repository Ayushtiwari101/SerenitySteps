const mongoose = require("mongoose");

const nutritionPlanSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  weight: Number,
  height: Number,
  age: Number,
  gender: String,
  activityLevel: String,
  goal: String,
  unit: String,
  heightUnit: String,
  dailyCalories: Number,
  protein: Number,
  carbs: Number,
  fats: Number,
  waterIntake: Number,
  selectedMeals: [{
    mealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'meal'
    },
    date: Date,
    category: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const nutritionPlanModel = mongoose.model("nutritionPlan", nutritionPlanSchema);

module.exports = { nutritionPlanModel };