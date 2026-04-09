module Api
  class AuthController < ApplicationController
    def register
      user = User.new(user_params)
      if user.save
        token = encode_token({ user_id: user.id, exp: 7.days.from_now.to_i })
        render json: { token: token, user: user_json(user) }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def login
      user = User.find_by(email: params[:email]&.downcase)
      if user&.authenticate(params[:password])
        token = encode_token({ user_id: user.id, exp: 7.days.from_now.to_i })
        render json: { token: token, user: user_json(user) }
      else
        render json: { error: "Invalid credentials" }, status: :unauthorized
      end
    end

    private

    def user_params
      params.permit(:name, :email, :password)
    end

    def user_json(user)
      { id: user.id, name: user.name, email: user.email }
    end
  end
end
