<template>
  <div id="home" class="profile-page">
    <img id="landing-background" src="./code.jpg" />
    <div id="intro-box">
      <div>
        <span class="pink-text">Hello</span>, I'm
        <span class="blue-text">Trevor Warthman</span>. <br />
        I'm a Full Stack Software Developer.
      </div>
      <div id="welcome-box">
        Welcome to my
        <a id="portfolio-link" href="#portfolio">Portfolio</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  props: {},
  /*components: {
    OuterBar,
  },*/
};
</script>


<style scoped>

#home {
  /*background-image: url("code.jpg");
  background-color: black;*/
  position: relative;
}
#landing-background {
  width: 100vw;
  height: 100%;
}
#intro-box {
  width: var(--intro-box-width);
  margin-left: auto;
  margin-right: auto;
  font-size: var(--intro-font-size);
  position: absolute;
  color: var(--main-white);
  background-color: var(--main-blue);
  border-radius: 15px;
  top: 50vh;
  left: calc(50vw - var(--intro-box-width) / 2);
}
#welcome-box{
  margin-top: 10px;
  margin-bottom: 10px;
}
#portfolio-link{
  color: #FED766;
  border: 4px solid var(--secondary-yellow);
  padding: 2px 3px 2px 3px;
}
#portfolio-link:hover {
  color: var(--hover-green);
  /*background-color: var(--secondary-yellow);*/
  border: 4px solid var(--hover-green);
}
/*
@keyframes bottomright {
  0% {
    width: 0;
    height: 0;
    padding-top: 0;
    visibility: visible;
  }
  25% {
    width: 100%;
    height: 0;
    padding-top: 0;
    visibility: visible;
  }
  50% {
    height: 100%;
    width: 100%;
    visibility: visible;
  }
  75% {
    visibility: visible;
  }
  100% {
    visibility: visible;
  }
}

@keyframes revbottomright {
  0% {
    width: 100%;
    height: 100%;
    visibility: visible;
  }
  25% {
    width: 100%;
    height: 100%;
    visibility: visible;
  }
  50% {
    width: 100%;
    height: 100%;
    visibility: visible;
  }
  75% {
    width: 100%;
    height: 0;
    padding-top: 0;
    visibility: visible;
  }
  100% {
    width: 0;
    height: 0;
    padding-top: 0;
    visibility: hidden;
  }
}

@keyframes topleft {
  0% {
    width: 0;
    height: 0;
    padding-bottom: 0;
    visibility: hidden;
  }
  25% {
    width: 0;
    height: 0;
    padding-bottom: 0;
    visibility: hidden;
  }
  50% {
    width: 0;
    height: 0;
    padding-bottom: 0;
    visibility: hidden;
  }
  75% {
    width: 100%;
    height: 0;
    padding-bottom: 0;
    visibility: visible;
  }
  100% {
    width: 100%;
    height: 100%;
    opacity: 1;
    visibility: visible;
  }
}

@keyframes revtopleft {
  0% {
    width: 100%;
    height: 100%;
    opacity: 1;
    visibility: visible;
  }
  25% {
    width: 100%;
    height: 0;
    padding-bottom: 0;
    visibility: visible;
  }
  50% {
    width: 0;
    height: 0;
    padding-bottom: 0;
    visibility: hidden;
  }
  75% {
    width: 0;
    height: 0;
    padding-bottom: 0;
    visibility: hidden;
  }
  100% {
    width: 0;
    height: 0;
    padding-bottom: 0;
    visibility: hidden;
  }
}

a {
  font-family: Gotham, Tahoma, sans-serif;
  font-weight: 900;
  letter-spacing: 1px;
  color: #aaa;
  transition: color 0.75s ease-in-out;
  text-decoration: none;
  text-transform: uppercase;
  padding: 10px;
  position: relative;
  border: 5px solid pink;
   -moz-border-image: url(http://maxschulmeister.com/sneakin/assets/images/svg/scanframe.svg) 5 round;
    -webkit-border-image: url(http://maxschulmeister.com/sneakin/assets/images/svg/scanframe.svg) 5 round;
    -o-border-image: url(http://maxschulmeister.com/sneakin/assets/images/svg/scanframe.svg) 5 round;
    border-image: url(http://maxschulmeister.com/sneakin/assets/images/svg/scanframe.svg) 5 round;
}

a:hover {
  color: #333;
  transition: color 0.75s ease-in-out;
}

a:after {
  content: "";
  position: absolute;
  bottom: -5px;
  padding-right: 5px;
  left: -5px;
  width: 100%;
  height: 100%;
  border-bottom: 5px solid #333;
  border-right: 5px solid #333;
  visibility: hidden;
}

a:before {
  content: "";
  position: absolute;
  top: -5px;
  right: -5px;
  padding-left: 5px;
  width: 100%;
  height: 100%;
  border-top: 5px solid #333;
  border-left: 5px solid #333;
  visibility: hidden;
}

a:hover:before {
  animation: topleft 0.5s ease-in-out forwards;
}

a:hover:after {
  animation: bottomright 0.5s ease-in-out forwards;
}

a.active:before {
  animation: revtopleft 0.5s ease-in-out forwards;
}

a.active:after {
  animation: revbottomright 0.5s ease-in-out forwards;
}

a.active:before,
a.active:after {
  width: 100%;
  height: 100%;
  visibility: visible;
}

a.temp:before, a.temp:after {
  width: 100%;
  height: 100%;
  visibility: visible;
}


https://www.sliderrevolution.com/resources/css-border-animation/
*/
</style>


