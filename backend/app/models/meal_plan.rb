class MealPlan < ApplicationRecord
  belongs_to :user
  belongs_to :recipe

  validates :planned_date, presence: true
  validates :meal_type, inclusion: { in: %w[breakfast lunch dinner snack] }
  validates :servings, numericality: { greater_than: 0 }
end
