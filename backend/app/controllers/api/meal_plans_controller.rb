module Api
  class MealPlansController < ApplicationController
    before_action :authenticate!

    # GET /api/meal_plans?start=2024-01-01&end=2024-01-07
    def index
      plans = current_user.meal_plans
                          .includes(recipe: :ingredients)
                          .order(:planned_date)

      plans = plans.where(planned_date: params[:start]..params[:end]) if params[:start] && params[:end]

      render json: plans.map { |p| plan_json(p) }
    end

    def create
      plan = current_user.meal_plans.new(plan_params)
      if plan.save
        render json: plan_json(plan), status: :created
      else
        render json: { errors: plan.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      plan = current_user.meal_plans.find(params[:id])
      plan.destroy
      head :no_content
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Not found" }, status: :not_found
    end

    # GET /api/shopping_list?start=...&end=...
    # Aggregates all ingredients from planned meals in the date range
    def shopping_list
      plans = current_user.meal_plans
                          .includes(recipe: :ingredients)
                          .where(planned_date: params[:start]..params[:end])

      aggregated = Hash.new { |h, k| h[k] = { quantity: 0, unit: nil } }

      plans.each do |plan|
        multiplier = plan.servings.to_f / [plan.recipe.servings.to_f, 1].max
        plan.recipe.ingredients.each do |ing|
          key = "#{ing.name.downcase}__#{ing.unit}"
          aggregated[key][:name]     = ing.name
          aggregated[key][:unit]     = ing.unit
          aggregated[key][:quantity] += (ing.quantity.to_f * multiplier).round(2)
        end
      end

      render json: aggregated.values
    end

    private

    def plan_params
      params.permit(:recipe_id, :planned_date, :meal_type, :servings)
    end

    def plan_json(plan)
      {
        id: plan.id,
        planned_date: plan.planned_date,
        meal_type: plan.meal_type,
        servings: plan.servings,
        recipe: {
          id: plan.recipe.id,
          title: plan.recipe.title,
          image_url: plan.recipe.image_url,
          prep_time: plan.recipe.prep_time,
          cook_time: plan.recipe.cook_time,
          category: plan.recipe.category
        }
      }
    end
  end
end
