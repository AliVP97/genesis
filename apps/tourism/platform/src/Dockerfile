# Run app
FROM docker-proxy.780.ir/node:20.15.0

ARG BUILD_FILE=build.tar.gz

WORKDIR /
COPY ${BUILD_FILE} /build.tar

WORKDIR /app

# 1) bring in and unpack everything
COPY ${BUILD_FILE} .
RUN tar xf ${BUILD_FILE} \
 && rm ${BUILD_FILE}

# 2) flatten the standalone output
RUN rm -rf .next/standalone/public
RUN mv public .next/standalone
RUN mv .next/static .next/standalone/.next

EXPOSE 3000
CMD ["node", ".next/standalone/server.js"]