<template>
  <div class="link-up-box">
    {{ content }}
  </div>
</template>

<script>
export default {
  name: "LinkUpBox",
  props: {
      borderThickness: {
          required: false,
          type: Number,
          default: 2
      },
      borderColor: {
          required: false,
          type: String,
          default: '#1A8CB9'
      },
      linkTime: {
          required: false,
          type: Number,
          default: 2
      },
      content: {
          required: true,
          type: String
      }
  },
};
</script>


<style scoped>

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


