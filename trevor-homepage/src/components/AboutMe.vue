<template>
  <div id="aboutMe" class="profile-page flexrow">
    <div class="left-60">
      <div>
        <h1>About Me</h1>
      </div>
      <div id="aboutMeText1">
        <p>I am a Full Stack Web Developer from Columbus, Ohio.<br /></p>
        <p>
          I enjoy cooking, coding, eating good Asian food, hiking, camping, and
          music. When I get the time, I enjoy playing the trumpet.
        </p>
        <p>
          I am a fulltime Software Engineer for MoreSteam.com, a position I
          really enjoy, where I've gained experiance in frontend and backend
          code, UI/UX design, automated testing, API development, and Cloud
          (Azure) Devops, among other web development
          <a
            href="#portfolio"
            @click="this.emitPortfolioToSkill()"
            class="blue-link"
            >Skills</a
          >. Continued desc...
        </p>
        <p>
          <a href="#contactMe" class="blue-link">Get in touch</a> with me to
          talk about how I can help with your software needs.
        </p>
      </div>
    </div>
    <div>
      <img src="./me.jpg" class="side-img" />
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutMe",
  props: {},
  methods: {
    emitPortfolioToSkill() {
      this.$emit("portfolio-to-skill");
    },
  },
};
</script>


<style scoped>
.left-60 {
  width: 60vw;
}
.side-img {
  /*width: 40vw;
  height: 65vh;
  min-width: 300px;
  min-height: 200px;*/
  width: 30vw;
  margin-left: 5vw;
  border-radius: 50%;
  border-left: 8px solid var(--secondary-yellow);
  border-top: 8px solid var(--item-blue);
  border-right: 8px solid var(--highlight-pink);
  border-bottom: 8px solid var(--hover-green);
  /*filter: drop-shadow(0 0 8px var(--secondary-yellow));*/
}
#aboutMeText1,
#aboutMeText2 {
  font-size: 1.5vw;
}
</style>