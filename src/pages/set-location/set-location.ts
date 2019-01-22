import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";
import { Location } from "../../models/location";

@IonicPage()
@Component({
  selector: "page-set-location",
  templateUrl: "set-location.html"
})
export class SetLocationPage implements OnInit {
  location: Location;
  marker: Location;
  isLocationSet: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController
  ) {
    this.location = this.navParams.get("location");
    this.isLocationSet = this.navParams.get("isSet");
    if (this.isLocationSet) {
      this.marker = this.location;
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad SetLocationPage");
  }

  ngOnInit() {}

  onSetMarker(event: any) {
    this.marker = new Location(event.coords.lat, event.coords.lng);
  }
  onConfirm() {
    this.viewCtrl.dismiss({ location: this.marker });
  }
  onAbort() {
    this.viewCtrl.dismiss();
  }
}
