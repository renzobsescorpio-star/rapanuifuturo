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

const seaSlider =
document.getElementById("seaSlider");

const yearDisplay =
document.getElementById("yearDisplay");

const seaRise =
document.getElementById("seaRise");

const projectionText =
document.getElementById("projectionText");

const futureProjection =
document.getElementById("futureProjection");

seaSlider.addEventListener("input",()=>{

    const year =
    parseInt(seaSlider.value);

    yearDisplay.innerHTML =
    "Año: " + year;

    let rise =
    Math.round(((year-2025)/75)*60);

    seaRise.innerHTML =
    "Aumento estimado: " + rise + " cm";

    if(year <= 2035){

        projectionText.innerHTML =
        "Impacto esperado bajo.";

        futureProjection.innerHTML =
        "Las inundaciones costeras seguirían siendo poco frecuentes.";

    }

    else if(year <= 2055){

        projectionText.innerHTML =
        "Impacto moderado.";

        futureProjection.innerHTML =
        "Aumentaría la erosión costera y la exposición de sectores bajos.";

    }

    else if(year <= 2080){

        projectionText.innerHTML =
        "Impacto significativo.";

        futureProjection.innerHTML =
        "Se observarían cambios visibles en playas y zonas costeras.";

    }

    else{

        projectionText.innerHTML =
        "Impacto alto.";

        futureProjection.innerHTML =
        "Algunas áreas costeras podrían experimentar inundaciones frecuentes.";

    }

});