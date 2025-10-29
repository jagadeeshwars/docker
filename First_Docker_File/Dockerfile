FROM ubuntu

WORKDIR /app

COPY . /app

RUN apt update -y && apt install -y python3 python3-pip

ENV NAME World

EXPOSE 8000

CMD ["python3","app.py"]
