// mapboxgl.accessToken=mapToken;
            
//     const map=new mapboxgl.Map({
//         container: "map",
//         style:"mapbox://styles/mapbox/streets-v12",
//         center:coordinates,
//         zoom:15,
//     });

//     const marker=new mapboxgl.Marker({color: "red"})
//         .setLngLat(coordinates)
//         .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<p>Exact location provided after booking</p>"))
//         .addTo(map);

let customIcon = L.divIcon({
    className: 'custom-icon',
    html: '<i class="fa-solid fa-location-dot" style="color: #ff0000; font-size: 24px;"></i>',
    iconSize: [24, 24], // Size of the icon
    iconAnchor: [12, 24], // Anchor point of the icon
    popupAnchor: [0, -24] // Position of the popup relative to the icon
});

let map = L.map('map').setView([coordinates[1],coordinates[0]], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

var marker = L.marker([coordinates[1],coordinates[0]],{ icon: customIcon }).addTo(map);  

marker.bindPopup("<p>Exact location provided after booking</p>");