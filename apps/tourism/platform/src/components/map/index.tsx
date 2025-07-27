import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import styles from './map.module.scss';
import L from 'leaflet';
import cn from 'classnames';
interface MapProps {
  markers?: { popup?: string; marker: [number, number] }[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}
const customIcon = new L.Icon({
  iconUrl:
    'data:image/svg;base64,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',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const Map = ({ markers, center, zoom = 14, className }: MapProps) => {
  return (
    <MapContainer
      center={center || [35.7219, 51.3347]}
      zoom={zoom}
      scrollWheelZoom={false}
      attributionControl={false}
      className={cn(styles['map'], className)}
    >
      <TileLayer url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}" />
      {markers?.map((item) => {
        return (
          <Marker
            key={String(item.marker[0]) + String(item.marker[1])}
            position={item.marker}
            icon={customIcon}
          >
            {item?.popup && <Popup>{item?.popup}</Popup>}
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
