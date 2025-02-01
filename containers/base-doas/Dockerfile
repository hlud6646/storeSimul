# store/base/doas
# This image shows how to install doas (a modern version of sudo).
# Seems to me that this should almost never be needed, so this part
# has been taken out of the other images, but recorded here.

FROM store/base

# Install doas.
RUN apk add --no-cache doas

# You can create a new user like
RUN adduser -g "Hugo Ludemann" -D hugo

# This is how you tell `doas` that this user can use it.
RUN echo "permit persist hugo" >> /etc/doas.conf
RUN echo "permit nopass hugo" >> /etc/doas.conf
