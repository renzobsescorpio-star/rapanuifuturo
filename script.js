function mostrar(id){

    document
    .querySelectorAll(".panel")
    .forEach(panel=>{
        panel.style.display="none";
    });

    document
    .getElementById(id)
    .style.display="block";
}

mostrar("mar");

// ================================
// CONDICIONES ACTUALES
// ================================

async function cargarCondiciones() {

    try {

        const respuestaMar = await fetch(
            "https://marine-api.open-meteo.com/v1/marine?latitude=-27.1127&longitude=-109.3497&hourly=wave_height,sea_surface_temperature"
        );

        const datosMar = await respuestaMar.json();

        document.getElementById("tempMar").innerHTML =
        datosMar.hourly.sea_surface_temperature[0] + " °C";

        document.getElementById("oleaje").innerHTML =
        datosMar.hourly.wave_height[0] + " m";

    }

    catch(error){

        console.error(error);

        document.getElementById("tempMar").innerHTML =
        "No disponible";

        document.getElementById("oleaje").innerHTML =
        "No disponible";
    }

}

async function cargarViento() {

    try {

        const respuestaViento = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=-27.1127&longitude=-109.3497&current=wind_speed_10m"
        );

        const datosViento = await respuestaViento.json();

        document.getElementById("viento").innerHTML =
        datosViento.current.wind_speed_10m + " km/h";

    }

    catch(error){

        console.error(error);

        document.getElementById("viento").innerHTML =
        "No disponible";
    }

}

// Salinidad temporal
document.getElementById("salinidad").innerHTML =
"35 PSU";

cargarCondiciones();
cargarViento();

// =========================
// ESTADÍSTICAS INTERACTIVAS
// =========================

const datos = {

    mar:{
        años:[2000,2005,2010,2015,2020,2025,2030,2035,2040,2045,2050,2055,2060,2065,2070,2075,2080,2085,2090,2095,2100],
        valores:[0,1,3,5,7,10,13,17,21,26,31,36,41,46,50,54,57,59,61,63,65]
    },

    temperatura:{
        años:[2000,2005,2010,2015,2020,2025,2030,2035,2040,2045,2050,2055,2060,2065,2070,2075,2080,2085,2090,2095,2100],
        valores:[22.4,22.5,22.6,22.8,23.0,23.2,23.4,23.6,23.8,24.0,24.2,24.4,24.6,24.8,25.0,25.1,25.2,25.3,25.4,25.5,25.6]
    },

    co2:{
        años:[2000,2005,2010,2015,2020,2025,2030,2035,2040,2045,2050,2055,2060,2065,2070,2075,2080,2085,2090,2095,2100],
        valores:[370,379,390,401,414,425,438,451,465,480,495,510,525,540,555,570,585,600,615,630,645]
    },

    contaminacion:{
        años:[2000,2005,2010,2015,2020,2025,2030,2035,2040,2045,2050,2055,2060,2065,2070,2075,2080,2085,2090,2095,2100],
        valores:[15,18,22,28,35,42,48,54,59,63,67,70,72,74,75,76,77,78,79,80,81]
    }

};

const ctx =
document.getElementById("grafico"). getContext("2d");

const grafico = new Chart(ctx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{

            label: "Nivel del Mar",

            data: [],

            tension: 0.4

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: true

    }

});

function actualizarGrafico() {

    const variable =
    document.getElementById("variableSelect").value;

    const año =
    parseInt(
        document.getElementById("yearSlider").value
    );

    document.getElementById("selectedYear").innerHTML =
    "Año: " + año;

    const dataset =
    datos[variable];

    const index =
    dataset.años.findIndex(
        a => a === año
    );

    grafico.data.labels =
    dataset.años.slice(0,index+1);

    grafico.data.datasets[0].data =
    dataset.valores.slice(0,index+1);

    grafico.data.datasets[0].label =
    document.getElementById("variableSelect")
    .options[
        document.getElementById("variableSelect").selectedIndex
    ].text;

    grafico.update();
}

