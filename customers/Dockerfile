# store/customers

FROM store/base/python

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
