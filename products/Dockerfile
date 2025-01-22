FROM alpine:3.20

# Install database client and java runtime.
RUN apk add --update --no-cache postgresql-client openjdk8-jre-base

# Copy the jar.
COPY target/scala-3.6.2/products-assembly-0.1.0-SNAPSHOT.jar /home/products.jar

CMD ["java", "-jar", "/home/products.jar"]
