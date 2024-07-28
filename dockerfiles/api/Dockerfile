###################################################################################################	
## Settings
###################################################################################################
FROM 		node:20-bookworm

LABEL 		maintainer="Pascal Schlicht, <post@pschlicht.de>"
ENV         DEBIAN_FRONTEND 		noninteractive
ENV			LC_ALL 					C.UTF-8
ENV			ENV						dev

EXPOSE 		4000 5555

# Create App-directory
WORKDIR     /usr/src/app/appfiles

###################################################################################################	
## Install Dependencies
###################################################################################################
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y

###################################################################################################	
## Scripts
###################################################################################################	

ADD         ./dockerfiles/api/scripts /usr/src/app
ADD         ./api /usr/src/app/appfiles
ADD         ./docker.env /usr/src/app/appfiles
RUN         cd ~
RUN         chmod +x /usr/src/app/wait-for-it.sh
RUN         chmod +x /usr/src/app/entrypoint.sh
RUN         chmod +x /usr/src/app/build.sh

WORKDIR     /usr/src/app/appfiles
RUN         npm install

###################################################################################################	
## Startup
###################################################################################################	
ENTRYPOINT ["sh","/usr/src/app/entrypoint.sh"]
