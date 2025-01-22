# Containers

Playground for learning how to write a nice dockerfile.

## Useful points for beginnners.

> Avoid installing or using sudo ... If you absolutely need functionality similar to sudo ...  consider using “gosu”.
Looks like for siple projects, if you need to change users you're probably **doing it wrong**.



## Instance Stack 
Build them bit by bit. It saves a lot of time.

Alpine:3.21
↓
dev/image1  --  Install bash.
↓
dev/image2  --  Install some other dependencies and make a non root user.
↓
dev/image3  --  Install poetry, add it to the PATH, copy a project in and install dependencies.
↓
Set some db env 

