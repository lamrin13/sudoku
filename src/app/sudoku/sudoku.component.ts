import { Component, OnInit } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import puzzle from "./puzzles.json"

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss'],
  animations: [trigger("colorState", [
    state(
      "lightblue",
      style({
        background: "lightblue",
      })
    ),
    state(
      "blue",
      style({
        background: "#c5cae9",
      })
    ),
    state(
      "#1a237e",
      style({
        background: "#1a237e",
        color: "white"
      })
    ),
    state(
      "red",
      style({
        background: "purple",
        color: "white"
      })
    ),
    transition("* => *", animate("30ms steps(1)")),
  ]),
]
})
export class SudokuComponent implements OnInit {

  constructor() { 
    this.cols = 9;
    this.rows = 9;
    this.grid =[];
    this.currentPuzzle = puzzle[0];
    for(let i=0;i<10;i++)
      this.count[i] = 0;
    for(let i=0;i<this.rows;i++){
      this.grid[i] = [];
      for(let j=0;j<this.cols;j++){
        this.grid[i][j]=this.currentPuzzle[i*9+j];
        this.count[this.currentPuzzle[i*9+j]]++;
      }
    }
    console.log(this.count);
  }

  cols: number;
  rows: number;
  grid: number[][];
  colorState: string[][] =[];
  buttons: number[] =[];
  xSelected: number = -1;
  ySelected: number = -1;
  breakpoint: number = 1;
  currentPuzzle: number[] = [];
  activeButton: boolean[] = [];
  count: number[] = [];
  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 450) ? 3 : 1;
    this.defaultColor();
    for(let i=0;i<9;i++){
      this.buttons[i] = i+1;
    }
  }
  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 450) ? 3 : 1;
  }
  defaultColor(){
    for(let i=0;i<this.rows;i++){
      this.colorState[i]=[];
      for(let j=0;j<this.cols;j++){
        if((i<3 && j<3) || (i>5 && j>5) || (i>5 && j<3) || (i<3 && j>5) || (i>2 && i<6 && j>2 && j<6)){
          this.colorState[i][j]="blue";
        }
        else{
          this.colorState[i][j]="lightblue";
        }
      }
    }
  }
  selectCell(x: number,y: number){
    this.defaultColor();
    this.xSelected=x;
    this.ySelected=y;
    console.log("here",this.grid[x][y])
    if(this.grid[x][y]==0){
      this.colorState[x][y]="#1a237e"
    }
    else{
      for(let i=0;i<this.rows;i++)
        for(let j=0;j<this.cols;j++){
          if(this.grid[i][j]==this.grid[x][y])
            this.colorState[i][j]="#1a237e"
        }
    }
    this.validate();
  }

  fillValue(n: number){
    // console.log(n,this.xSelected,this.ySelected,this.count[n]);
    if(this.xSelected>=0){
      this.grid[this.xSelected][this.ySelected] = n;
      this.count[n]++;
      if(this.count[n]==9)
        this.activeButton[n-1]=true;
      this.defaultColor();
      this.colorState[this.xSelected][this.ySelected]="#1a237e"
      this.selectCell(this.xSelected,this.ySelected)
    }
  }

  eraseValue(){
    this.grid[this.xSelected][this.ySelected] = 0;
    this.colorState[this.xSelected][this.ySelected] = "lightblue";
    this.defaultColor();
  }

  validate(){
    let flag = false;
    for(let i=0;i<this.rows;i++){
      if(this.xSelected!=i && this.grid[i][this.ySelected]==this.grid[this.xSelected][this.ySelected] && this.grid[this.xSelected][this.ySelected]!=0){
        this.colorState[i][this.ySelected] = "red";
        flag = true;
      }
      if(flag)
        this.colorState[this.xSelected][this.ySelected] = "red";
    }
    for(let i=0;i<this.cols;i++){
      if(this.ySelected!=i && this.grid[this.xSelected][i]==this.grid[this.xSelected][this.ySelected] && this.grid[this.xSelected][this.ySelected]!=0){
        this.colorState[this.xSelected][i] = "red";
        flag = true;
      }
      if(flag)
        this.colorState[this.xSelected][this.ySelected] = "red";
    }
    let x = Math.floor(this.xSelected/3)*3;
    let y = Math.floor(this.ySelected/3)*3;  
    for(let i=x;i<x+3;i++){
        for(let j=y;j<y+3;j++){
          if(this.xSelected!=i && this.ySelected!=j && this.grid[i][j]==this.grid[this.xSelected][this.ySelected] && this.grid[this.xSelected][this.ySelected]!=0){
            this.colorState[i][j]="red";
            flag = true;
          }
        }
        
        if(flag)
          this.colorState[this.xSelected][this.ySelected] = "red";
    }
  }
  
  
}
