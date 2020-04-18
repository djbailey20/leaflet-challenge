// Creating map object

// Load in geojson data
var geoData =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// var geojson;

// Grab data with d3
d3.json(geoData, function (data) {
  console.log(data);
  var earthquakes = L.geoJSON(data, {
    onEachFeature: (feature, layer) => {
      layer.bindPopup(
        "<h3>" +
          feature.properties.place +
          "</h3><p>Magnitude: " +
          feature.properties.mag +
          "</p>"
      );
    },
    pointToLayer: (feature, coordinates) => {
      var color;
      switch (true) {
        case feature.properties.mag > 9:
          color = "#ff2e00";
          break;

        case feature.properties.mag > 8:
          color = "#ff5500";
          break;

        case feature.properties.mag > 7:
          color = "#ff7300";
          break;
        case feature.properties.mag > 6:
          color = "#ff8e00";
          break;
        case feature.properties.mag > 5:
          color = "#fca600";
          break;
        case feature.properties.mag > 4:
          color = "#f6be00";
          break;
        case feature.properties.mag > 3:
          color = "#edd400";
          break;
        case feature.properties.mag > 2:
          color = "#e2ea00";
          break;
        default:
          color = "#d5ff00";
          break;
      }
      return L.circle(coordinates, {
        stroke: false,
        fillOpacity: 1,
        color: "white",
        fillColor: color,
        radius: feature.properties.mag * 10000,
      });
    },
  });
  createMap(earthquakes);
});
function createMap(earthquakes) {
  // Adding tile layer
  var streetmap = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY,
    }
  );
  var satellite = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY,
    }
  );
  var outdoors = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.outdoors",
      accessToken: API_KEY,
    }
  );
  var comic = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.comic",
      accessToken: API_KEY,
    }
  );
  var pencil = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.pencil",
      accessToken: API_KEY,
    }
  );
  var faultlines = L.layerGroup();
  d3.json("./static/data/data2.json", (data) => {
    faultLayer = L.geoJSON(data, {
      style: {
        color: "orange",
        fillOpacity: 0,
        weight: 4,
      },
    });
    faultlines.addLayer(faultLayer);
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    Satellite: satellite,
    Outdoors: outdoors,
    Comic: comic,
    Pencil: pencil,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Faultlines: faultlines,
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes],
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    var colors = [
      "#d5ff00",
      "#e2ea00",
      "#edd400",
      "#f6be00",
      "#fca600",
      "#ff8e00",
      "#ff7300",
      "#ff5500",
      "#ff2e00",
    ];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Earthquake Magnitude</h1>";

    div.innerHTML = legendInfo;

    limits.forEach(function (limit, index) {
      var label;
      if (index == 0) {
        label = "0-2";
      } else {
        label = limits[index - 1] + "-" + limits[index];
      }
      labels.push(
        '<li style="background-color: ' + colors[index] + '">' + label + "</li>"
      );
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  //Adding legend to the map
  legend.addTo(myMap);
}
