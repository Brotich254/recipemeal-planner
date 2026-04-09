class Recipe < ApplicationRecord
  belongs_to :user
  has_many :ingredients, dependent: :destroy
  has_many :meal_plans, dependent: :destroy

  validates :title, presence: true
  validates :category, inclusion: { in: %w[breakfast lunch dinner snack] }, allow_nil: true

  scope :public_recipes, -> { where(public: true) }
  scope :by_category, ->(cat) { where(category: cat) if cat.present? }
  scope :search, ->(q) { where("title ILIKE ?", "%#{q}%") if q.present? }
end
