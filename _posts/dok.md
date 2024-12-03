---
title: "Containerized dev process made easy with Dok"
excerpt: "Docker is powerful tool for creating dev environments, but can also be a pain to use. I wrote a wrapper for some common docker commands, packaged in a little command tool called 'dok'."
coverImage: "/assets/blog/dok/cover.png"
date: "2024-12-03T05:35:07.322Z"
author:
  name: Tim Gu
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/dok/cover.jpg"
---
In my work, I often have to test code in various environments, including on different operating systems and with different framework versions, which makes `docker` an essential, integrated part of my workflow. I am no stranger to `docker`, and I have been using it for several years now. While loving it, with passion, I have also developed a couple of pet peeves along the process. Personally, I feel that getting a dev environment running with docker is, more often than not, not really ergonomic out of the box, especially if the containers require a lot of customized settings. 

## The Rant
**The following is going to be a rant about a list of frustrations I have with using `docker`. Please feel free to skip ahead to more productive sections.*

### Case 1: Reusing long docker run commands
Take the official `rocm/pytorch` image for example. For those who are not familiar with `ROCm`, it is AMD's ML framework for AMD GPUs, the counterpart to NVIDIA's CUDA. According to the [official docs](https://rocm.docs.amd.com/projects/install-on-linux/en/docs-6.2.4/install/3rd-party/pytorch-install.html), to get the container running, you would need to run the following command

```sh
docker pull rocm/pytorch:latest
```
followed by 
```
docker run -it --cap-add=SYS_PTRACE --security-opt seccomp=unconfined \
--device=/dev/kfd --device=/dev/dri --group-add video \
--ipc=host --shm-size 8G rocm/pytorch:latest
```
You may notice just how long that second line of command is. As someone who works with this on a daily basis, I am required to know what this jibberish means, but *even I* find my self constantly looking up this command whenever I need to start a new container. 

In the end, due to how often I had to use this, I eventually had to wrap the whole thing into a shell script, dubbed it `drun`, and added it to bash as a custom command. However, I feel like by the time a piece of software requires you to create a custom shell command in order to run it sanely, it has already given up on any hopes of being usable. 

Of course, this is by no means `docker`'s fault. These settings are necessary to configure to the container to run properly and it allows a high level of flexibility for using the software. However, in the meantime, I also strongly believe that *you should only need to run something like this once*, and that *it should be okay to forget about it without having to worry about looking it up later.*

### Case 2: Can't attach to containers sometimes

To access a container that has already been created, what I often had to do is find its name from the list of containers with
```
doker ps -a
```
then use 
```
docker start <name> -ai
```

to start and attach to it. This is fine most of the time, except in some cases, `docker start <name> -ai` will not work, because the container's entry point is not set up to be a shell, so I would attach to the container only to be stuck there, forced to kill it. To get around this, I would have to run 

```
docker start <name>
```
then
```
docker exec -it <name> /bin/bash
```
To attach to the shell properly, except you find that by the time you typed `docker exec`, *your container has already exited with a status code of `0`!* Which is fun because it means you have to start over from `docker run` again with a proper `/bin/bash` at the end so it allows you to attach to the container. *Not to mention that I had to type the "name" twice!* 


### Case 3: Reusing existing docker containers
More often than not, we want to reuse a dev environment for multiple projects. However, doing so with docker can be a little frustrating. Imagine the following scenario: 

Okay, you finally have a container setup. To use it as a dev environment you want to directly edit and run code on your host file system. To achieve this, you made sure to add a `--mount` or `--volume` flag when you execute the `docker run` command to map the current working directory to somewhere like `/mnt/code` inside your container. Then, you run `docker attach -ai`, followed by `cd /mnt/cope` to navigate to your working directory. You began editing the code, maybe installing some custom dependencies along the way, and finally! Done! You are finished with the project for now!

However, a few days later you are working on a similar yet independent project that could really use the environment from your old project. Fortunately, you still have your old container available. So you decided to boot it up and try it out. However, the only way you can interact with your host filesystem, where your current project is located, is via the directory of your old project. You considered running `docker run` again to map it to a different directory, but that means you would have to reinstall all your dependencies again. Reluctantly, you resort to the ugly method of having your new project nested in your old project directory to get the whole thing working. 

Instead of all this, wouldn't it be nice to have a container that can simply "attach" to your current working directory at command without requiring you to move anything on the host file system?

## Here comes Dok

`Dok` is a command line tool that aims to reduce some of the friction caused by using `docker` containers as a dev environment. It is designed to function similarly to virtual environment tools like conda, but with a docker backend. You can install `dok` following the [instructions on Github](https://github.com/timchenggu123/dok.git). 

### Getting started
To get started, create a docker-based virtual environment like this:
```
dok c <name> <file/image>
```

where `c` is short for `create`, `<name>` is the name of the virtual environment, and `<file/image>` refers to the docker compose file or image you would like to use to base the virtual environment on. 

e.g.
```
dok c foo alpine
```
will create a simple virtual environment based on alphine. To use it, simply run the command
```
dok at foo
```
and it will attach to the container at the current host working directory. Here, `at` is a shortcut command to `activate-attach`, which, as its name suggests, first activates the environment and then attaches to it. Since `foo` is activated, we won't need to type out its name anymore when we want to run it again later. A simple
```
dok t
```
will bring us right inside `foo`! You can also just directly execute commands in the container from the host without having to attach to the container shell, similar to using the `docker exec` command:
```
dok e echo "hello world"
```

### Setting up complex containers
The `dok c` command wraps around `docker run` to create containers, so it also supports all the configurations and flags supported by the latter. We simply need to pass them to the `--run-args` flag. For example, to create `rocm/pytorch` container, we could use

```
dok c rocm rocm/pytorch --run-args="--cap-add=SYS_PTRACE --security-opt seccomp=unconfined --device=/dev/kfd --device=/dev/dri --group-add video --ipc=host --shm-size 8G rocm/pytorch:latest"
```

Perhaps an alternative, cleaner way of doing this is using a `docker-compose.yml` file. The command above translates nicely to

```yaml
services:
  my-rocm-pytorch-service:
    container_name: rocm
    image: rocm/pytorch:latest
    user: 0:0
    volumes:
      - ./ssh/:/var/lib/jenkins/.ssh/
    cap_add:
      - SYS_PTRACE
    security_opt:
      - seccomp=unconfined
    devices:
      - /dev/kfd
      - /dev/dri
    group_add:
      - video
    ipc: host
    shm_size: 8g
```

To use this, simply run 
```sh
dok c rocm ./docker-compose.yml
``` 
and `dok` will create a dev environment from this docker compose file. We don't need to worry about the service name or container name here, as `dok` will automatically create them based on name of the virtual environment. We also do not need to worry about adding a `command` field or a custom entry point file -- `dok` will set that also as well. 

*We could also create multiple independent environments from this docker compose file -- something that a regular `docker compose up` will not support -- without having to change the service name and/or container name every time to avoid conflicts.* This is because under the hood, `dok` does not directly run a `docker compose up` on the file; instead, it modifies it and copies it to an internal folder. For example, running the above command will generate a file named `rocm.yml` at `/home/tim/.local/lib/python3.10/site-packages/dok/docker_compose/rocm.yml` that looks like
```
services:
  dok-rocm-service
    cap_add:
    - SYS_PTRACE
    command:
    - |2-

      /bin/sh
    container_name: dok-rocm
    devices:
    - /dev/kfd
    - /dev/dri
    entrypoint:
    - /bin/sh
    - -c
    group_add:
    - video
    image: rocm/pytorch:latest
    ipc: host
    security_opt:
    - seccomp=unconfined
    shm_size: 8g
    stdin_open: true
    tty: true
    user: 0:0
    volumes:
    - /home/tim/code/dok/example/rocm-pytorch/ssh:/var/lib/jenkins/.ssh/
    - /:/dokmappingdir
  ```
As you can probably see, it is a bit different from the original file. I will not get into the details here, but feel free to dive in and see what is going on here.

### Cloning existing environments
In case you skipped my rant, I mentioned that a long `docker run` command such as the one used by `rocm/pytorch` should be "allowed to be forgotten" after running it for the first time. Sure, this might be easily achievable by creating a shell script, but I have poor memory, and if you happened to have poor memory too like me, and a tendency to forget where you placed things, you might just find yourself creating a new shell script every time anyways because you don't know where the old one is, like I often don't. Or, if you do remember, to run the script, you would still have to navigate to the directory and run it -- that's work; it might not be a whole lot of work, but it is still *some* work and it *creates fiction*. 

To reduce the amount of work, `dok` allows us to quickly `copy` an existing environment with
```
dok copy source name
```
where source is the environment you want to copy, and name is the name of the copy. It is that simple. For example, to duplicate my rocm environment, all I have to do is 
```
dok copy rocm rocm2
```
One thing to note is that this command *does not* copy the container itself, so if you installed or added anything to the container after it has been created, *that won't be copied*. All it does is recycle the command used to create the source container to create the new container. And the neat thing is that you do not need to worry about if you created the source container with an image or a docker compose file, `dok` will figure it out. 

## Conclusion
There goes my short introduction to `dok`, a project I have been working on and using in my daily workflow quite a lot. `Dok` is constantly being updated and contains more features than what I have introduced here. Check it out at [https://github.com/timchenggu123/dok.git](https://github.com/timchenggu123/dok.git)!