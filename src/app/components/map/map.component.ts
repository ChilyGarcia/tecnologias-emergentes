import {
  AfterViewInit,
  Component,
  OnInit,
  Input,
  SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnInit {
  @Input() selectedFilter: string = '';

  private map: L.Map | undefined;
  currentPosition: L.LatLng | undefined;
  markers: L.Marker[] = [];

  ngOnInit() {}

  ngAfterViewInit() {
    this.loadMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedFilter'] && !changes['selectedFilter'].firstChange) {
      this.filterPlaces(this.selectedFilter);
    }
  }

  async loadMap() {
    try {
      const cucutaPosition: LatLngTuple = [7.8939, -72.5078];

      this.map = L.map('map').setView(cucutaPosition, 15);
      console.log('Mapa inicializado:', this.map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      setTimeout(() => {
        this.map?.invalidateSize();
      }, 100);
    } catch (error) {
      console.log('Error al cargar el mapa', error);
    }
  }

  filterPlaces(category: string) {
    this.clearMarkers();

    const radius = 5000;
    const cityCoordinates = { lat: 7.8939, lng: -72.5079 }; 

    let overpassQuery = '';
    if (category === 'hotel') {
      overpassQuery = `node["tourism"="hotel"]`;
    } else if (category === 'bar') {
      overpassQuery = `node["amenity"="bar"]`;
    } else if (category === 'restaurant') {
      overpassQuery = `node["amenity"="restaurant"]`;
    }

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(${overpassQuery}(around:${radius},${cityCoordinates.lat},${cityCoordinates.lng}););out;`;

    fetch(overpassUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(`${category} encontrados:`, data.elements.length);
        data.elements.forEach(
          (element: { lat: number; lon: number; tags: { name: any } }) => {
            const position = L.latLng(element.lat, element.lon);
            this.addMarker(position, element.tags.name || category);
          }
        );
      })
      .catch((error) => console.error(`Error al buscar ${category}:`, error));
  }

  addMarker(position: L.LatLng, title: string) {
    if (this.map) {
      const marker = L.marker(position).addTo(this.map).bindPopup(title);
      this.markers.push(marker);
    }
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    this.markers = [];
  }
}
