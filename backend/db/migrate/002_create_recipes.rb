class CreateRecipes < ActiveRecord::Migration[7.1]
  def change
    create_table :recipes do |t|
      t.references :user, null: false, foreign_key: true
      t.string  :title, null: false
      t.text    :description
      t.text    :instructions
      t.string  :image_url
      t.integer :prep_time   # minutes
      t.integer :cook_time   # minutes
      t.integer :servings, default: 2
      t.string  :category    # breakfast, lunch, dinner, snack
      t.boolean :public, default: true
      t.timestamps
    end
  end
end
