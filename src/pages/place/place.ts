import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { Place } from "../../models/place";
import { PlacesService } from "../../services/places";

@IonicPage()
@Component({
  selector: "page-place",
  templateUrl: "place.html"
})
export class PlacePage {
  place: Place;
  index: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private placesService: PlacesService
  ) {
    this.place = this.navParams.get("place");
    console.log("loaded place", this.place);
    this.index = this.navParams.get("index");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PlacePage");
  }

  onLeave() {
    this.viewCtrl.dismiss();
  }
  onDelete() {
    this.placesService.deletePlace(this.index);
    this.viewCtrl.dismiss();
  }
}
