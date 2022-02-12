<template>
  <div>
    <ProfileContainer />
  </div>
</template>

<script>
import ProfileContainer from "./components/ProfileContainer.vue";
export default {
  name: "App",
  components: {
    ProfileContainer,
  },
  mounted() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });
  },
};
</script>

<style>
#app {
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  left: 0px;
}
/* Get rid of stupid auto margin...*/
body {
  margin: 0px;
}
a {
  text-decoration: none;
}

.profile-page {
  height: calc(var(--page-height) - 2px);
  width: 100vw;
  border-bottom: 2px dashed blue;
}
/* 
Colors:
Background: White
Nav / Main : 456990
Special words / headers: EF767A
Items / areas 04C2C9
Accents ABFAA9
Secondary background: EEB868

*/
/* Global CSS Variables */

:root {
  --outer-bar-height: 10vh;
  --page-height: 100vh;

  --intro-box-width: 500px;
  --intro-font-size: 30px;

  /* Color Scheme */
  --main-white: #FFFFFF;
  --main-blue: #456990;
  --highlight-pink: #EF767A;
  --item-blue: #04C2C9;
  --hover-green: #ABFAA9;
  --secondary-yellow: #FED766;

  --common-border-radius: 8px;
  
}
/* Global Element Styles*/
h1 {
  margin: 0px;
  padding-top: 10vh;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--item-blue);
}

/* Global Classes */
.no-highlight {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
.blue-text {
  color: var(--item-blue);
  font-weight: bold;
}
.pink-text {
  color: var(--highlight-pink);
  font-weight: bold;
}
.green-text {
  color: var(--hover-green);
  font-weight: bold;
}

.flexrow {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.flexcolumn {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.spacebetween {
  display: flex;
  justify-content: space-between;
}
.float-left {
  float: left;
}
.float-right {
  float: right;
}
.hide-overflow {
  overflow: hidden;
}
.blue-link {
  text-decoration: underline;
  color: var(--item-blue);
}
.blue-link:hover {
  color: var(--hover-green);
}
</style>