document
.getElementById("yearSlider")
.addEventListener(
    "input",
    actualizarGrafico
);

document
.getElementById("variableSelect")
.addEventListener(
    "change",
    actualizarGrafico
);

actualizarGrafico();

/*------------ escena 3d ------------*/

const abrirSimulador =
document.getElementById("abrirSimulador");

const cerrarSimulador =
document.getElementById("cerrarSimulador");

const simuladorPage =
document.getElementById("simuladorPage");

abrirSimulador.addEventListener("click",()=>{

    simuladorPage.style.display = "block";

    renderer.setSize(
        contenedor.clientWidth,
        contenedor.clientHeight
    );

    camara.aspect =
        contenedor.clientWidth /
        contenedor.clientHeight;

    camara.updateProjectionMatrix();

    simuladorPage.scrollIntoView({
        behavior:"smooth"
    });

});

cerrarSimulador.addEventListener("click",()=>{

    simuladorPage.style.display = "none";

});

// =========================
// SIMULADOR NIVEL DEL MAR
// =========================

const slider3D =
document.getElementById("simuladorSlider");

const anio3D =
document.getElementById("simuladorAnio");

const nivel3D =
document.getElementById("simuladorNivel");

const riesgo =
document.getElementById("riesgoCosta");

slider3D.addEventListener("input",()=>{

    const anio =
    parseInt(slider3D.value);

    anio3D.innerHTML =
    "Año: " + anio;

    const aumento =
    ((anio - 2000) / 100) * 65;

    nivel3D.innerHTML =
    "Aumento estimado: "
    + aumento.toFixed(1)
    + " cm";

    mar.position.y =
    (aumento / 65) * 3;

if(aumento < 20){

    riesgo.innerHTML =
    "Riesgo costero: Bajo";

}else if(aumento < 45){

    riesgo.innerHTML =
    "Riesgo costero: Medio";

}else{

    riesgo.innerHTML =
    "Riesgo costero: Alto";

}

});

// =========================
// ESCENA 3D
// =========================

const escena = new THREE.Scene();

escena.background =
new THREE.Color(0x87ceeb);

const contenedor =
document.getElementById("escena3D");

const camara =
new THREE.PerspectiveCamera(
75,
contenedor.clientWidth /
contenedor.clientHeight,
0.1,
1000
);

const renderer =
new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
contenedor.clientWidth,
contenedor.clientHeight
);

contenedor.appendChild(
renderer.domElement
);

const luz =
new THREE.DirectionalLight(
0xffffff,
1
);

luz.position.set(
5,
10,
5
);

escena.add(luz);

const luzAmbiente =
new THREE.AmbientLight(
0xffffff,
0.6
);

escena.add(luzAmbiente);

const marGeometry =
new THREE.BoxGeometry(
20,
1,
20
);

const marMaterial =
new THREE.MeshPhongMaterial({
color:0x3399ff,
transparent:true,
opacity:0.8
});

const mar =
new THREE.Mesh(
marGeometry,
marMaterial
);

escena.add(mar);

const playaGeometry =
new THREE.CylinderGeometry(
5.2,
5.2,
0.3,
32
);

const playaMaterial =
new THREE.MeshPhongMaterial({
color:0xf4d28c
});

const playa =
new THREE.Mesh(
playaGeometry,
playaMaterial
);

playa.position.y = 0.3;

escena.add(playa);

const islaGeometry =
new THREE.CylinderGeometry(
2,
5,
4,
32
);

const islaMaterial =
new THREE.MeshPhongMaterial({
color:0x3d8b37
});

const isla =
new THREE.Mesh(
islaGeometry,
islaMaterial
);

isla.position.y = 1.5;

escena.add(isla);

camara.position.set(
10,
8,
10
);

camara.lookAt(
0,
0,
0
);

function animar(){

requestAnimationFrame(animar);

isla.rotation.y += 0.003;

renderer.render(
escena,
camara
);

}

animar();