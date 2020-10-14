import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css']
})
export class ActorComponent implements OnInit {

  constructor(private dbService:DatabaseService) { }

  ngOnInit(): void {
  }

  section = 1;
  actorsDB:any[] = [];
  fullName = '';
  bYear = 0;
  actorId = '';
  changeSection(sectionId){
    this.section = sectionId;
  }

  onGetActors(){
    this.dbService.getActors().subscribe((data:any)=>{
      this.actorsDB = data;
    })
  }

  onSaveActors(){
    let obj = {name:this.fullName,bYear:this.bYear};
    this.dbService.createActor(obj).subscribe(result=>{
      this.onGetActors();
    })
  }

  onSelectActor(item){
    this.bYear = item.bYear;
    this.fullName = item.name;
    this.actorId = item._id;
  }

  onSaveActor(){
    let obj = {name:this.fullName,bYear:this.bYear};
    this.dbService.createActor(obj).subscribe(result=>{
      this.onGetActors();
    })
  }

  onSelectUpdate(item){
    this.bYear = item.bYear;
    this.fullName = item.fullName;
    this.actorId = item._id;
  }

  onUpdateActor(){
    let obj = {name:this.fullName,bYear:this.bYear};
    this.dbService.updateActor(this.actorId,obj).subscribe(result=>{
      this.onGetActors();
    })
  }

  onDeleteActor(item){
    this.dbService.deleteActor(item._id).subscribe(result=>{
      this.onGetActors();
    })
  }

  resetValue(){
    this.actorId = '';
    this.fullName = '';
    this.bYear = 0;
  }

}
