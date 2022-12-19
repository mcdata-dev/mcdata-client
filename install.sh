#!/bin/sh

GREEN="\e[32m"
ENDCOLOR="\e[0m"

echo
echo "Initializing project setup..."
echo

echo "(1/2) Installing dependencies..."
manager=none
which npm &> /dev/null && manager=npm
which yarn &> /dev/null && manager=yarn

if [ $manager = "yarn" ]
then
  echo "Using yarn as package manager."
  yarn install
elif [ $manager = "npm" ]
then
  echo "Removing yarn.lock if exists"
  if [ -f "yarn.lock" ]
  then
    rm yarn.lock
  fi

  echo "Using npm as package manager."
  npm install
else
  echo "Could not resolve package manager. Installation will be dismissed."
  exit
fi

echo
echo "(2/2) Creating new .env file from .env.example"
cp .env.example .env

echo
echo "Project setup is done!"
echo -e "Use ${GREEN}${manager} run dev${ENDCOLOR} to start your Discord bot."
echo
