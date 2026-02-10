export default ({ slideCount, deskScroll, hasPadding }) => ({
    slideCount: slideCount,
    deskScroll: deskScroll,
    hasPadding: hasPadding,
    inset: 1,
    currentSlide: 0,
    viewWidth: 0,
    carouselWidth: 0,
    startX: 0,
    startY: 0,
    carouselCurrentPos: 0,
    carouselDragPos: 0,
    isDragging: false,
    scrollDirection: false,
    scrollVertical: false,
    isMobile: false,
    isTouch: false,
    sliding: false,
    scrollDiff: 0,
    sliderInit() {
        window.addEventListener('resize', () => {
            this.isMobile = (window.innerWidth < 768) ? true : false;
            this.isTouch = window.matchMedia('(pointer:coarse)').matches;
            if (this.isMobile || this.deskScroll){
                const scrollPos = this.carouselWidth * this.currentSlide;
                this.$refs.carousel.style.transform = `translateX(-${scrollPos}px)`;
            } else {
                this.$refs.carousel.style.transform = `translateX(0px)`;
            }
            this.setCarouselWidth()
        });
        this.isMobile = (window.innerWidth < 768) ? true : false;
        this.isTouch = window.matchMedia('(pointer:coarse)').matches;
        this.$nextTick(() => {
            this.setCarouselWidth();
        });

        // Wheel listner, non mobile only
        if (!this.isMobile && this.deskScroll){
            let scrollTimeout;
            let scrollStartDirection = '';
            this.$refs.carouselView.addEventListener("wheel", (event) => {
                
                let currentScrollDirection = event.deltaX == 0 ? 'vertical' : 'horizontal';
                if (!scrollStartDirection) { scrollStartDirection = currentScrollDirection; }

                if (scrollStartDirection == 'horizontal') {
                    this.scrollDiff -= event.deltaX; 
                    this.carouselDragPos = Math.max( Math.min(this.carouselCurrentPos + this.scrollDiff, 0), -this.carouselWidth * (slideCount - this.inset));
                    this.$refs.carousel.style.transform = `translateX(${this.carouselDragPos}px)`;
                }

                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => { 
                    if (scrollStartDirection == 'horizontal') {
                        this.moveToCurrentSlide(-this.scrollDiff); 
                        this.scrollDiff = 0;
                    }
                    scrollStartDirection = '';
                }, 240);

            });
        }
    },
    setCarouselWidth() {
        this.viewWidth = this.$refs.carouselView.offsetWidth;
        this.carouselWidth = this.$refs.carouselItem.offsetWidth;
        this.inset = Math.round(this.viewWidth / this.carouselWidth);
        if (this.isMobile || this.deskScroll) {
            if (this.hasPadding){
                this.$refs.carousel.style.width = (this.carouselWidth*slideCount) - 8 + 'px';
            } else {
                this.$refs.carousel.style.width = (this.carouselWidth*slideCount) + 'px';
            }
        } else if (!this.isMobile && !this.deskScroll){
            this.$refs.carousel.style.width = (this.carouselWidth) + 'px';
        }
    },
    press(event) {
        if (this.isMobile || this.deskScroll) { 
            this.isDragging = true; 
            this.startX = event.clientX || event.touches[0].clientX;
            this.startY = event.clientY || event.touches[0].clientY;
            const computedStyle = window.getComputedStyle(this.$refs.carousel);
            const transformValue = computedStyle.getPropertyValue('transform');
        }
    },
    slide(event) {
        if (!this.isDragging) return;
        if (!this.scrollDirection && this.isTouch) {
          const touchCurrentX = event.touches[0].clientX;
          const touchCurrentY = event.touches[0].clientY;
          const deltaX = Math.abs(touchCurrentX - this.startX);
          const deltaY = Math.abs(touchCurrentY - this.startY);
          this.scrollVertical = deltaX <= deltaY;
          this.scrollDirection = true;
        }
        if (this.scrollVertical) return;
        event.preventDefault();
        this.$refs.carousel.style.transitionTimingFunction = '';
        this.$refs.carousel.style.transitionDuration = '';
        const x = event.clientX || event.touches[0].clientX;
        this.scrollDiff = x - this.startX;
        this.carouselDragPos = Math.max( Math.min(this.carouselCurrentPos + this.scrollDiff, 0), -this.carouselWidth * (slideCount - this.inset));
        this.$refs.carousel.style.transform = `translateX(${this.carouselDragPos}px)`;
        this.sliding = true;
    },
    release() {
        this.scrollDirection = false;
        this.scrollVertical = false;
        this.isDragging = false;
        this.moveToCurrentSlide(-this.scrollDiff);
        this.scrollDiff = 0;
    },
    click(event){
        if (this.sliding) { 
            event.preventDefault();
        }
        this.sliding = false;
    },
    leave() {
        this.isDragging = false;
        this.scrollDirection = false;
        this.moveToCurrentSlide(-this.scrollDiff);
    },
    moveToCurrentSlide(distance) {
        let slidesScrolled = Math.round(distance / this.$refs.carouselItem.offsetWidth) 
        if (slidesScrolled == 0 && distance != 0){
            if (distance < 0){ slidesScrolled -= 1 } else { slidesScrolled += 1 }
        }
        this.currentSlide = this.currentSlide + slidesScrolled
        this.currentSlide = Math.max(0, Math.min(this.currentSlide, this.slideCount - this.inset));
        if (this.isMobile || this.deskScroll) {
            const scrollPos = this.carouselWidth * this.currentSlide;
            this.carouselCurrentPos = -scrollPos;
            this.$refs.carousel.style.transform = `translateX(-${scrollPos}px)`;
            this.$refs.carousel.style.transitionTimingFunction = 'cubic-bezier(0.295, 0.850, 0.440, 1.000)';
            this.$refs.carousel.style.transitionDuration = '640ms';
        }
    }
})