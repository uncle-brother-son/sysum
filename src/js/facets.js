export default () => ({
    facetButtonHtml: '',
    showFacets: false,
    filterButtonFloat: false,
    facetInit() {
        const facetInline = this.$refs.facetInline;
        const observer = new MutationObserver(() => {
            this.facetButtonHtml = facetInline.innerHTML;
        });
        
        this.facetButtonHtml = facetInline.innerHTML;
        observer.observe(facetInline, { childList: true });

        const setFilterButton = () => {
            const facetEl = document.getElementById('facets-container');
            const facetOffset = facetEl.getBoundingClientRect().top + window.scrollY + 25;
            const { top: footerOffset } = document.getElementById('shopify-section-footer').getBoundingClientRect();
            const browserHeight = window.innerHeight;
            this.filterButtonFloat = window.scrollY > facetOffset || browserHeight > footerOffset;
            this.setFilterButtonPosition();
        };
        
        this.$nextTick(() => {
            setFilterButton();
        });

        window.addEventListener('scroll', () => { 
            setFilterButton();
        })

        window.addEventListener('resize', () => { 
            setFilterButton();
        })
    },
    scrollToTop() {
        this.showFacets = false;
        this.showFilters = false;
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
    },
    setFilterButtonPosition () {
        const floatEl = document.getElementById('facet-float');
        const floatWidth = floatEl.offsetWidth;
        const browserWidth = window.innerWidth;
        const floatElLeft = ((browserWidth - floatWidth)/2)+"px" ;
        floatEl.style.left = floatElLeft;
    }
})