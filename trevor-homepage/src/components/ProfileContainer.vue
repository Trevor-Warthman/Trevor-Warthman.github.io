<template>
  <div>
    <!-- Outer-bar -->
    <OuterBar :currentSection="currentSection" />
    <div id="profile">
      <!-- Landing Page -->
      <LandingPage id="home" class="profileSection" />
      <!-- About me -->
      <AboutMe
        @portfolio-to-skill="this.setPortfolioToSkill()"
        id="aboutMe"
        class="profileSection"
      />
      <!-- portfolio -->
      <Portfolio ref="portfolio" id="portfolio" class="profileSection" />
      <!-- Contact -->
      <ContactMe id="contactMe" class="profileSection" />
    </div>
  </div>
</template>

<script>
import OuterBar from "./OuterBar.vue";
import LandingPage from "./LandingPage.vue";
import AboutMe from "./AboutMe.vue";
import Portfolio from "./Portfolio.vue";
import ContactMe from "./ContactMe.vue";
export default {
  name: "ProfileContainer",
  props: {},
  components: {
    OuterBar,
    LandingPage,
    AboutMe,
    Portfolio,
    ContactMe,
  },
  mounted() {
    window.addEventListener("scroll", this.updateCurrentPageFromScrollLocation);
  },
  data() {
    return {
      profilePages: ["home", "aboutMe", "portfolio", "contactMe"],
      lastRecordedScrollTop: 0,
      lastRecordedScrollTimestamp: new Date(),
      currentSection: "home",
    };
  },
  //Change this to watch for a scroll event. When scroll event, we want to check the scrolltop to see where we are and find what elemenet we can see the most of.
  computed: {
    /* Default to top showing element */
    currentProfilePage: function () {
      for (const pageId in this.profilePages) {
        let page = document.getElementById(pageId);
        if (page != null && this.elementIsInVerticalView(page)) {
          return pageId;
        }
      }
      return null;
    },
    profileSections: function () {
      return document.querySelectorAll(".profileSection");
    },
    navHeight: function(){
      return this.getNavBarHeightAsPxInt();
    }
  },
  methods: {
    setPortfolioToSkill() {
      this.$refs["portfolio"].currentPortfolioPage = "skills";
    },
    updateCurrentPageFromScrollLocation() {
      let current = null;
      this.profileSections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop /*+ this.navHeight*/) {
          current = section.getAttribute("id");
        }
      });

      this.currentSection = current;
    },
    getNavBarHeight(){
      let navElement = getComputedStyle(document.querySelector('#profile-topbar'));
      return navElement.getPropertyValue('--outer-bar-height');
    },
    getNavBarHeightAsPxInt(){
      let navHeightStyle = this.getNavBarHeight();
      let percentOfViewHeight = parseInt(navHeightStyle.replace(/[^\d.-]/g, ''));
      return window.innerHeight / 100 * percentOfViewHeight;
    }
  },
};
</script>


<style scoped>
.profile-page .profile-page-content {
  margin-top: 10%;
  height: 90%;
}
/*
figure out how to conditionally apply class to nav links based off on the profileContainer state
*/
</style>
