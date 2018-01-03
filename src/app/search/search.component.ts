import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from "../_services/server.service";
import { Data } from "../_services/data";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private data: Data = new Data();
  private pages: Number[];
  private sub:any;

  constructor(private serv: ServerService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.sub=this.route
    .queryParams
    .subscribe(params => {
      this.searchData(params['query'],params['page']);
    });
  }

  searchData(query?:String, page?:Number){
    let q:String = query ? query : "";
    let p:Number = page ? page : 0;
    
    this.serv.search(q,p)
    .subscribe(
      data => {
        this.data.queryString=data.queryString,
        this.data.itemCount=data.itemCount,
        this.data.pages=data.pages,
        this.data.page=data.page,
        this.data.items=data.items

       this.pages=Array.from(Array(this.data.pages).keys());
      },
      error => console.error("error")
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
