FROM alpine:3.20

# Install some dependencies.
RUN apk add --no-cache \
    curl \
    doas \
    python3 \
    py3-pip \
    pipx

# Set system locale
ENV LANG=en_AU.UTF-8 \
    LANGUAGE=en_AU:en \
    LC_ALL=en_AU.UTF-8
# Needed?
# You might also need to generate the locale
# RUN localedef -i en_AU -c -f UTF-8 -A /usr/share/locale/locale.alias en_AU.UTF-8
# Set Timezone for postgres.
ENV TZ=Australia/Sydney

# Create a user and add to wheel group, so that thay can doas (although maybe this is bad practice and will never be needed?)
RUN adduser -g "Hugo Ludemann" -D hugo && \
    echo "permit persist hugo" >> /etc/doas.conf && \
    echo "permit nopass hugo" >> /etc/doas.conf
WORKDIR /home/hugo
USER hugo

# Install poetry as non-root.
RUN curl -sSL https://install.python-poetry.org | python3 -
# Append the location of the poetry executable to PATH.
ENV PATH=${PATH}:/home/hugo/.local/bin

# Copy application.
COPY . .

# Install dependencies.
RUN poetry install --no-interaction --no-ansi

# Go.
CMD ["poetry", "run", "python", "customers/main.py"]
