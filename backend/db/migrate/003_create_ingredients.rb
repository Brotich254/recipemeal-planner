class CreateIngredients < ActiveRecord::Migration[7.1]
  def change
    create_table :ingredients do |t|
      t.references :recipe, null: false, foreign_key: true
      t.string  :name, null: false
      t.decimal :quantity, precision: 8, scale: 2
      t.string  :unit   # cups, grams, tbsp, etc.
      t.timestamps
    end
  end
end
