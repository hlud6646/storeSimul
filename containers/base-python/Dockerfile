# store/base/python

# Pthon base image. Inherits from the base and installs a
# package manager and virtual env manager. This image creates and
# changes to a normal user.

FROM store/base
RUN apk add --no-cache \
    curl \
    python3 \
    py3-pip \
    pipx