mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  // style:"mapbox://styles/mapbox/dark-v11",
  center: data.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

console.log(data.geometry.coordinates)
// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({ color: 'red', rotation: 45 })
  .setLngLat(data.geometry.coordinates) //Lising.geometry.coordinates
  .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h3>${data.location}</h3><p>Exact Location Provided after the booking </p>`))
  
  .addTo(map);
