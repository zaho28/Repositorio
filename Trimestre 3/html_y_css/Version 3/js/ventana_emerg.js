// Espera a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  const ventana = document.getElementById("ventana");
  const cerrar = document.getElementById("cerrar-ventana");

  // Muestra la ventana emergente automáticamente al cargar la página
  ventana.style.display = "block";

  // Permite cerrarla al hacer clic en la X
  cerrar.addEventListener("click", () => {
    ventana.style.display = "none";
  });
});