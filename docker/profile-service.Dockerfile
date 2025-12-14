# syntax=docker/dockerfile:1.6

FROM --platform=$BUILDPLATFORM golang:1.23-alpine AS build
ARG TARGETOS
ARG TARGETARCH
WORKDIR /app

COPY profile-service/go.mod profile-service/go.sum ./
RUN go mod download

COPY profile-service/ .

RUN CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH \
    go build -trimpath -ldflags="-s -w" -o /out/profile-service ./cmd/profile-service

FROM alpine:3.20
WORKDIR /app
COPY --from=build /out/profile-service ./profile-service

EXPOSE 8081
ENTRYPOINT ["./profile-service"]
