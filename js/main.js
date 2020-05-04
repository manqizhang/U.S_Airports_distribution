// 1. Create a map object.
var mymap = L.map('map', {
    center: [44.13, -119.93],
    zoom: 7,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add airport GeoJSON Data
// Null variable that will hold airport data
var airports = null;


// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('Set3').mode('lch').colors(3);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 3; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// Get GeoJSON and put on it on the map when it loads
airports= L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the airports object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`
    onEachFeature: function (feature, layer) {
      var information = "<p> Airport Name: " + feature.properties.AIRPT_NAME + '<p>'
                      + "<p> State: " + feature.properties.STATE + '<p>'
                      + "<p> City: " + feature.properties.CITY + '<p>'
                      + "<p> Control Tower: " + feature.properties.CNTL_TWR + '<p>'
        layer.bindPopup(information);
    },
    pointToLayer: function (feature, latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") { id = 0; }
        else if (feature.properties.CNTL_TWR == "N") { id = 1; }
        return L.marker(latlng, {icon: L.divIcon({className: 'fas fa-plane marker-color-' + (id + 1).toString() })});
    },
    attribution: 'Airport Data &copy; Data.gov | U.S. States &copy; Mike Bostock-D3 | Base Map &copy; CartoDB | Made By Manqi Zhang'
}).addTo(mymap);


// 6. Set function for color ramp
colors = chroma.scale('RdPu').colors(5);

function setColor(density) {
    var id = 0;
    if (density > 25) { id = 4; }
    else if (density > 15 && density <= 25) { id = 3; }
    else if (density > 10 && density <= 15) { id = 2; }
    else if (density > 5 &&  density <= 10) { id = 1; }
    else  { id = 0; }
    return colors[id];
}


// 7. Set style function that set the base color of the United States map
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4',
    };
}

// 8. Add county polygons
// create counties variable, and assign null to it.
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(mymap);


// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// 10. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Number of Airport</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>26+</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>16-25</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>11-15</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 6-10</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p>0-5</p>';
    div.innerHTML += '<b>Airport Tower</b><br />';
    div.innerHTML += '<i class="fas fa-plane marker-color-1"></i><p> With Tower</p>';
    div.innerHTML += '<i class="fas fa-plane marker-color-2"></i><p> Without Tower</p>';

    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
