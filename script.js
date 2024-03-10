// Richtungswechsel für RNL oder LNR
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('switchDirBtn');
  btn.addEventListener('click', switchDirection);
});

// swtichDirection wechselt Textausrichtung
function switchDirection() {
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir === 'ltr' ? 'rtl' : 'ltr');
}

// Objekt zur Speicherung des Sortierzustands jeder Spalte - für die Tabelle
var sortDirection = {};

// sortTable Funktion sortiert die Tabelle basierend auf der angeklickten Spalte
function sortTable(columnIndex) {
  var table, rows, switching, i, x, y, shouldSwitch, direction, switchcount = 0;
  table = document.getElementById("co2Table");
  switching = true;
  direction = sortDirection[columnIndex] || "asc";

  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[columnIndex];
      y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
      let xValue = x.textContent; // Sicherer Umgang mit Textwerten.
      let yValue = y.textContent;

      // Konvertierung in Zahlen für die korrekte Sortierung von numerischen Werten
      if (columnIndex === 2) { // Spezifisch für die CO2-Emissionsspalte
        xValue = parseFloat(xValue);
        yValue = parseFloat(yValue);
      }

      // Sortierentscheidung
      if ((direction == "asc" && xValue > yValue) || (direction == "desc" && xValue < yValue)) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else if (switchcount == 0 && direction == "asc") {
      direction = "desc";
      sortDirection[columnIndex] = "desc";
      switching = true;
    } else {
      sortDirection[columnIndex] = "asc";
    }
  }

  // Aktualisierung der visuellen Sortierrichtungsanzeige
  var headers = table.getElementsByTagName("TH");
  for (i = 0; i < headers.length; i++) {
    headers[i].classList.remove("sort-asc", "sort-desc");
  }
  headers[columnIndex].classList.add(direction == "asc" ? "sort-asc" : "sort-desc");
}



// Filtermöglichkeit der Tabelle
// Filtert die Tabelle basierend auf ausgewähltem Land und Emissionswerten.
function filterTable() {
  var table, rows, countryFilter, minEmissions, maxEmissions;
  countryFilter = document.getElementById("countryFilter").value.toLowerCase();
  minEmissions = parseInt(document.getElementById("minEmissions").value, 10);
  maxEmissions = parseInt(document.getElementById("maxEmissions").value, 10);
  table = document.getElementById("co2Table");
  rows = table.getElementsByTagName("tr");

  for (var i = 1; i < rows.length; i++) {
    let countryCell = rows[i].getElementsByTagName("td")[0];
    let emissionsCell = rows[i].getElementsByTagName("td")[2];
    let country = countryCell.textContent.toLowerCase();
    let emissions = parseFloat(emissionsCell.textContent);

    if ((country.indexOf(countryFilter) > -1 || countryFilter === "") &&
        (emissions >= minEmissions || isNaN(minEmissions)) &&
        (emissions <= maxEmissions || isNaN(maxEmissions))) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}

  // Emissionswerte Slider
  function updateEmissionsValue() {
    var minEmissionsValue = document.getElementById("minEmissions").value;
    var maxEmissionsValue = document.getElementById("maxEmissions").value;
    
    document.getElementById("minEmissionsValue").textContent = minEmissionsValue;
    document.getElementById("maxEmissionsValue").textContent = maxEmissionsValue;
    
    filterTable(); // Aktualisiert die Filterung der Tabelle basierend auf den neuen Werten
  }