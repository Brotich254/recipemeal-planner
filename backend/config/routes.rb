Rails.application.routes.draw do
  namespace :api do
    post "/auth/register", to: "auth#register"
    post "/auth/login",    to: "auth#login"

    resources :recipes do
      resources :ingredients, only: [:index, :create, :destroy]
    end

    resources :meal_plans, only: [:index, :create, :destroy]
    get "/shopping_list", to: "meal_plans#shopping_list"
  end
end
