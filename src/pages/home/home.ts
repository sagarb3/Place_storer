import { Component, OnInit } from "@angular/core";
import { NavController, ModalController } from "ionic-angular";
import { AddPlacePage } from "../add-place/add-place";
import { Place } from "../../models/place";
import { PlacesService } from "../../services/places";
import { PlacePage } from "../place/place";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  addPlacePage: any = AddPlacePage;
  places: Place[] = [];
  constructor(
    public navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController
  ) {}
  ionViewWillEnter() {
    this.places = this.placesService.loadPlace();
  }
  ngOnInit() {
    this.placesService.fetchPlaces().then((places: Place[]) => {
      console.log("loaded places", places);
      this.places = places;
    });
  }
  onOpenPlace(place: Place, index: number) {
    const modal = this.modalCtrl.create(PlacePage, {
      place: place,
      index: index
    });
    modal.present();
    modal.onDidDismiss(() => {
      this.places = this.placesService.loadPlace();
    });
  }
}
