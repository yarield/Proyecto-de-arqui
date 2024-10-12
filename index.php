<?php
// Obtener el mes y el año actuales o los seleccionados
$month = isset($_GET['month']) ? (int)$_GET['month'] : (int)date('m');
$year = isset($_GET['year']) ? (int)$_GET['year'] : (int)date('Y');

// Validar la fecha seleccionada desde GET
$selectedDate = isset($_GET['date']) ? $_GET['date'] : ''; 
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendario de Reservaciones y Mediciones</title>
    <link rel="stylesheet" href="estilo.css">
</head>
<body class="body-calendario bg-color">
    <div class="calendar-container">
        <div class="calendar">
            <div class="header">
                <a href="?month=<?php echo $month - 1; ?>&year=<?php echo $year; ?>">&lt;</a>
                <span><?php echo date('F Y', strtotime("$year-$month-01")); ?></span>
                <a href="?month=<?php echo $month + 1; ?>&year=<?php echo $year; ?>">&gt;</a>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Dom</th>
                        <th>Lun</th>
                        <th>Mar</th>
                        <th>Mié</th>
                        <th>Jue</th>
                        <th>Vie</th>
                        <th>Sáb</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
                    $firstDayOfMonth = date('w', strtotime("$year-$month-01"));
                    $currentDay = ($month == date('m') && $year == date('Y')) ? date('j') : null;

                    $dayCount = 1;
                    echo "<tr>";
                    for ($i = 0; $i < $firstDayOfMonth; $i++) {
                        echo '<td></td>';
                    }
                    for ($day = 1; $day <= $daysInMonth; $day++) {
                        if (($day + $firstDayOfMonth - 1) % 7 == 0) {
                            echo '</tr><tr>';
                        }
                        $class = ($day == $currentDay) ? 'class="today"' : '';
                        echo "<td $class><a href=\"?month=$month&year=$year&date=$year-$month-$day\">$day</a></td>";
                    }
                    echo "</tr>";
                    ?>
                </tbody>
            </table>
        </div>
    </div>

    <div class="container">
        <button id="showConsultas" class="btn">Mostrar Datos</button>
        <button id="showGrafico" class="btn">Mostrar Gráfico</button>
        <button id="showGraficoConsulta3" class="btn btn-primary">Mostrar Máximos y Mínimos</button>
    </div>

    <div class="container">
        <h2>Consulta 2: Promedio en un rango de fechas</h2>
        <label for="startDate">Fecha de inicio:</label>
        <input type="date" id="startDate">
        <label for="endDate">Fecha de fin:</label>
        <input type="date" id="endDate">
        <button id="showGraficoConsulta2" class="btn">Mostrar Gráfico Promedio</button>
    </div>

    <!-- Modal para mostrar datos -->
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="modal-body"></div>
        </div>
    </div>

    <!-- Modal para mostrar gráfico -->
    <div id="myModalGrafico" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <canvas id="chartContainer" width="400" height="200"></canvas>
        </div>
    </div>    

    <div id="consulta3Modal" class="modal" style="display:none;">
        <div class="modal-content">
            <span id="closeConsulta3Modal" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
            <h2>Máximos y Mínimos</h2>
            <p id="maxMinTemp">Temperatura:</p>
            <p id="maxMinHum">Humedad:</p>
        </div>
    </div>

    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-database-compat.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="script.js"></script>

    <script>
        // Pasar la fecha seleccionada desde PHP a JavaScript
        const selectedDate = "<?php echo isset($selectedDate) ? $selectedDate : ''; ?>";
        console.log("Fecha seleccionada:", selectedDate);
    </script>
</body>
</html>
