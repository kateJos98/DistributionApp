FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8002

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
