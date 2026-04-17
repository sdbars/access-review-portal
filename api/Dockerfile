FROM golang:1.26-alpine

WORKDIR /app

COPY . .

RUN go build -o server ./cmd/server

EXPOSE 8080

CMD ["./server"]