mapboxgl.accessToken=mapToken;
            
    const map=new mapboxgl.Map({
        container: "map",
        style:"mapbox://styles/mapbox/streets-v12",
        center:coordinates,
        zoom:15,
    });

    const marker=new mapboxgl.Marker({color: "red"})
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<p>Exact location provided after booking</p>"))
        .addTo(map);