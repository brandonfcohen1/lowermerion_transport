"use client";

import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import Map, { GeolocateControl, Source, Layer } from "react-map-gl";
import trolleyLines from "../data/septa/Trolley_Lines.json";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export const MainMap = () => {
  const geolocateControlRef = useRef<any>(null);
  const mapRef = useRef<any>(null);

  const [viewport, setViewport] = useState({
    latitude: 40.014009,
    longitude: -75.2852367,
    zoom: 13,
  });

  return (
    <div className="h-screen w-screen relative">
      <Map
        initialViewState={viewport}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onMoveEnd={async (e) => {
          setViewport({
            longitude: e.target.getCenter().lng,
            latitude: e.target.getCenter().lat,
            zoom: e.target.getZoom(),
          });
        }}
      >
        {trolleyLines && (
          <Source id="trolley-lines" type="geojson" data={trolleyLines}>
            <Layer
              id="trolley-lines-layer"
              type="line"
              paint={{
                "line-color": "#f00",
                "line-width": 2,
              }}
            />
          </Source>
        )}
        <div className="z-1 absolute bottom-4 left-4">
          <GeolocateControl
            ref={geolocateControlRef}
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            onGeolocate={(pos) => {
              setViewport({
                ...viewport,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              });
            }}
          />
        </div>
      </Map>
    </div>
  );
};
