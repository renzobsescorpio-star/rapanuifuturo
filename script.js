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
document.getElementById("grafico");

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