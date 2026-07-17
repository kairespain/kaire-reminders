const tg = window.Telegram.WebApp;
const URL =
"https://script.google.com/macros/s/AKfycbwrfRqHuQ7tsJZ_MvmBztlNShRbYQ1r539B8q7XM2YZAwmYvqvp12YoTJrysOHSty_j_A/exec";

tg.ready();

const lista = document.getElementById("lista-recordatorios");

// Cargar recordatorios al abrir
cargarRecordatorios();

document
.getElementById("guardar")
.addEventListener("click", () => {

    const titulo =
        document.getElementById("titulo").value;

    const descripcion =
        document.getElementById("descripcion").value;

    const categoria =
        document.getElementById("categoria").value;

    const fecha =
        document.getElementById("fecha").value;

    if(!titulo || !fecha){
        alert("Debes rellenar el título y la fecha");
        return;
    }

    const recordatorio = {
        id: Date.now(),
        titulo,
        descripcion,
        categoria,
        fecha
    };

fetch(URL,{
    method:"POST",
    body:JSON.stringify(recordatorio)
})
.then(r => r.text())
    .then(() => {

        console.log("Enviado a Apps Script");

        document.getElementById("titulo").value = "";
        document.getElementById("descripcion").value = "";
        document.getElementById("fecha").value = "";

        cargarRecordatorios();

    })
    .catch(error => {

        console.error("Error:", error);

    });

});

async function cargarRecordatorios(){

    lista.innerHTML="Cargando...";

    const respuesta =
        await fetch(
            URL+"?accion=listar"
        );

    const recordatorios =
        await respuesta.json();

    lista.innerHTML="";

    const ahora = new Date();

    recordatorios

    .sort(
        (a,b)=>
            new Date(a.fecha)-
            new Date(b.fecha)
    )

    .filter(
        r=>new Date(r.fecha)>ahora
    )

    .forEach(r=>{

        const fechaBonita =
        new Date(r.fecha)
        .toLocaleString(
            "es-ES",
            {
                dateStyle:"long",
                timeStyle:"short"
            }
        );

        let claseCategoria="";

        switch(r.categoria){

            case "🔵 Post":
                claseCategoria="post";
                break;

            case "🟡 Reel":
                claseCategoria="reel";
                break;

            case "🟢 WhatsApp":
                claseCategoria="whatsapp";
                break;

            case "🟠️ Entrada de blog":
                claseCategoria="blog";
                break;

            case "🟤 Historia":
                claseCategoria="historia";
                break;

            case "🔴 Video":
                claseCategoria="video";
                break;

            default:
                claseCategoria="otro";

        }

        lista.innerHTML +=`

<div class="recordatorio">

<h3>${r.titulo}</h3>

<p class="categoria ${claseCategoria}">
${r.categoria}
</p>

<p>${r.descripcion}</p>

<p><strong>${fechaBonita}</strong></p>

<button
class="eliminar"
onclick="eliminar(${r.id})">
Eliminar
</button>

</div>

`;

    });

}

function eliminar(id){

    let recordatorios =
        JSON.parse(localStorage.getItem("recordatorios")) || [];

    recordatorios =
        recordatorios.filter(r => r.id !== id);

    localStorage.setItem(
        "recordatorios",
        JSON.stringify(recordatorios)
    );

    cargarRecordatorios();
}
