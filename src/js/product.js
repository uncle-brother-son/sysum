export default ({ slideCount }) => ({
    prodFeature: null,
    slideCount: slideCount,
    currentImg: 1,
    zoomed: false,
    zoomX: 0,
    showCTA: false,
    slides: [],
    gift: false,
    bg_loader: true,
    productInit() {
        for (let i = 1; i <= slideCount; i++) {
            this.slides.push(this.$refs[`img${i}`]);
        }
        // Hide floating CTA when ProductInfo or footer is on screen 
        const observer = new IntersectionObserver(entries => {
            let isAnyIntersecting = false;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isAnyIntersecting = true;
                }
            });
            this.showCTA = !isAnyIntersecting;
          })
        const objects = document.querySelectorAll('[id^="ProductInfo-"], #shopify-section-footer');
        objects.forEach(object => observer.observe(object));

        // Set PDP button state
        let CTAList = document.querySelectorAll('[id^="ProductSubmitButton-"]');
        var sizeRadios = document.querySelectorAll('input[type="radio"][name="Size"]');
        if (sizeRadios.length > 0) {
            var isSizeChecked = false;
        } else {
            var isSizeChecked = true;
        }

        sizeRadios.forEach(function(radio) {
            if (radio.checked) {
                isSizeChecked = true;
            }
        });

        CTAList.forEach(function(CTA) {
            CTA.disabled = !isSizeChecked;
        });

        // Set Description tab open on desktop
        if (!this.isMobile) {
            setTimeout(() => this.prodFeature = 1, 320)
        }
     
    },
    zoomStart(imageIndex) {
        this.currentImg = imageIndex;
        let start = '';
        if (!this.isMobile) {
            if (imageIndex === this.slideCount) { start = 'right' } else { start = 'left' } 
        } else {
            start = 'center'
        }
        this.slideSwap(null, imageIndex, start);
        this.zoomView = true;
        this.bg_loader = true;
    },
    setImage(zoom, imageIndex) {
        let imageHeight = 0;
        let imageWidth = 0;
        
        const image = this.$refs[`img${imageIndex}`].querySelector('img');
        const container = image.parentElement;

        if (this.isMobile){
            imageHeight = (120*zoom)+'vh';
            imageWidth = (96*zoom)+'vh';
        } else {
            imageHeight = (125*zoom)+'vw';
            imageWidth = (100*zoom)+'vw';
        }

        image.style.height = imageHeight;
        image.style.width = imageWidth;

        this.$nextTick(() => {
            const scrollTop = (image.offsetHeight - window.innerHeight)/2;
            const scrollLeft = (image.offsetWidth - window.innerWidth)/2;
            container.scrollTo(scrollLeft,  scrollTop);
        });
        
        this.zoomX = 0;
    },
    slideSwap(previousSlide, nextSlide, direction) {
        
        if (direction === 'left' || direction === 'right') {
            this.$refs[`img${nextSlide}`].style.transform = `translateX(${direction === 'left' ? '-16px' : '16px'})`;
        } else if (direction === 'center') {
            this.$refs[`img${nextSlide}`].style.transform = 'translateX(0px)';
        }

        this.$nextTick(() => {
            this.slides.forEach((slide, index) => {
                if (index === previousSlide-1) {
                    slide.style.opacity = '0';
                    slide.style.transition = 'opacity 0.32s';
                    slide.style.transitionTimingFunction = 'cubic-bezier(0.4,0.4,0.4,1)';
                    slide.style.zIndex = '1';
                } else if (index === nextSlide-1) {
                    slide.style.opacity = '1';
                    slide.style.transform = 'translateX(0)';
                    slide.style.transition = 'opacity 0.32s 0.32s, transform 0.32s 0.32s';
                    slide.style.transitionTimingFunction = 'cubic-bezier(0.4,0.4,0.4,1)';
                    slide.style.zIndex = '2';
                } else {
                    slide.style.transition = 'none';
                    slide.style.zIndex = '1';
                }
            });
            this.setImage(1, nextSlide);
        });
    },
    prev() {
        const direction = 'left';
        let prevImage = 0;
        prevImage = this.currentImg;
        this.currentImg--;        
        if (this.currentImg === 0) { this.currentImg = this.slideCount; prevImage = 1 }
        this.slideSwap(prevImage, this.currentImg, direction);
        this.bg_loader = false;
    },
    next() {
        const direction = 'right';
        let prevImage = 0;
        prevImage = this.currentImg;
        this.currentImg++;
        if (this.currentImg === this.slideCount+1) { this.currentImg = 1; prevImage = this.slideCount }
        this.slideSwap(prevImage, this.currentImg, direction);
        this.bg_loader = false;
    },
    zoomImg(imgNum) {
        const currentImg = 'img'+imgNum;
        const image = this.$refs[currentImg].querySelector('img');
        if (image) {
            if (!this.zoomed) {
                if (this.zoomX == 0) {
                    this.setImage(2, imgNum);
                    this.zoomX = 1;
                    this.zoomed = true; // Set zoom depth
                } else if (this.zoomX == 1) {
                    this.setImage(3, imgNum);
                    this.zoomX = 2;
                }
            } else {
                this.setImage(1, imgNum);
                this.zoomX = 0;
                this.zoomed = false;
            }
        }
    },
    zoomClose() {
        this.zoomView = false;
        this.slides.forEach((slide) => {
            slide.style.opacity = '0';
            slide.style.transition = 'none';
            slide.style.zIndex = '1';
        });
    },
    pageScroll(hook) {
        setTimeout(() => {
            this.$refs[hook].scrollIntoView({ behavior: 'smooth' })
        }, "320");
    }
})