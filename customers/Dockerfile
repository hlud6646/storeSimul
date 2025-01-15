FROM alpine:latest
WORKDIR /usr/local/app

# Copy a file in to see how that works. 
COPY ./pyproject.toml ./
COPY ./README.md      ./
COPY ./customers      ./customers/
COPY ./server.py      ./

# Expose a port.
EXPOSE 8080

# Dependencies.
RUN apk update && \
    apk add bash python3 py3-pip pipx helix


# Ensure pipx path is added and install poetry
ENV PATH="/root/.local/bin:$PATH"
RUN pipx install poetry
RUN poetry install

# Create a non root user and switch to it.
# RUN adduser -D intern
# USER intern

CMD ["python", "server.py"]