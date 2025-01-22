FROM postgres:17.2-alpine3.21

# Needed?
# Install required packages for locale support
# RUN apk add --no-cache --update \
#     musl-locales \
#     musl-locale-utils \
#     tzdata

# Set system locale
ENV LANG=en_AU.UTF-8 \
    LANGUAGE=en_AU:en \
    LC_ALL=en_AU.UTF-8

# Needed?
# You might also need to generate the locale
# RUN localedef -i en_AU -c -f UTF-8 -A /usr/share/locale/locale.alias en_AU.UTF-8

# Set Timezone for postgres.
ENV TZ=Australia/Sydney

# Any .sql files in this dir will be executed when the container is created.
COPY ./postgres-init /docker-entrypoint-initdb.d/
