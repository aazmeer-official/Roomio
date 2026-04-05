const mapData = document.getElementById('map-data');
const coordinates = JSON.parse(mapData.dataset.coordinates);
const listingLocation = mapData.dataset.location;

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  center: coordinates,
  zoom: 9,
});

const marker = new mapboxgl.Marker({ color: 'red', rotation: 45 })
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${listingLocation}</h3><p>Exact Location Provided after the booking</p>`))
  .addTo(map);