FROM node:20

LABEL 		maintainer="Pascal Schlicht, <post@pschlicht.de>"
ENV			LC_ALL 					C.UTF-8
ENV			ENV						dev

EXPOSE 		5000

WORKDIR     /usr/src/app/appfiles
ADD         ./clients/react-client /usr/src/app/appfiles
RUN         npm install

CMD         npm run dev -- --host