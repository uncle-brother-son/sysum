export default ({ slideCount }) => ({
    currentSlide: 0,
    slideCount: slideCount,
    isMobile: false,
    zoomed: false,
    zoomX: 0,
    init() {
        this.isMobile = (window.innerWidth < 480) ? true : false;
        this.disableControls();
    },
    zoomStart (slide) {
        this.applySlideTransition(0, slide, 'right');
        console.log('zoom');
    },
    zoomImg(imgNum) {
        const currentImg = 'img'+imgNum;
        const image = this.$refs[currentImg].querySelector('img');
        
        if (image) {
            if (!this.zoomed) {
                if (this.zoomX == 0) {
                    image.style.transform = 'scale(1.5)';
                    this.zoomX = 1;
                } else if (this.zoomX == 1) {
                    image.style.transform = 'scale(3)';
                    this.zoomX = 2;
                    this.zoomed = true;
                }
                image.style.transition = 'transform 0.3s';
            } else {
                image.style.transform = 'none';
                image.style.transition = 'transform 0.3s';
                this.zoomX = 0;
                this.zoomed = false;
            }
        }
    },
    prev() {
        const previousSlide = this.currentSlide;
        const direction = 'left';
        if (this.currentSlide === 0) { this.currentSlide = 0; } else { this.currentSlide--; }
        this.applySlideTransition(previousSlide, this.currentSlide, direction);
        this.disableControls();
    },
    next() {
        const previousSlide = this.currentSlide;
        const direction = 'right';
        if (this.currentSlide === this.slideCount - 1) { this.currentSlide = this.slideCount - 1; } else { this.currentSlide++; }
        this.applySlideTransition(previousSlide, this.currentSlide, direction);
        this.disableControls();
    },
    disableControls() {
        if (this.$refs.left){
            this.$refs.left.disabled = false;
            this.$refs.right.disabled = false;
            if ( this.currentSlide == 0 ) {
                this.$refs.left.disabled = true;
            } else if ( this.currentSlide == this.slideCount - 1 ) {
                this.$refs.right.disabled = true;
            }
        }
    },
    applySlideTransition(previousSlide, nextSlide, direction) {

        console.log('show');

        const slides = [this.$refs.img1, this.$refs.img2, this.$refs.img3, this.$refs.img4, this.$refs.img5, this.$refs.img6]
    
        if (direction === 'left') {
            this.$refs[`img${nextSlide + 1}`].style.transform = 'translateX(-16px)';
          } else if (direction === 'right') {
            this.$refs[`img${nextSlide + 1}`].style.transform = 'translateX(16px)';
          }
          
          this.$nextTick(() => {
            slides.forEach((slide, index) => {
              if (index === previousSlide) {
                slide.style.opacity = '0';
                slide.style.transform = 'translateX(0)';
                slide.style.transition = 'opacity 0.32s, transform 0.32s';
              } else if (index === nextSlide) {
                slide.style.opacity = '1';
                slide.style.transform = 'translateX(0)';
                slide.style.transition = 'opacity 0.32s, transform 0.32s';
              } else {
                slide.style.transition = 'none';
              }
            });
          });
    }
})