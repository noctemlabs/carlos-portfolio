FROM golang:1.23-alpine AS build
WORKDIR /app
COPY profile-service/go.mod profile-service/go.sum ./
RUN go mod download
COPY profile-service/ .
RUN go build -o profile-service ./cmd/profile-service

FROM alpine:3.20
WORKDIR /app
ENV PORT=8081
COPY --from=build /app/profile-service /app/profile-service
EXPOSE 8081
ENTRYPOINT ["/app/profile-service"]
