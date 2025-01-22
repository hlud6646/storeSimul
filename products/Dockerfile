FROM alpine:3.20

# Install database client and java runtime.
RUN apk add --update --no-cache postgresql-client openjdk8-jre-base

# Set system locale
ENV LANG=en_AU.UTF-8 \
    LANGUAGE=en_AU:en \
    LC_ALL=en_AU.UTF-8
# Needed?
# You might also need to generate the locale
# RUN localedef -i en_AU -c -f UTF-8 -A /usr/share/locale/locale.alias en_AU.UTF-8
# Set Timezone for postgres.
ENV TZ=Australia/Sydney

# Copy the jar.
COPY target/scala-3.6.2/products-assembly-0.1.0-SNAPSHOT.jar /home/products.jar

# Go.
CMD ["java", "-jar", "/home/products.jar"]
