<template>
  <div id="profile-topbar" class="no-highlight">
    <nav class="flexrow spacebetween desk fixed">
      <div>
        <a
          :class="['page-link', this.currentSection === 'home' ? 'active' : '']"
          href="#home"
          >Home</a
        >
        <a
          :class="[
            'page-link',
            this.currentSection === 'aboutMe' ? 'active' : '',
          ]"
          href="#aboutMe"
          >About</a
        >
        <a
          :class="[
            'page-link',
            this.currentSection === 'portfolio' ? 'active' : '',
          ]"
          href="#portfolio"
          >Portfolio</a
        >
        <a
          :class="[
            'page-link',
            this.currentSection === 'contactMe' ? 'active' : '',
          ]"
          href="#contactMe"
          >Contact Me</a
        >
      </div>
      <div id="outside-links" class="hide-overflow">
        <a
          class="page-link"
          href="https://github.com/Trevor-Warthman/"
          target="_blank"
          ><img src="./github.png"
        /></a>
        <a
          class="page-link"
          href="https://www.linkedin.com/in/trevor-warthman"
          target="_blank"
          ><img src="./linkedin.png"
        /></a>
        <a
          class="page-link"
          href="https://github.com/Trevor-Warthman"
          target="_blank"
          ><img src="./resume.png"
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
  /*components: {
    OuterBar,
  },*/
};
</script>


<style scoped>
#profile-topbar {
  top: 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  position: fixed;
  z-index: 2;
  height: 10vh;
  font-weight: bold;
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

nav.fixed.desk {
  /*animation: popDown 0.5s;*/
}
nav.fixed {
  bottom: inherit;
  left: 0;
  position: fixed;
  top: 0;
}

nav a {
  padding: 0.5em;
  text-transform: capitalize;
  text-decoration: none;
  color: var(--main-white);
}
nav a:hover {
  color: var(--hover-green);
  cursor: pointer;
}
nav a img {
  height: 8vh;
}

/*@media screen and (min-width: 600px) {
  
}*/
</style>