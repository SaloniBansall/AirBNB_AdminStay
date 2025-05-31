
	mapboxgl.accessToken =mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    // console.log(coordinates);

    const marker = new mapboxgl.Marker()
        .setLngLat(listing.geometry.coordinates)  // Listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML(`<H4>${listing.title}</H4><p>Exact location will be provided after booking.</p>`))
        .addTo(map);
