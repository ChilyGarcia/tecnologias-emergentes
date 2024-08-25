import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: L.Map | undefined;
  currentPosition: L.LatLng | undefined;

  ngAfterViewInit() {
    this.loadMap();
  }

  async loadMap() {
    try {
      const cucutaPosition: LatLngTuple = [7.8939, -72.5078];

      // Inicializar el mapa con la posición de Cúcuta
      this.map = L.map('map').setView(cucutaPosition, 15);
      console.log('Mapa inicializado:', this.map);

      // Agregar la capa de tiles de OpenStreetMap
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
}
