FROM python:3.13-slim

WORKDIR /app

# Install uv for faster dependency management
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv sync --frozen

# Copy application code
COPY backend ./backend

# Expose port
EXPOSE 9999

# Run the application
CMD ["uv", "run", "python", "backend/main.py"]
