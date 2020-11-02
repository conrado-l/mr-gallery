# MR gallery 

**Updated**: `Vuetify` and `vue-cool-lightbox` dependencies were 100% removed from the project.

An app that shows a grid of images, fetched from an API (authenticated with a token) with the ability to show 
more details and the full size image. `Infinity scroll is implemented`, so you just have to scroll down for more images to load.

Disclaimer:
- I used almost no CSS nested selectors for keeping the [specificity](https://developer.mozilla.org/en/docs/Web/CSS/Specificity#:~:text=Specificity%20is%20the%20means%20by,different%20sorts%20of%20CSS%20selectors.) low. I thought of using [BEM](http://getbem.com/) but I didn't know if you guys liked it, since I didn't see it on the current MR website.

Thanks for your time, and have an amazing day!

## Project setup
```
npm install
```

### Compiles and serves for development
```
npm run serve
```
The app will be listening on port `8080` (https://localhost:8080), if it's not being used.

### Runs unit tests (22 total)
```
npm run test:unit
```

### Compiles and minifies for production
```
npm run build
```
