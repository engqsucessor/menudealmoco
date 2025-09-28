FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install UV
RUN pip install uv

# Copy UV configuration files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uv", "run", "python", "run.py"]