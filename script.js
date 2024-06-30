let line=gsap.timeline();
line.to(".full",{
  y:"100vh",
  opacity:0,
  scale:0.4,
  duration:1,
})

line.to(".full",{
  y:"0vh",
  opacity:1,
  delay:0.1,
})

line.to(".full",{
  scale:1,
  rotate:360,
  duration:1,
  delay:1.3,
})

line.from("nav",{
  x:100,
  duration:1,
  opacity:0,
})

//navbar
let cross = document.querySelector("#cross");
let menu = document.querySelector("#menu");
let tl = gsap.timeline();

tl.to("#sidebar", {
  visibility: "visible",
  right: 0,
  duration: 0.4,
});
tl.from("#sidebar h4", {
  x: 350,
  stagger: 0.1,
  duration: 2,
  opacity: 0,
  ease: "elastic.out",
});
tl.from("#sidebar i", {
  opacity: 0,
});
tl.pause();

menu.addEventListener("click", () => {
  tl.play();
});

cross.addEventListener("click", () => {
  tl.reverse();
});

let page = document.querySelector(".full");
let cursor = document.querySelector("#cursor");
let imageDiv = document.querySelector(".image");

line.from(".move", {
  x: -300,
  opacity: 0,
  duration: 1,
  delay: 1,
});

let tline=gsap.timeline({
  scrollTrigger:{
    trigger: ".cardleft",
    scroller:"body",
    markers:false,
    start:"top 60%",
    end:"top 75%",
    delay:3,
    scrub:3,
    stagger:1,
    pin:true,
    ease:"ease-in",
}
});

tline.from(".cardleft",{
  x:-100,
  opacity:0,
  duration:5,
 
})

tline.from(".cardright",{
  x:100,
  opacity:0,
  duration:5,

})

window.addEventListener("wheel", (dets) => {
  if (dets.deltaY > 0) {
    gsap.to(".marque img",{
        rotate:0,
        duration:0.6,
    })

    gsap.to(".marque", {
      transform: `translateX(-200%)`,
      // delay:1,
      duration: 4,
      repeat: -1,
      ease: "none",
    });
  } else {
    gsap.to(".marque img",{
        rotate:180,
        duration:0.6,
    })

    gsap.to(".marque", {
        transform: `translateX(0)`,
        // delay:1,
        duration: 4,
        repeat: -1,
        ease: "none",
      });
  }
});