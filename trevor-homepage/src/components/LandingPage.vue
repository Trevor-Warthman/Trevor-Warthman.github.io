<template>
  <div id="home" class="profile-page">
    <img id="landing-background" src="../assets/images/code.jpg" />
    <div id="intro-box">
      <div>
        <span class="pink-text">Hello</span>, I'm
        <span class="blue-text">Trevor Warthman</span>. <br />
        I'm a Full Stack Software Developer.
      </div>
      <div id="welcome-box">
        Welcome to my
        <LinkUpBox href="#portfolioContent" content='Portfolio'></LinkUpBox>
      </div>
    </div>
  </div>
</template>

<script>
import LinkUpBox from './LinkUpBox.vue'
export default {
  name: "LandingPage",
  props: {},
  components: {
    LinkUpBox
  }
};
</script>


<style scoped>

#home {
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
.link-up-box {
  display: inline-block;
}
</style>