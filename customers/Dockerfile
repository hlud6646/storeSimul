# store/customers

FROM store/base/python

# RUN apk add --no-cache postgresql-libs
# RUN apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev

USER hugo
WORKDIR /home/hugo 

# Copy application.
COPY . .

RUN pipx install poetry
ENV PATH="/home/hugo/.local/bin:$PATH"

# Install dependencies.
RUN poetry install --no-interaction --no-ansi

# Go.
CMD ["poetry", "run", "python", "customers/main.py"]
