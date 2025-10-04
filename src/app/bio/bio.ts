import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatrixEffect } from '../utils/matrix-bg';

@Component({
  selector: 'app-bio',
  imports: [],
  templateUrl: './bio.html',
  styleUrl: './bio.css',
})
export class Bio implements OnInit, OnDestroy {
  @ViewChild('matrixCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private matrixEffect?: MatrixEffect;

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement;
    this.matrixEffect = new MatrixEffect(canvas, '#00ff90'); // couleur personnalisable
  }

  ngOnDestroy() {
    this.matrixEffect?.stop();
  }
}
