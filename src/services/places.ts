import { Place } from "../models/place";
import { Location } from "../models/location";
import { Storage } from "@ionic/storage";
import { Injectable } from "@angular/core";
import { File } from "@ionic-native/file";
declare var cordova;
@Injectable()
export class PlacesService {
  private places: Place[] = [];
  constructor(private storage: Storage, private File: File) {}
  addPlace(
    title: string,
    description: string,
    location: Location,
    imageUrl: string
  ) {
    const place = new Place(title, description, location, imageUrl);
    this.places.push(place);
    this.storage
      .set("places", this.places)
      .then(data => {
        console.log("data", data);
      })
      .catch(err => {
        this.places.splice(this.places.indexOf(place), 1);
      });
  }

  loadPlace() {
    return this.places.slice();
  }

  fetchPlaces() {
    return this.storage
      .get("places")
      .then((places: Place[]) => {
        console.log("print places", places);
        this.places = places || [];
        return places;
      })
      .catch(error => {});
  }

  deletePlace(index: number) {
    const place = this.places[index];
    this.places.splice(index, 1);
    this.storage
      .set("places", this.places)
      .then(() => {
        this.removeFile(place);
      })
      .catch(error => {
        console.log(error);
      });
  }

  private removeFile(place: Place) {
    const currentName = place.imageUrl.replace(/^.*[\\\/]/, "");
    this.File.removeFile(cordova.file.dataDirectory, currentName)
      .then(res => {
        console.log("removed file");
      })
      .catch(err => {
        console.log("Error while removing file");
        this.addPlace(
          place.title,
          place.description,
          place.location,
          place.imageUrl
        );
      });
  }
}
