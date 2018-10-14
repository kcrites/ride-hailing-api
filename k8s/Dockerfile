FROM node:9

RUN apt-get update &&\
  apt-get upgrade -yy &&\
  apt-get install -yy python-pip bash-completion curl git nano wget make net-tools netcat dnsutils libpng-dev

RUN echo ". /usr/share/bash-completion/bash_completion" >> ~/.bashrc

WORKDIR /app
ADD ./package.json /app
RUN npm i

ADD . /app
ADD k8s/vendor/init.sh /app/init.sh

EXPOSE 3005
CMD [ "bash","-c","./init.sh" ]
