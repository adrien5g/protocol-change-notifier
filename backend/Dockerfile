FROM python:3.13-slim

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen

COPY backend ./backend

EXPOSE 9999

CMD ["uv", "run", "python", "backend/main.py"]
