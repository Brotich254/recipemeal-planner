module Api
  class RecipesController < ApplicationController
    before_action :authenticate!, only: [:create, :update, :destroy]
    before_action :set_recipe, only: [:show, :update, :destroy]

    # GET /api/recipes — public + user's own
    def index
      recipes = Recipe.public_recipes
                      .by_category(params[:category])
                      .search(params[:q])
                      .includes(:ingredients, :user)
                      .order(created_at: :desc)

      # Also include current user's private recipes
      if current_user
        private_recipes = current_user.recipes.where(public: false)
                                      .by_category(params[:category])
                                      .search(params[:q])
        recipes = (recipes + private_recipes).uniq
      end

      render json: recipes.map { |r| recipe_json(r) }
    end

    def show
      render json: recipe_json(@recipe, full: true)
    end

    def create
      recipe = current_user.recipes.new(recipe_params)
      if recipe.save
        # Save ingredients if provided
        if params[:ingredients].present?
          params[:ingredients].each do |ing|
            recipe.ingredients.create(name: ing[:name], quantity: ing[:quantity], unit: ing[:unit])
          end
        end
        render json: recipe_json(recipe, full: true), status: :created
      else
        render json: { errors: recipe.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      authorize_recipe!
      if @recipe.update(recipe_params)
        render json: recipe_json(@recipe, full: true)
      else
        render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      authorize_recipe!
      @recipe.destroy
      head :no_content
    end

    private

    def set_recipe
      @recipe = Recipe.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Recipe not found" }, status: :not_found
    end

    def authorize_recipe!
      render json: { error: "Forbidden" }, status: :forbidden unless @recipe.user_id == current_user.id
    end

    def recipe_params
      params.permit(:title, :description, :instructions, :image_url, :prep_time, :cook_time, :servings, :category, :public)
    end

    def recipe_json(recipe, full: false)
      data = {
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        image_url: recipe.image_url,
        prep_time: recipe.prep_time,
        cook_time: recipe.cook_time,
        servings: recipe.servings,
        category: recipe.category,
        public: recipe.public,
        author: recipe.user&.name,
        created_at: recipe.created_at
      }
      if full
        data[:instructions] = recipe.instructions
        data[:ingredients] = recipe.ingredients.map do |i|
          { id: i.id, name: i.name, quantity: i.quantity, unit: i.unit }
        end
      end
      data
    end
  end
end
