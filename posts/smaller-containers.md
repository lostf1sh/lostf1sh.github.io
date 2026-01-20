---
title: the case for smaller containers
date: 2025-12-01
tags: [docker, containers, optimization, devops]
excerpt: building images under 50mb instead of gigabytes and why it matters.
---

# the case for smaller containers

a 1.2gb python image for a 10mb script is ridiculous. here is how i shrank my deployments.

## start small

```
FROM python:3.12-slim
# vs
FROM python:3.12
```

slim saves 800mb immediately. alpine saves more but brings libc compatibility issues.

for go binaries:
```
FROM scratch
COPY main /main
```

zero runtime dependencies. the image is just your binary.

## multi-stage builds

```
FROM golang:1.21 AS builder
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o main main.go

FROM alpine:latest
COPY --from=builder /main /main
CMD ["/main"]
```

builder stage is discarded. final image contains only what runs.

## tooling

- `dive`: inspect layer contents
- `docker-slim`: auto-optimize
- `grype`: scan for vulnerabilities in thin images

## numbers

| stack | before | after |
|-------|--------|-------|
| go api | 950mb | 12mb |
| node scraper | 1.1gb | 145mb |
| python etl | 2.3gb | 89mb |

smaller images deploy faster, scan faster, and have smaller attack surfaces.

-- moli
