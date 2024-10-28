## Fetch discussions script

### Setup

click in your avatar icon and go to settings and look for the option "developer settings"

<img width="266" alt="image" src="https://github.com/user-attachments/assets/17e5bbbf-3fff-4ea4-a8b7-9f9cb021c32a">

go to  personal access token and click on "tokens" (classic)

<img width="230" alt="image" src="https://github.com/user-attachments/assets/36611ce4-3c4d-4b67-8909-cdc462147ea1">

click on "generate new token (classic)"
![image](https://github.com/user-attachments/assets/ba1c7af3-d77f-42ae-b79f-de0d4b138c81)

select these options and click on "generate token"
![image](https://github.com/user-attachments/assets/9a581846-d302-4e2e-ad02-f1ccdede92db)
![image](https://github.com/user-attachments/assets/5fe92347-c564-4579-81a2-43d52ed05ef4)

once you have the token, create an `.env` file in the root folder and put it in along the name of the repo and the owner there like this:
![image](https://github.com/user-attachments/assets/1e96dbde-c81c-4091-9be6-67eff8bf736d)

install the dependencies
```
npm i
```

then finally run one of the 2 scripts with node, i.e.:

```
node fetchDiscussions.js
```

it will download all the discussions from your selected repo
