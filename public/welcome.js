(() => {
  const screen = document.querySelector("#welcomeScreen");
  const shell = document.querySelector("#appShell");
  const enterButtons = [document.querySelector("#enterAppButton"), ...document.querySelectorAll("[data-enter-app]")].filter(Boolean);
  const introButton = document.querySelector("#introButton");
  const exploreButton = document.querySelector("#exploreWelcomeButton");
  const stage = document.querySelector("#welcomeStage");
  const fireflyField = document.querySelector("#fireflyField");
  const profileModal = document.querySelector("#profileModal");
  const aiStatus = document.querySelector("#welcomeAiStatus");

  function enterApp() {
    screen.classList.add("is-leaving");
    document.body.classList.remove("welcome-active");
    shell.removeAttribute("inert");
    shell.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      screen.hidden = true;
      profileModal?.removeAttribute("inert");
      profileModal?.removeAttribute("aria-hidden");
    }, 560);
    if (!location.hash || location.hash === "#welcome") history.replaceState(null, "", "#home");
    window.setTimeout(() => {
      document.body.style.overflow = profileModal && !profileModal.hidden ? "hidden" : "";
    }, 580);
  }

  function showWelcome() {
    screen.hidden = false;
    requestAnimationFrame(() => screen.classList.remove("is-leaving"));
    document.body.classList.add("welcome-active");
    document.body.style.overflow = "hidden";
    shell.setAttribute("inert", "");
    shell.setAttribute("aria-hidden", "true");
    profileModal?.setAttribute("inert", "");
    profileModal?.setAttribute("aria-hidden", "true");
    screen.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", "#welcome");
  }

  enterButtons.forEach((button) => button.addEventListener("click", enterApp));
  introButton?.addEventListener("click", showWelcome);
  exploreButton?.addEventListener("click", () => document.querySelector("#welcomeExperience")?.scrollIntoView({ behavior: "smooth" }));

  document.querySelectorAll("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.demo;
      document.querySelectorAll("[data-demo]").forEach((item) => item.classList.toggle("active", item === button));
      document.querySelectorAll("[data-demo-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.demoPanel === target));
    });
  });

  const fireflies = [];
  const fireflyCount = matchMedia("(max-width:760px)").matches ? 16 : 34;
  for (let index = 0; index < fireflyCount; index += 1) {
    const firefly = document.createElement("i");
    firefly.className = "firefly";
    const size = 2 + Math.random() * 3.5;
    firefly.style.left = `${3 + Math.random() * 94}%`;
    firefly.style.top = `${4 + Math.random() * 92}%`;
    firefly.style.setProperty("--size", `${size.toFixed(1)}px`);
    firefly.style.setProperty("--duration", `${(7 + Math.random() * 9).toFixed(1)}s`);
    firefly.style.setProperty("--delay", `${(-Math.random() * 12).toFixed(1)}s`);
    firefly.style.setProperty("--drift-x", `${(10 + Math.random() * 25).toFixed(0)}px`);
    firefly.style.setProperty("--drift-y", `${(8 + Math.random() * 20).toFixed(0)}px`);
    fireflyField?.append(firefly);
    fireflies.push(firefly);
  }

  let fireflyFrame = 0;
  screen.addEventListener("pointermove", (event) => {
    screen.style.setProperty("--pointer-x", `${event.clientX}px`);
    screen.style.setProperty("--pointer-y", `${event.clientY}px`);
    if (fireflyFrame || !matchMedia("(pointer:fine)").matches) return;
    fireflyFrame = requestAnimationFrame(() => {
      fireflies.forEach((firefly) => {
        const rect = firefly.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - event.clientX;
        const dy = rect.top + rect.height / 2 - event.clientY;
        const distance = Math.hypot(dx, dy);
        const strength = distance < 150 ? (150 - distance) / 150 : 0;
        const scale = distance || 1;
        firefly.style.setProperty("--push-x", `${(dx / scale * strength * 34).toFixed(1)}px`);
        firefly.style.setProperty("--push-y", `${(dy / scale * strength * 34).toFixed(1)}px`);
      });
      fireflyFrame = 0;
    });
  });

  if (stage && matchMedia("(pointer:fine)").matches && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      stage.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width).toFixed(3));
      stage.style.setProperty("--my", ((event.clientY - rect.top) / rect.height).toFixed(3));
    });
    stage.addEventListener("pointerleave", () => {
      stage.style.setProperty("--mx", ".5");
      stage.style.setProperty("--my", ".5");
    });
  }

  profileModal?.setAttribute("inert", "");
  profileModal?.setAttribute("aria-hidden", "true");
  fetch("/api/status")
    .then((response) => response.json())
    .then((status) => {
      aiStatus.innerHTML = status.aiMode === "api" ? `<i></i> ${status.model || "AI"} 已接入` : `<i></i> AI 演示模式`;
    })
    .catch(() => { aiStatus.innerHTML = `<i></i> 服务连接中`; });
  document.body.style.overflow = "hidden";
})();
