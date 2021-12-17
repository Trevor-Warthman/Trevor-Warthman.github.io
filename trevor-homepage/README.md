# trevor-homepage

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



https://cli.vuejs.org/guide/deployment.html#pwa



### Build for production
npm run build to update the dist folder which is used by the production server, in this case github pages.

### Deployment made easy
With a shell script and configurations in vue.config.js, we can simply run "bash deploy.sh" in a bash terminal from master branch. This INCLUDES UNCOMMITTED CHANGES! That makes updating production very easy and quick.

### Github pages
with gh-pages branch is created/updated by the deploy.sh script, working in conjuction with an ssh key I believe, to get this site onto the deployment branch.