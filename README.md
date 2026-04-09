# MealCraft — Recipe & Meal Planner

Ruby on Rails API + React + PostgreSQL.

## Stack
- Backend: Ruby on Rails 7 (API mode), bcrypt, JWT, PostgreSQL
- Frontend: React, Vite, Tailwind, date-fns

## Setup

### Prerequisites
- Ruby 3.2+, Rails 7.1+
- PostgreSQL
- Node.js 18+

### Backend
```bash
cd backend
cp .env.example .env        # fill in DATABASE_URL and JWT_SECRET
bundle install
rails db:create db:migrate
rails server                # runs on port 3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                 # runs on port 5173
```

## Features
- Browse & search public recipes by category
- Create recipes with ingredients + instructions
- Weekly meal planner (calendar grid view)
- Auto-generated shopping list from planned meals (aggregates ingredients by date range)
- JWT auth
