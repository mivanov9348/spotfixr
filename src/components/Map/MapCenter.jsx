import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';

function MapCenter({ center, zoom, onCenterHandled }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 10);
      onCenterHandled();
    }
  }, [center, zoom, map, onCenterHandled]);
  return null;
}

export default MapCenter;