# store/base
# Basic config for an alpine linux env with locale and non-root user.

FROM alpine:3.20

# Set system locale and timezone.
ENV LANG=en_AU.UTF-8 \
    LANGUAGE=en_AU:en \
    LC_ALL=en_AU.UTF-8
ENV TZ=Australia/Sydney

# Create a non-root user.
RUN adduser -g "Hugo Ludemann" -D hugo