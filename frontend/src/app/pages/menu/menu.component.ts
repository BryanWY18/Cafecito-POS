import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../core/types/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone:true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  user: User | null=null;
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.data.subscribe(data=>{
      console.log(data['user']);
      this.user=data['user'];
    })
  }

}
