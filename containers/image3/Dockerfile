FROM dev/image2

RUN curl -sSL https://install.python-poetry.org | python3 -

# Append the location of the poetry executable to PATH.
ENV PATH=${PATH}:/home/hugo/.local/bin

COPY . .

RUN poetry install