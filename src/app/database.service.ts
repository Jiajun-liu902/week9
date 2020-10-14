import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers:new HttpHeaders({'Content-Type':'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http:HttpClient) { }

  getActors(){
    return this.http.get('/actors/');
  }
  getActor(id:string){
    let url = '/actors/'+ id;
    return this.http.get(url);
  }

  createActor(data){
    const httpOptions = {
      headers:new HttpHeaders({'Content-Type':'application/json'})
    }
    return this.http.post('/actors',data,httpOptions);
  }

  updateActor(id,data){
    let url = '/actors/'+ id;
    return this.http.get(url);
  }

  deleteActor(id){
    let url = '/actors/'+ id;
    return this.http.delete(url,httpOptions);
  }
}
