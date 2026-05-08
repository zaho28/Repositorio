document.addEventListener("DOMContentLoaded", () => {
    const btnLado1 = document.getElementById("btnLado1");
    const btnLado2 = document.getElementById("btnLado2");
    const panelLado1 = document.getElementById("panelLado1");
    const panelLado2 = document.getElementById("panelLado2");

    btnLado1.addEventListener("click", () => {
        const visible = panelLado1.style.display === "block";
        panelLado1.style.display = visible ? "none" : "block";
        panelLado2.style.display = "none";
    });

    btnLado2.addEventListener("click", () => {
        const visible = panelLado2.style.display === "block";
        panelLado2.style.display = visible ? "none" : "block";
        panelLado1.style.display = "none";
    });
});
