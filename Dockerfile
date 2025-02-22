FROM oven/bun:1.2.2 as builder
WORKDIR /build
COPY package.json /build/
RUN bun install
COPY . /build/
RUN bun run build

FROM nginx:stable-alpine
RUN cp /usr/share/zoneinfo/America/Bogota /etc/localtime && \
  echo "America/Bogota" >/etc/timezone
WORKDIR /usr/share/app
COPY --from=builder /build/dist/ /usr/share/app
