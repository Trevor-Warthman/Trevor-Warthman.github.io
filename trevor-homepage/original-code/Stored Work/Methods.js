autoScroll: function () {
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

      let targetPage = this.profilePages[
        this.profilePages.indexOf(this.currentProfilePage) + 1
      ];

      document
        .getElementById(targetPage)
        .scrollIntoView({ behavior: "smooth" });
      this.currentPage = targetPage;
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
    },
    getSecondsDateDiff(date1, date2) {
      const seconds = (date2.getTime() - date1.getTime()) / 1000;
      return seconds;
    },
    elementIsInVerticalView(page) {
      let bounding = page.getBoundingClientRect();
      console.log(bounding.top)
      if (
        bounding.top >= 0 &&
        bounding.bottom <=
          (window.innerHeight || document.documentElement.clientHeight)
      ) {
        return true;
      } else {
        return false;
      }
    },