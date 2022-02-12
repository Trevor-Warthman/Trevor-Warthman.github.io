<template>
  <!--- Maybe this will work I'm gonna ignore it --->
  <div id="profile-topbar" class="no-highlight">
    <nav class="flexrow spacebetween desk fixed">
      <div class="page-links">
        <a href="#home">
          <div
            class="page-link"
            :class="[this.currentSection === 'home' ? 'active' : '']"
          >
            Home
          </div>
        </a>
        <a href="#aboutMeContent">
          <div
            class="page-link"
            :class="[this.currentSection === 'aboutMe' ? 'active' : '']"
          >
            About
          </div>
        </a>
        <a href="#portfolioContent">
          <div
            class="page-link"
            :class="[this.currentSection === 'portfolio' ? 'active' : '']"
          >
            Portfolio
          </div>
        </a>
        <a href="#contactMeContent">
          <div
            class="page-link"
            :class="[this.currentSection === 'contactMe' ? 'active' : '']"
          >
            Contact Me
          </div>
        </a>
      </div>
      <div id="outside-links" class="hide-overflow">
        <a
          class="outside-link"
          href="https://github.com/Trevor-Warthman/"
          target="_blank"
          ><img src="../assets/icons/github.png"
        /></a>
        <a
          class="outside-link"
          href="https://www.linkedin.com/in/trevor-warthman"
          target="_blank"
          ><img src="../assets/icons/linkedin.png"
        /></a>
        <a
          class="outside-link"
          href="https://github.com/Trevor-Warthman"
          target="_blank"
          ><img src="../assets/icons/resume.png"
        /></a>
      </div>
    </nav>
  </div>
</template>

<script>
/* 
Colors:
Background: White
Nav / Main : 456990
Special words / headers: EF767A
Items / areas 04C2C9
Accents ABFAA9
Secondary background: EEB868

*/

export default {
  name: "OuterBar",
  props: {
    currentSection: {
      required: true,
      type: String,
    },
  },
  computed: {
    buttonStatus: function (currentButton) {
      if (currentButton === this.currentSection) {
        return "active";
      }
      return "";
    },
  },
  /*components: {
    OuterBar,
  },*/
};
</script>

<style>
:root {

--number-of-page-links: 4;
--page-links-width: calc(100vw * .65);
--outside-links-width: calc(100vw - var(--page-links-width));
--page-link-margin: calc(var(--page-links-width) * .2 / var(--number-of-page-links));
--nav-page-link-width: calc(var(--page-links-width) / var(--number-of-page-links) - (var(--page-link-margin) / var(--number-of-page-links)));
}
</style>

<style scoped>
#profile-topbar {
  top: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  position: fixed;
  z-index: 2;
  height: var(--outer-bar-height);
  font-weight: bold;
}

.page-links {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 80%;
}

#profile-topbar nav {
  width: 100%;
  height: calc(10vh - 3px);
  border-bottom: 3px solid var(--hover-green);
  background-color: var(--main-blue);
  color: var(--main-white);
  font-size: 16px;
}

#outside-links {
  display: block;
  width: 200px;
}

nav.fixed {
  bottom: inherit;
  left: 0;
  position: fixed;
  top: 0;
}

/* Page Links*/
.page-links a {
  margin-right: var(--page-link-margin);
}
.page-links a:first-child {
  margin-left: var(--page-link-margin);
}

.page-links div {
  width: var(--nav-page-link-width);
  font-size: 12px;
  padding: 0.5em;
  text-transform: capitalize;
  text-decoration: none;
  color: var(--main-white);
  background-color: var(--item-blue);
  border: 2px solid var(--item-blue);
  border-radius: 3px;
}

.page-links div:hover {
  color: var(--hover-green);
  border: 2px solid var(--hover-green);
  cursor: pointer;
}
.page-links div.active {
  color: var(--main-white);
  background-color: var(--highlight-pink);
  border: 2px solid var(--highlight-pink);
  cursor: pointer;
}
.page-links div.active:hover {
  color: var(--secondary-yellow);
  background-color: var(--highlight-pink);
  border: 2px solid var(--secondary-yellow);
  cursor: pointer;
}
nav a img {
  height: 2vh;
}

/*@media screen and (min-width: 600px) {
  
}*/
</style>