<template>
  <div id="portfolio" class="profile-page">
    <div id="portfolioContent" class="profile-page-content">
      <div id="portfolio-page-selectors">
        <div
          v-if="this.currentPortfolioPage === 'projects'"
          class="current-portfolio-page-icon"
          title="Projects"
        >
          <img src="../assets/icons/projects.png" />
        </div>
        <div
          v-else
          class="unselected-portfolio-page-icon"
          @click="this.setPortfolioState('projects')"
          title="Projects"
        >
          <img src="../assets/icons/projects.png" />
        </div>

        <div
          v-if="this.currentPortfolioPage === 'skills'"
          class="current-portfolio-page-icon"
          title="Skills"
        >
          <img src="../assets/icons/skills.png" />
        </div>
        <div
          v-else
          class="unselected-portfolio-page-icon"
          @click="this.setPortfolioState('skills')"
          title="Skills"
        >
          <img src="../assets/icons/skills.png" />
        </div>

        <div
          v-if="this.currentPortfolioPage === 'experience'"
          class="current-portfolio-page-icon"
          title="Experience"
        >
          <img src="../assets/icons/experience.png" />
        </div>
        <div
          v-else
          class="unselected-portfolio-page-icon"
          @click="this.setPortfolioState('experience')"
          title="Experience"
        >
          <img src="../assets/icons/experience.png" />
        </div>
      </div>
      <div
        v-if="this.currentPortfolioPage === 'projects'"
        id="portfolio-page-container"
      >
        <Projects />
      </div>
      <div
        v-if="this.currentPortfolioPage === 'skills'"
        id="portfolio-page-container"
      >
        <Skills />
      </div>
      <div
        v-if="this.currentPortfolioPage === 'experience'"
        id="portfolio-page-container"
      >
        <Experience />
      </div>
    </div>
  </div>
</template>

<script>
import Projects from "./Projects.vue";
import Skills from "./Skills.vue";
import Experience from "./Experience.vue";
export default {
  name: "Portfolio",
  props: {},
  components: {
    Projects,
    Skills,
    Experience,
  },
  data() {
    return {
      currentPortfolioPage: "projects",
    };
  },
  methods: {
    setPortfolioState(state) {
      this.currentPortfolioPage = state;
    },
  },
};
/* 
dynamic classes on elements to see state, profile page needs state for which shows. Also need app state for whick part of page is in view, which auto updates style on the header to show where we are.
Auto scroll to particular place

*/
</script>

<style scoped>
#portfolio-page-selectors {
  margin-top: 1vh;
  display: flex;
  justify-content: space-between;
  width: 70vw;
  margin-left: auto;
  margin-right: auto;
}
#portfolio-page-selectors div {
  border-radius: var(--common-border-radius);
  border: 2px solid var(--main-blue);
  padding: 5px;
  padding-bottom: 2px;
  cursor: pointer;
}
#portfolio-page-selectors div:hover {
  background-color: var(--hover-green);
}
#portfolio-page-selectors img {
  aspect-ratio: 1;
  width: 12vw;
  max-width: 50px;
}
#portfolio-page-container {
  border: 2px solid var(--main-blue);
  height: 70vh;
  width: 95vw;
  margin-top: 2vh;
  margin-left: auto;
  margin-right: auto;
  border-radius: var(--common-border-radius);
}
.unselected-portfolio-page-icon {
  background-color: var(--item-blue);
}
.current-portfolio-page-icon {
  background-color: var(--hover-green);
}
</style>