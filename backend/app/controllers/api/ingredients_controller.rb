module Api
  class IngredientsController < ApplicationController
    before_action :authenticate!
    before_action :set_recipe

    def index
      render json: @recipe.ingredients
    end

    def create
      ingredient = @recipe.ingredients.create!(ingredient_params)
      render json: ingredient, status: :created
    rescue ActiveRecord::RecordInvalid => e
      render json: { error: e.message }, status: :unprocessable_entity
    end

    def destroy
      @recipe.ingredients.find(params[:id]).destroy
      head :no_content
    end

    private

    def set_recipe
      @recipe = Recipe.find(params[:recipe_id])
    end

    def ingredient_params
      params.permit(:name, :quantity, :unit)
    end
  end
end
