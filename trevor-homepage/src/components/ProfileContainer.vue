<template>
  <div>
    <!-- Outer-bar -->
    <OuterBar :currentPage="this.profilePages[currentSection]" />
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
    window.addEventListener("scroll", this.updateNavFromScrollLocation);
  },
  data() {
    return {
      profilePages: ["home", "aboutMe", "portfolio", "contactMe"],
      lastRecordedScrollTop: 0,
      lastRecordedScrollTimestamp: new Date(),
      currentSectionIndex: 0,
    };
  },
  //Change this to watch for a scroll event. When scroll event, we want to check the scrolltop to see where we are and find what elemenet we can see the most of.
  computed: {
    /* Default to top showing element */
    currentProfilePage: function () {
      for (const pageId in this.profilePages) {
        let page = document.getElementById(pageId);
        console.log("d");
        console.log(page);
        if (page != null && this.elementIsInVerticalView(page)) {
          return pageId;
        }
      }
      return null;
    },
    profileSections: function () {
      return document.querySelectorAll(".profileSection");
    },
  },
  methods: {
    autoScroll: function () {
      console.log("b");
      console.log(this.currentProfilePage);
      /*select element that should be scrolled to based on current area and scrolled up or scrolled down*/
      if (
        this.getSecondsDateDiff(this.lastRecordedScrollTimestamp, new Date()) >
        1
      ) {
        let currentScrollTop = document.documentElement.scrollTop;
        if (currentScrollTop > this.lastRecordedScrollTop) {
          //they scrolled down
          this.moveScreenToLowerPage();
        } else {
          //they scrolled up
          this.moveScreenToUpperPage();
        }
        this.lastRecordedScrollTimestamp = new Date();
        this.lastRecorderdScrollTop = currentScrollTop;
      }
    },
    //there's something wrong with the scroll top
    moveScreenToLowerPage: function () {
      if (
        this.profilePages.indexOf(this.currentProfilePage) ===
        this.profilePages.length - 1
      ) {
        return;
      }
      console.log(this.profilePages.indexOf(this.currentProfilePage) + 1);
      console.log("targ");
      let targetPage = this.profilePages[
        this.profilePages.indexOf(this.currentProfilePage) + 1
      ];
      console.log(targetPage);
      console.log(document.getElementById(targetPage));
      document
        .getElementById(targetPage)
        .scrollIntoView({ behavior: "smooth" });
      this.currentPage = targetPage;
      console.log("current page");
      console.log(this.currentPage);
    },
    moveScreenToUpperPage: function () {
      if (this.profilePages.indexOf(this.currentProfilePage) === 0) {
        return;
      }
      let targetPage = this.profilePages[
        this.profilePages.indexOf(this.currentProfilePage) - 1
      ];
      //document.getElementById(targetPage).scrollIntoView({ behavior: "smooth" });
      this.currentPage = targetPage;
      console.log("current page");
      console.log(this.currentPage);
    },
    getSecondsDateDiff(date1, date2) {
      const seconds = (date2.getTime() - date1.getTime()) / 1000;
      return seconds;
    },
    elementIsInVerticalView(page) {
      console.log("c");
      console.log(page);
      let bounding = page.getBoundingClientRect();
      if (
        bounding.top >= 0 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight)
      ) {
        console.log("true");
        return true;
      } else {
        console.log("false");
        return false;
      }
    },
    setPortfolioToSkill() {
      console.log("called");
      this.$refs["portfolio"].currentPortfolioPage = "skills";
    },
    updateNavFromScrollLocation() {
      let current = null;
      console.log(this.profileSections);
      this.profileSections.forEach((section) => {
        const sectionTop = section.offsetTop;
        //const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute("id");
        }
      });

      this.currentSection = current;
      console.log(current);
    },
  },
};
</script>


<style scoped>
#profile {
}
/*
figure out how to conditionally apply class to nav links based off on the profileContainer state
*/
</style>
