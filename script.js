// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBFAjpbMT0xU2EqG_YESl9QfUhaTbV8jQE",
    authDomain: "forebasepy.firebaseapp.com",
    databaseURL: "https://forebasepy-default-rtdb.firebaseio.com",
    projectId: "forebasepy",
    storageBucket: "forebasepy.appspot.com",
    messagingSenderId: "970357050884",
    appId: "1:970357050884:web:0bb44d61f298b8ef79ef51",
    measurementId: "G-SHPHHH150V"
};

let chartInstance = null;

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function () {
    if (!selectedDate || isNaN(Date.parse(selectedDate))) {
        console.log("Fecha no válida o no seleccionada");
    } else {
        console.log("Fecha válida:", selectedDate);
    }

    // Cargar las mediciones y filtrar por fecha seleccionada
    document.getElementById('showConsultas').addEventListener('click', function () {
        if (!selectedDate || selectedDate === "") {
            alert("Por favor selecciona una fecha en el calendario.");
            return;
        }

        const ref = database.ref('Mediciones');
        ref.once('value', (snapshot) => {
            const datos = snapshot.val();
            let medicionesFiltradas = [];

            for (const key in datos) {
                const mediciones = datos[key].mediciones;
                for (const id in mediciones) {
                    const medicion = mediciones[id];
                    // Asegurar que las fechas se están formateando correctamente
                    const formattedMedicionFecha = medicion.fecha ? new Date(medicion.fecha).toISOString().split('T')[0] : null;
                    const formattedSelectedDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : null;

                    // Verificar que ambas fechas son válidas
                    if (!formattedMedicionFecha || !formattedSelectedDate) {
                        console.log("Fecha inválida detectada en la medición.");
                        continue; // Saltar a la siguiente medición si alguna fecha es inválida
                    }

                    if (formattedMedicionFecha === formattedSelectedDate) {
                        medicionesFiltradas.push(medicion);
                    }
                }
            }

            if (medicionesFiltradas.length > 0) {
                // Mostrar las mediciones filtradas en el modal
                const modalBody = document.getElementById('modal-body');
                modalBody.innerHTML = '';
                medicionesFiltradas.forEach(medicion => {
                    const medicionBox = document.createElement('div');
                    medicionBox.classList.add('medicion-box');
                    medicionBox.innerHTML = `
                        <h2>${medicion.fecha} - ${medicion.hora}</h2>
                        <div class="temp-hum">
                            <div><strong>Temp:</strong> ${medicion.temperatura || 'N/A'} °C</div>
                            <div><strong>Humedad:</strong> ${medicion.humedad || 'N/A'}%</div>
                        </div>
                    `;
                    modalBody.appendChild(medicionBox);
                });

                const modal = document.getElementById('myModal');
                modal.style.display = 'block';
            } else {
                alert("No hay mediciones para la fecha seleccionada.");
            }
        });
    });

    // Mostrar gráfico
    document.getElementById('showGrafico').addEventListener('click', function () {
        if (!selectedDate || selectedDate === "") {
            alert("Por favor selecciona una fecha en el calendario.");
            return;
        }
    
        const ref = database.ref('Mediciones');
        ref.once('value', (snapshot) => {
            const datos = snapshot.val();
            let medicionesFiltradas = [];
    
            for (const key in datos) {
                const mediciones = datos[key].mediciones;
                for (const id in mediciones) {
                    const medicion = mediciones[id];
                    const formattedMedicionFecha = medicion.fecha ? new Date(medicion.fecha).toISOString().split('T')[0] : null;
                    const formattedSelectedDate = new Date(selectedDate).toISOString().split('T')[0];
    
                    if (formattedMedicionFecha === formattedSelectedDate) {
                        medicionesFiltradas.push(medicion);
                    }
                }
            }
    
            if (medicionesFiltradas.length > 0) {
                // Calcular promedios por hora y renderizar gráfico
                renderChart(medicionesFiltradas); // Pasar mediciones sin calcular todavía
                const modal = document.getElementById('myModalGrafico');
                modal.style.display = 'block';
            } else {
                alert("No hay mediciones para la fecha seleccionada.");
            }
        });
    });

    document.getElementById('showGraficoConsulta2').addEventListener('click', function () {
        console.log("Se presionó el botón de la Consulta 2.");
    
        // Obtener las fechas seleccionadas por el usuario
        let startDate = document.getElementById('startDate').value;
        let endDate = document.getElementById('endDate').value;
    
        // Mensajes de depuración para verificar las fechas seleccionadas
        console.log("Fecha de inicio seleccionada (sin formato):", startDate);
        console.log("Fecha de fin seleccionada (sin formato):", endDate);
    
        // Verifica si ambas fechas están seleccionadas
        if (!startDate || !endDate) {
            alert("Por favor selecciona un rango de fechas.");
            return;
        }
    
        // Convertir las fechas al formato yyyy-mm-dd
        startDate = new Date(startDate).toISOString().split('T')[0];
        endDate = new Date(endDate).toISOString().split('T')[0];
    
        // Mostrar las fechas convertidas en la consola
        console.log("Fecha de inicio (convertida a yyyy-mm-dd):", startDate);
        console.log("Fecha de fin (convertida a yyyy-mm-dd):", endDate);
    
        const ref = database.ref('Mediciones');
    
        ref.once('value', (snapshot) => {
            const datos = snapshot.val();
    
            // Mostrar los datos recibidos desde Firebase en la consola
            console.log("Datos recibidos de Firebase:", datos);
    
            let medicionesFiltradas = [];
    
            for (const key in datos) {
                const mediciones = datos[key].mediciones;
                for (const id in mediciones) {
                    const medicion = mediciones[id];
                    const medicionFecha = new Date(medicion.fecha).toISOString().split('T')[0];
    
                    // Mostrar la fecha de cada medición para verificar si se está procesando correctamente
                    console.log("Fecha de la medición:", medicionFecha);
    
                    // Verificar si la medición está dentro del rango de fechas seleccionado
                    if (medicionFecha >= startDate && medicionFecha <= endDate) {
                        console.log("Medición dentro del rango:", medicion);
                        medicionesFiltradas.push(medicion);
                    }
                }
            }
    
            // Mostrar las mediciones filtradas en la consola
            console.log("Mediciones filtradas:", medicionesFiltradas);
    
            if (medicionesFiltradas.length > 0) {
                // Calcular los promedios generales en el rango de fechas
                const averages = calculateRangeAverages(medicionesFiltradas);
    
                // Mostrar los promedios calculados en la consola
                console.log("Promedios calculados:", averages);
    
                // Renderizar el gráfico con los promedios generales
                renderChartConsulta2(averages);
    
                // Mostrar el modal con el gráfico
                const modal = document.getElementById('myModalGrafico');
                modal.style.display = 'block';
            } else {
                // Mostrar un mensaje de alerta si no hay mediciones en el rango de fechas seleccionado
                alert("No hay mediciones para el rango de fechas seleccionado.");
            }
        });
    });
    
    // Función para calcular los promedios en el rango de fechas
    function calculateRangeAverages(mediciones) {
        let totalTemp = 0;
        let totalHum = 0;
        let count = 0;
    
        mediciones.forEach((medicion) => {
            if (medicion.temperatura) {
                totalTemp += medicion.temperatura;
            }
            if (medicion.humedad) {
                totalHum += medicion.humedad;
            }
            count++;
        });
    
        // Mostrar en la consola el número total de mediciones procesadas
        console.log("Total de mediciones procesadas:", count);
    
        return {
            avgTemp: totalTemp / count,
            avgHum: totalHum / count,
            count
        };
    }

   
    function renderChartConsulta2(averages) {
        const ctx = document.getElementById('chartContainer').getContext('2d');

        // Destruir el gráfico anterior si existe
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Crear el gráfico con los promedios calculados (Temperatura y Humedad)
        chartInstance = new Chart(ctx, {
            type: 'bar', // Puedes cambiar a 'line' si prefieres un gráfico de línea
            data: {
                labels: ['Promedio del Rango Seleccionado'],
                datasets: [
                    {
                        label: 'Temperatura Promedio (°C)',
                        data: [averages.avgTemp],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Humedad Promedio (%)',
                        data: [averages.avgHum],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#FFFFFF' // Cambiar color del eje Y
                        }
                    },
                    x: {
                        ticks: {
                            color: '#FFFFFF' // Cambiar color del eje X
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#FFFFFF' // Cambiar color de las etiquetas de la leyenda
                        }
                    }
                }
            }
        });
    }


    document.getElementById('showGraficoConsulta3').addEventListener('click', function () {
        console.log("Se presionó el botón de la Consulta 3.");
    
        const ref = database.ref('Mediciones');
    
        ref.once('value', (snapshot) => {
            console.log("Datos de Firebase recibidos.");
            const datos = snapshot.val();
            console.log("Datos obtenidos:", datos);
            
            let maxTemp = -Infinity;
            let minTemp = Infinity;
            let maxHum = -Infinity;
            let minHum = Infinity;
    
            // Recorrer todos los datos para encontrar máximos y mínimos
            for (const key in datos) {
                const mediciones = datos[key].mediciones;
                console.log("Recorriendo mediciones de la clave:", key, mediciones);
    
                for (const id in mediciones) {
                    const medicion = mediciones[id];
                    console.log("Procesando medición:", medicion);
    
                    if (medicion.temperatura !== undefined) {
                        maxTemp = Math.max(maxTemp, medicion.temperatura);
                        minTemp = Math.min(minTemp, medicion.temperatura);
                    }
    
                    if (medicion.humedad !== undefined) {
                        maxHum = Math.max(maxHum, medicion.humedad);
                        minHum = Math.min(minHum, medicion.humedad);
                    }
                }
            }
    
            // Verificar que se obtuvieron los valores máximos y mínimos
            console.log("Máxima Temperatura:", maxTemp);
            console.log("Mínima Temperatura:", minTemp);
            console.log("Máxima Humedad:", maxHum);
            console.log("Mínima Humedad:", minHum);
    
            // Verificar que el contenido de los elementos del modal está accesible
            const tempElement = document.getElementById('maxMinTemp');
            const humElement = document.getElementById('maxMinHum');
    
            if (tempElement && humElement) {
                console.log("Elementos del modal encontrados.");
    
                // Mostrar los resultados en la ventana modal
                tempElement.innerHTML = `Máxima Temperatura: ${maxTemp}°C<br>Mínima Temperatura: ${minTemp}°C`;
                humElement.innerHTML = `Máxima Humedad: ${maxHum}%<br>Mínima Humedad: ${minHum}%`;
    
                // Abrir el modal
                const modal = document.getElementById('consulta3Modal');
                if (modal) {
                    console.log("Modal encontrado. Mostrando modal...");
                    modal.style.display = 'block';
                } else {
                    console.error("Modal no encontrado. Revisa el ID del modal.");
                }
            } else {
                console.error("Elementos del modal no encontrados. Verifica los IDs 'maxMinTemp' y 'maxMinHum'.");
            }
        }, (error) => {
            console.error("Error al obtener los datos de Firebase:", error);
        });
    });
    
    // Cerrar el modal cuando el usuario haga clic en el botón de cerrar (x)
    document.getElementById('closeConsulta3Modal').onclick = function() {
        const modal = document.getElementById('consulta3Modal');
        modal.style.display = 'none';
    }
    
    // Cerrar el modal si el usuario hace clic fuera del contenido
    window.onclick = function(event) {
        const modal = document.getElementById('consulta3Modal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    document.getElementById('showConsultas').addEventListener('click', function () {
        const consultaContainer = document.getElementById('consultaContainer');
        if (consultaContainer.style.display === "none") {
            consultaContainer.style.display = "block"; // Mostrar los botones de consultas
        } else {
            consultaContainer.style.display = "none"; // Ocultar los botones de consultas
        }
    });
    
    

    
    
    
    // Función para renderizar el gráfico
