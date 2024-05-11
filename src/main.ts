import Zoomist from "zoomist";
import switchAudio from "./assets/audio/lamp_switch.mp3";
import emailjs from "@emailjs/browser";

emailjs.init({
  publicKey: "pQhstshzhqMc2YTCU",
  // Do not allow headless browsers
  blockHeadless: true,
  blockList: {
    // The variable contains the email address
    watchVariable: "userEmail",
  },
  limitRate: {
    // Set the limit rate for the application
    id: "app",
    // Allow 1 request per 10s
    throttle: 10000,
  },
});

function init() {
  const nav = document.querySelector(".nav")!;
  function showActiveLink() {
    const links = nav.querySelectorAll(".nav__link");
    const handleActiveLink = (e: Event) => {
      if ((e.target as HTMLElement).classList.contains("nav__link")) {
        links.forEach((link) => link.classList.remove("active"));
        (e.target as HTMLElement).classList.add("active");
      }
    };
    nav.addEventListener("click", handleActiveLink);
  }
  function hoverNavlinkItem() {
    const navLinks = document.querySelectorAll(".nav__link")!;
    const handleHover = (e: Event) => {
      if ((e.target! as HTMLElement).classList.contains("nav__link")) {
        navLinks.forEach((item) => {
          // item.classList.remove('un-active')
          item !== e.target
            ? item.classList.add("un-active")
            : item.classList.remove("un-active");
        });
      }
    };
    const handleUnHover = () => {
      navLinks.forEach((item) => {
        item.classList.remove("un-active");
      });
    };

    nav.addEventListener("mouseover", handleHover);
    nav.addEventListener("mouseout", handleUnHover);
  }
  function stickHeader() {
    const header = document.querySelector(".header")!;

    const navHeight = nav.getBoundingClientRect().height;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) {
          nav.classList.add("sticky");
        }
        if (entry.isIntersecting) {
          nav.classList.remove("sticky");
        }
      },
      { root: null, threshold: 0, rootMargin: `-${navHeight}px` }
    );
    observer.observe(header);
  }
  function slowlyRevealSection() {
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          entry.target.classList.remove("hidden");
          observer.unobserve(entry.target);
        }
      },
      { root: null, threshold: 0.1 }
    );
    sections.forEach((section) => {
      section.classList.add("hidden");
      observer.observe(section);
    });
  }
  function smoothToFirstSectionScroll() {
    const heroBtn = document.querySelector(".hero__btn");
    const section1 = document.querySelector(".section--1");
    heroBtn?.addEventListener("click", () =>
      section1?.scrollIntoView({ behavior: "smooth" })
    );
  }

  function showMoreProject() {
    const btns = document.querySelectorAll(".project-content__btn")!;
    function handleShowProjects(e: Event) {
      const currentTab = (e.currentTarget as HTMLButtonElement).dataset.tab;
      const showBtn = e.currentTarget! as HTMLButtonElement;
      if (!currentTab) return;
      const hiddenProjectContainer = document.querySelector(
        `.project-contents__hidden--${currentTab}`
      ) as HTMLElement;
      (hiddenProjectContainer as HTMLElement).style.display = "block";
      showBtn.style.display = "none";
      const showLessBtn = hiddenProjectContainer?.querySelector(
        ".project-content__btn--close"
      ) as HTMLButtonElement;
      showLessBtn?.addEventListener("click", () => {
        hiddenProjectContainer.style.display = "none";
        showLessBtn.style.display = "block";
        showBtn.style.display = "block";
      });
    }
    btns.forEach((btn) => btn.addEventListener("click", handleShowProjects));
    // btn.addEventListener("click", handleShowProjects);
  }
  function revealProjectImgs() {
    const projectContents = document.querySelectorAll(".project-content");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          const img = entry.target.querySelector(
            ".project-content__product-img"
          ) as HTMLImageElement;
          const imgSrc = img.dataset.src!;
          img.src = imgSrc;
          img.addEventListener("load", () => {
            img.classList.remove("blur");
          });
          observer.unobserve(entry.target);
        }
      },
      { root: null, threshold: 0.9 }
    );
    projectContents.forEach((project) => {
      observer.observe(project);
    });
  }
  function enterSpiderManSection() {
    const spiderman = document.querySelector(".spider-man")! as HTMLElement;
    const sections = document.querySelectorAll(".section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const nav = document.querySelector(".nav")!;
          if (
            entry.intersectionRatio > 0.7 &&
            entry.isIntersecting &&
            nav.classList.contains("sticky")
          ) {
            // enter
            spiderman.classList.add("enter");
          }
          if (entry.intersectionRatio < 0.7)
            spiderman.classList.remove("enter");
        });
      },
      {
        root: null,
        threshold: [0.7, 0.8, 0.9],
      }
    );
    sections.forEach((section) => observer.observe(section));
  }
  function changeTabProject() {
    const tabsContainer = document.querySelector(".project-actions")!;
    function handleChangeTab(e: Event) {
      if (
        (e.target as HTMLElement).classList.contains("project-actions__button")
      ) {
        const currentBtn = e.target as HTMLButtonElement;
        const currentTab = currentBtn.dataset.tab;
        tabsContainer
          .querySelectorAll(".project-actions__button")
          .forEach((btn) => btn.classList.remove("active"));
        currentBtn.classList.add("active");
        const projectContents = document.querySelectorAll(".project-contents");
        const content = document.querySelector(
          `.project-contents--${currentTab}`
        );
        projectContents.forEach((content) => content.classList.add("hidden"));
        content?.classList.remove("hidden");
      }
    }
    tabsContainer.addEventListener("click", handleChangeTab);
  }
  function toggleDarkTheme() {
    const btn = document.querySelector(".nav__theme-mode-btn")!;
    function handleToggleTheme() {
      const moonIcon = document.querySelector(".nav__icon--moon")!;
      const sunIcon = document.querySelector(".nav__icon--sun")!;
      const htmlEl = document.documentElement;
      const audio = new Audio(switchAudio);
      audio.play();
      if (
        !htmlEl.classList.contains("dark-mode") ||
        htmlEl.classList.contains("light-mode")
      ) {
        htmlEl.classList.remove("light-mode");
        htmlEl.classList.add("dark-mode");
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
        return;
      }
      htmlEl.classList.remove("dark-mode");
      htmlEl.classList.add("light-mode");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
    btn.addEventListener("click", handleToggleTheme);
  }

  function handleImgModal() {
    function openProjectImg() {
      const projectImgBoxs = document.querySelectorAll(
        ".project-content__product"
      );
      function handleOpenImg(e: Event) {
        const box = e.currentTarget as HTMLElement;
        const imgSrc = box.querySelector("img")!.dataset.src;
        openImgModal(imgSrc!);
      }
      projectImgBoxs.forEach((box) =>
        box.addEventListener("click", handleOpenImg)
      );
    }
    function closeModal() {
      const btn = document.querySelector(".overlay__close");
      const overlay = document.querySelector(".overlay");
      function handleEscClose(e: KeyboardEvent) {
        if (e.key === "Escape") handleCloseModal();
      }
      function handleCloseModal() {
        overlay?.classList.add("hidden");
      }
      document.addEventListener("keydown", handleEscClose);
      btn?.addEventListener("click", handleCloseModal);
    }
    function openImgModal(imgSrc: string) {
      const overlay = document.querySelector(".overlay");
      const modalImgBox = document.querySelector(
        ".modal__img-box"
      )! as HTMLElement;
      modalImgBox.dataset.zoomistSrc = imgSrc;
      overlay?.classList.remove("hidden");

      const zoomistImg = document.querySelector(
        ".zoomist-image"
      ) as HTMLImageElement;
      if (zoomistImg) zoomistImg.src = imgSrc;
      zoomProjectImgs(modalImgBox);
    }
    function zoomProjectImgs(img: HTMLElement) {
      new Zoomist(img, {
        wheelable: true,
        fill: "contain",
      });
    }
    openProjectImg();
    closeModal();
  }
  async function sendEmail() {
    const employerEmailEl = document.querySelector(
      ".employer-email"
    )! as HTMLInputElement;
    const employerNameEl = document.querySelector(
      ".employer-name"
    )! as HTMLInputElement;
    const subjectEl = document.querySelector(".subject")! as HTMLInputElement;
    const formBtnEl=document.querySelector('.contact__form button')! as HTMLButtonElement
    const messageEl = document.querySelector(
      ".message"
    )! as HTMLTextAreaElement;


    const params = {
      name: employerNameEl.value,
      email: employerEmailEl.value,
      subject: subjectEl.value,
      message: messageEl.value,
    };
   try {
    formBtnEl.textContent="Đang gửi"
    await emailjs.send("service_txq3gwj", "template_2rqip68", params);
    formBtnEl.textContent="Thanks. I'll answer back as soon as possible."
    setTimeout(() => {
    formBtnEl.textContent="Contact"
      
    }, 5000);
    employerEmailEl.value=''
    employerNameEl.value=''
    subjectEl.value=''
    formBtnEl.value=''
    messageEl.value=''
   } catch (error) {
    alert('Some thing went wong')
   }
  }
  (
    document.querySelector(".contact__form")! as HTMLFormElement
  ).addEventListener("submit", (e) => {
    e.preventDefault();
    sendEmail();
  });

  //   smoothScroll();
  revealProjectImgs();
  changeTabProject();
  showMoreProject();
  showActiveLink();
  smoothToFirstSectionScroll();
  slowlyRevealSection();
  // zoomProjectImgs();
  stickHeader();
  handleImgModal();
  hoverNavlinkItem();
  toggleDarkTheme();
  enterSpiderManSection();
}
window.addEventListener("load", init);
