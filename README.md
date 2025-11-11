Startup Sentiment Analysis Platform

A full-stack, microservice-based intelligence platform to track, analyze, and visualize news sentiment for competing startups.

This project is not just a simple sentiment-tracker. It's a complete data pipeline designed to solve complex, real-world challenges in competitive analysis, including:

Contextual Ambiguity: Differentiates between a company ("BoAt") and a common noun ("boat").

Targeted Sentiment: Correctly identifies that positive news for a competitor (like Zomato) is negative news for the company being tracked (like Swiggy).

High-Level Metrics: Aggregates data into actionable insights like Share of Voice (SoV) and Net Sentiment Score (NSS).

Frontend Repo: Bhoumik09/sentiment-analysis-frontend
Backend Repo: Bhoumik09/sentiment-analysis-backend

<p align="center">
<img
src="https://www.google.com/search?q=https://placehold.co/1200x600/2d3748/ffffff%3Ftext%3DProject%2520Dashboard%2520Screenshot"
alt="Project Dashboard Screenshot"
width="800"
/>
</p>

📊 Core Features

Trending Startups: A dashboard showing the top 4 startups of the week based on article volume.

Sentiment Movers: A "Top 4" list of startups with the largest percentage increase or decrease in sentiment.

Detailed Article Feed: A paginated feed of all news, filterable by startup, industry, or sentiment.

Competitor Analysis: Visual dashboards for comparing competitors' Share of Voice (SoV) and Net Sentiment Score (NSS) over time.

Targeted Sentiment: Each article accurately shows the sentiment for each startup mentioned, solving the "Swiggy vs. Zomato" problem.

🏗️ System Architecture

This project is built on a 3-tier microservice architecture to ensure security, scalability, and separation of concerns.

Next.js Frontend (The "Face"): The user-facing dashboard. It is a React/Next.js app that serves the UI. Its server also acts as a secure proxy, authenticating its own requests to the backend. The user's browser never has access to the data API.

Express.js API (The "Secure Guardian"): A "Backend-for-Frontend" (BFF). This is the only service that is allowed to talk to the database. It exposes secure endpoints for the Next.js app to consume, running complex SQL queries to aggregate data on the fly.

Python ETL Service (The "Brains"): A separate, background worker service that performs all the heavy lifting. It runs on a schedule to fetch, analyze, and load data into the database.

💡 How It Works: The Data Pipeline (Python Service)

The "Brains" of the operation is the Python ETL service. It uses an efficient "Article-First" workflow to save on costs and processing time.

1. Smart Fetching

Instead of running 30+ separate, expensive API calls for each startup, the pipeline runs 3-5 broad, consolidated queries for entire sectors (e.g., "Fintech", "EdTech", "Mobility").

2. Smart Filtering

This large batch of articles is scanned once using the Aho-Corasick algorithm (pyahocorasick). This specialized search engine finds all 30+ startup names in the text in a single pass, which is thousands of times faster than looping.

3. Smart Analysis (The "Secret Sauce")

This is what solves the "Swiggy vs. Zomato" problem. We do not use a basic sentiment model. We use a Zero-Shot Classification model from Hugging Face.

For an article like "Swiggy's profits soar, beating Zomato", the model is run once with multiple labels:

Text: "Swiggy's profits soar, beating Zomato"

Labels: ['positive for Swiggy', 'negative for Swiggy', 'positive for Zomato', 'negative for Zomato']

Result: The model correctly identifies:

positive for Swiggy (Score: 0.95)

negative for Zomato (Score: 0.92)

4. Smart Saving

This result is saved to our Many-to-Many schema. One Articles record is created, and two ArticlesSentiment records are created to link both startups to the same article with their unique, targeted sentiments.

🛠️ Technology Stack

Component

Technology

Frontend (UI & Proxy)

Next.js (React), TypeScript, Tailwind CSS, Recharts

Backend (Secure API)

Node.js, Express.js, TypeScript, Prisma, PostgreSQL

ETL (Data Pipeline)

Python, Hugging Face transformers, pyahocorasick, psycopg2 (or SQLAlchemy)

Database

PostgreSQL

News API

NewsAPI.org (or similar)

🚀 Getting Started (Local Setup)

To run the full system, you must run all three components (Database, Backend, Frontend) plus the Python script.

1. Database

Install and run PostgreSQL.

Create a new database (e.g., sentiment_db).

2. Backend (Express.js)

Clone the backend repo:

git clone [https://github.com/Bhoumik09/sentiment-analysis-backend.git](https://github.com/Bhoumik09/sentiment-analysis-backend.git)
cd sentiment-analysis-backend


Install dependencies: npm install

Create a .env file and add your database URL:

DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/sentiment_db"
PORT=8000
FRONTEND_URL="http://localhost:3000"
INTERNAL_API_KEY="your-secret-api-key"


Run migrations to create the database schema:

npx prisma migrate dev --name "init"


Seed the Sector table (run the createSectors.ts script you made).

Run the backend server:

npm run dev


Your API will be live at http://localhost:8000.

3. Frontend (Next.js)

In a new terminal, clone the frontend repo:

git clone [https://github.com/Bhoumik09/sentiment-analysis-frontend.git](https://github.com/Bhoumik09/sentiment-analysis-frontend.git)
cd sentiment-analysis-frontend


Install dependencies: npm install

Create a .env.local file to point to your backend:

NEXT_PUBLIC_API_URL="/api" # Use relative path for proxy
EXPRESS_BACKEND_URL="http://localhost:8000"
INTERNAL_API_KEY="your-secret-api-key"


Run the frontend server:

npm run dev


Your app will be live at http://localhost:3000.

4. ETL Service (Python)

In a new terminal, set up your Python environment (clone, create a venv, etc.).

Install dependencies:

pip install -r requirements.txt 
# (Create this file with: transformers, torch, pyahocorasick, psycopg2-binary, etc.)


Create a .env file for the Python script:

DB_NAME="sentiment_db"
DB_USER="YOUR_USER"
DB_PASSWORD="YOUR_PASSWORD"
DB_HOST="localhost"
NEWS_API_KEY="your-news-api-key"


Run the addStartups.py script once to populate the Startups table.

Run the main ETL script to fetch and analyze articles:

python main_etl.py


Once the script finishes, refresh your browser at http://localhost:3000 to see the new data.
