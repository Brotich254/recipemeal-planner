class CreateMealPlans < ActiveRecord::Migration[7.1]
  def change
    create_table :meal_plans do |t|
      t.references :user,   null: false, foreign_key: true
      t.references :recipe, null: false, foreign_key: true
      t.date   :planned_date, null: false
      t.string :meal_type, null: false  # breakfast, lunch, dinner, snack
      t.integer :servings, default: 1
      t.timestamps
    end
    add_index :meal_plans, [:user_id, :planned_date]
  end
end