function renderChart(mediciones) {
    const ctx = document.getElementById('chartContainer').getContext('2d');

    // Destruir el gráfico anterior si existe
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Obtener etiquetas y datos directamente de las mediciones
    const labels = mediciones.map((data) => `${data.hora}`); // Mostrar la hora directamente
    const tempData = mediciones.map((data) => data.temperatura || 0);
    const humData = mediciones.map((data) => data.humedad || 0);

    // Crear el nuevo gráfico y guardarlo en chartInstance
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Temperatura (°C)',
                    data: tempData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                },
                {
                    label: 'Humedad (%)',
                    data: humData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                },
            ],
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hora del Día',
                        color: '#FFFFFF' // Cambia el color del texto del eje X
                    },
                    ticks: {
                        color: '#FFFFFF' // Cambia el color de las etiquetas de las horas en el eje X
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Valor',
                        color: '#FFFFFF' // Cambia el color del texto del eje Y
                    },
                    ticks: {
                        color: '#FFFFFF' // Cambia el color de las etiquetas de los valores en el eje Y
                    },
                    min: 0,
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.dataset.label + ': ' + tooltipItem.raw.toFixed(2);
                        }
                    }
                },
                legend: {
                    labels: {
                        color: '#FFFFFF' // Cambia el color de las etiquetas de la leyenda
                    }
                }
            }
        },
    });



    
}

        
    // Cerrar los modales
    document.getElementsByClassName('close')[0].onclick = function () {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
    };
    document.getElementsByClassName('close')[1].onclick = function () {
        const modal = document.getElementById('myModalGrafico');
        modal.style.display = 'none';
    };
});
