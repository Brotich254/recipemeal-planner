class User < ApplicationRecord
  has_secure_password
  has_many :recipes, dependent: :destroy
  has_many :meal_plans, dependent: :destroy

  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true

  before_save { self.email = email.downcase }
end
