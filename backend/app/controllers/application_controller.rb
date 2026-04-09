class ApplicationController < ActionController::API
  def encode_token(payload)
    JWT.encode(payload, ENV["JWT_SECRET"], "HS256")
  end

  def decode_token(token)
    JWT.decode(token, ENV["JWT_SECRET"], true, algorithm: "HS256")[0]
  rescue JWT::DecodeError
    nil
  end

  def current_user
    header = request.headers["Authorization"]
    token  = header&.split(" ")&.last
    return nil unless token

    decoded = decode_token(token)
    @current_user ||= User.find_by(id: decoded&.dig("user_id"))
  end

  def authenticate!
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user
  end
end
