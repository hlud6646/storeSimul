FROM dev/image1

# Install some dependencies.
RUN apk add --no-cache \
   curl \
   doas \
   python3 \
   py3-pip \
   pipx

# Create a user and add to wheel group, so that thay can doas (although maybe this is bad practice and will never be needed?)
RUN adduser -g "Hugo Ludemann" -D hugo && \
    echo "permit persist hugo" >> /etc/doas.conf && \
    echo "permit nopass hugo" >> /etc/doas.conf

WORKDIR /home/hugo
USER hugo
