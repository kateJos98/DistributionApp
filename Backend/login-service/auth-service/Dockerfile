FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8001

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
