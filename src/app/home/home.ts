import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Bio } from '../bio/bio';
import { Projets } from '../projets/projets';
import { Experiences } from '../experiences/experiences';
import { Contact } from '../contact/contact';
import { ParallaxStandaloneDirective } from '@yoozly/ngx-parallax';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Bio, Projets, Experiences, Contact, ParallaxStandaloneDirective],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;

  // nombre de sections (4 dans ton cas)
  readonly sections = 4;
  currentIndex = 0;
  isAnimating = false;

  // touch
  private touchStartY = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // assure la position initiale
    this.updateTransform();

    // remettre isAnimating à false à la fin de la transition
    this.renderer.listen(this.container.nativeElement, 'transitionend', () => {
      this.isAnimating = false;
    });
  }

  // roue / molette
  onWheel(event: WheelEvent) {
    event.preventDefault(); // important pour bloquer le scroll natif
    if (this.isAnimating) return;

    const delta = event.deltaY;
    if (delta > 0) this.next();
    else if (delta < 0) this.prev();
  }

  // touch mobile: start / end
  onTouchStart(e: TouchEvent) {
    this.touchStartY = e.touches[0].clientY;
  }

  onTouchEnd(e: TouchEvent) {
    if (this.isAnimating) return;
    const endY = e.changedTouches[0].clientY;
    const diff = this.touchStartY - endY;
    const threshold = 50; // pixels mini pour déclencher
    if (diff > threshold) this.next();
    else if (diff < -threshold) this.prev();
  }

  // navigation programmatique
  goTo(index: number) {
    if (index < 0 || index >= this.sections || index === this.currentIndex) return;
    this.currentIndex = index;
    this.animateTo(index);
  }

  next() {
    if (this.currentIndex < this.sections - 1) {
      this.currentIndex++;
      this.animateTo(this.currentIndex);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.animateTo(this.currentIndex);
    }
  }

  private animateTo(index: number) {
    this.isAnimating = true;
    const y = -index * window.innerHeight;
    // applique transform; la transition CSS fait l'animation
    this.renderer.setStyle(this.container.nativeElement, 'transform', `translateY(${y}px)`);
  }

  private updateTransform() {
    const y = -this.currentIndex * window.innerHeight;
    this.renderer.setStyle(this.container.nativeElement, 'transform', `translateY(${y}px)`);
  }

  // recalculer si redimensionnement de la fenêtre (responsive)
  @HostListener('window:resize')
  onResize() {
    this.updateTransform();
  }

  // clavier (optionnel) — flèches / PageUp / PageDown / Home / End
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.isAnimating) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault();
        this.next();
        break;
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        this.prev();
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(0);
        break;
      case 'End':
        event.preventDefault();
        this.goTo(this.sections - 1);
        break;
    }
  }
}
