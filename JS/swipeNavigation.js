/*Swipe Navigation Module e Gestione  dei gesti swipe touch e mouse per la navigazione tra le viste*/

export class SwipeNavigation {
  constructor(container, options = {}) {
    this.container = container;
    this.currentIndex = 0;
    this.totalViews = options.totalViews || 3;
    this.threshold = options.threshold || 50; // Distanza minima per considerare uno swipe valido (px)
    this.restraint = options.restraint || 100; // Movimento verticale massimo consentito (px)
    this.allowedTime = options.allowedTime || 500; // Tempo massimo per lo swipe (ms)
    
    // Stato del gesto
    this.startX = 0;
    this.startY = 0;
    this.distX = 0;
    this.distY = 0;
    this.startTime = 0;
    this.elapsedTime = 0;
    
    this.onSwipe = options.onSwipe || (() => {});
    
    this.init();
  }

  /*Inizializza gli event listener per touch e mouse*/
  init() {
    // Eventi touch per dispositivi mobile
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    
    // Eventi mouse per desktop
    this.container.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.container.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.container.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.container.addEventListener('mouseleave', this.handleMouseUp.bind(this));
    
    // Previene il comportamento di drag predefinito del browser
    this.container.addEventListener('dragstart', (e) => e.preventDefault());
  }

  handleTouchStart(e) {
    const touch = e.touches[0];
    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
  }

  handleTouchMove(e) {
  }

  handleTouchEnd(e) {
    const touch = e.changedTouches[0];
    this.distX = touch.clientX - this.startX;
    this.distY = touch.clientY - this.startY;
    this.elapsedTime = Date.now() - this.startTime;
    
    this.evaluateSwipe();
  }

  handleMouseDown(e) {
    this.isMouseDown = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.startTime = Date.now();
    this.container.style.cursor = 'grabbing';
  }

  handleMouseMove(e) {
    if (!this.isMouseDown) return;
  }

  handleMouseUp(e) {
    if (!this.isMouseDown) return;
    
    this.isMouseDown = false;
    this.distX = e.clientX - this.startX;
    this.distY = e.clientY - this.startY;
    this.elapsedTime = Date.now() - this.startTime;
    this.container.style.cursor = 'grab';
    
    this.evaluateSwipe();
  }

  /*Valuta se il gesto soddisfa i criteri per essere considerato uno swipe valido*/
  evaluateSwipe() {
    if (this.elapsedTime <= this.allowedTime) {
      if (Math.abs(this.distX) >= this.threshold && Math.abs(this.distY) <= this.restraint) {
        const direction = this.distX < 0 ? 'left' : 'right';
        this.handleSwipe(direction);
      }
    }
    
    this.distX = 0;
    this.distY = 0;
  }

  /*Gestisce la direzione dello swipe e naviga alla vista appropriata*/
  handleSwipe(direction) {
    let newIndex = this.currentIndex;
    
    if (direction === 'left' && this.currentIndex < this.totalViews - 1) {
      newIndex = this.currentIndex + 1;
    } else if (direction === 'right' && this.currentIndex > 0) {
      newIndex = this.currentIndex - 1;
    }
    
    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;
      this.onSwipe(newIndex);
    }
  }

  /*Naviga programmaticamente a una vista specifica*/
  goToView(index) {
    if (index >= 0 && index < this.totalViews && index !== this.currentIndex) {
      this.currentIndex = index;
      this.onSwipe(index);
    }
  }

  getCurrentIndex() {
    return this.currentIndex;
  }
}