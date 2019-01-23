import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  LoadingController,
  ToastController
} from "ionic-angular";
import { NgForm } from "@angular/forms";
import { SetLocationPage } from "../set-location/set-location";
import { Location } from "../../models/location";
import { Geolocation } from "@ionic-native/geolocation";
import { Camera } from "@ionic-native/camera";
import { PlacesService } from "../../services/places";
import { File } from "@ionic-native/file";

declare var cordova: any;

@IonicPage()
@Component({
  selector: "page-add-place",
  templateUrl: "add-place.html"
})
export class AddPlacePage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private geoLocation: Geolocation,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private camera: Camera,
    private placesService: PlacesService,
    private File: File
  ) {}

  location: Location = {
    lat: 40.7624324,
    lng: -73.9759827
  };

  locationIsSet = false;
  imageUrl: string = "";

  ionViewDidLoad() {
    console.log("ionViewDidLoad AddPlacePage");
  }
  onSubmit(form: NgForm) {
    //console.log(form.value);
    this.placesService.addPlace(
      form.value.title,
      form.value.description,
      this.location,
      this.imageUrl
    );
    form.reset();
    this.location = {
      lat: 40.7624324,
      lng: -73.9759827
    };
    this.locationIsSet = false;
    this.imageUrl = "";
  }
  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {
      location: this.location,
      isSet: this.locationIsSet
    });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        this.location = data.location;
        this.locationIsSet = true;
      }
    });
  }
  onLocate() {
    const loader = this.loadingCtrl.create({
      content: "Getting your location..."
    });
    loader.present();
    this.geoLocation
      .getCurrentPosition()
      .then(resp => {
        this.location = new Location(
          resp.coords.latitude,
          resp.coords.longitude
        );
        this.locationIsSet = true;
        loader.dismiss();
      })
      .catch(error => {
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message: "Could not fetch the location , please pick it manually",
          duration: 2500
        });
        toast.present();
        //this.handleError("some error occured");
      });
  }
  handleError(error: string) {}

  onTakePhoto() {
    this.camera
      .getPicture({
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true
      })
      .then(imageData => {
        const currentName = imageData.replace(/^.*[\\\/]/, "");
        const path = imageData.replace(/[^\/]*$/, "");
        const newFileName = new Date().getUTCMilliseconds() + ".jpg";

        this.File.moveFile(
          path,
          currentName,
          cordova.file.dataDirectory,
          newFileName
        )
          .then(data => {
            this.imageUrl = data.nativeURL;
            this.camera.cleanup();
            //this.file.removeFile(path,currentName)
          })
          .catch(error => {
            this.imageUrl = "";
            const toast = this.toastCtrl.create({
              message: "Could not save the image. Please try again",
              duration: 2500
            });
            toast.present();
            this.camera.cleanup();
          });
        //this.imageUrl = imageData;
      })
      .catch(error => {
        console.log(error);
        const toast = this.toastCtrl.create({
          message: "Could not take the image. Please try again",
          duration: 2500
        });
        toast.present();
      });
  }
}
